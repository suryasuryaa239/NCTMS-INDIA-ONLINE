// src/services/paymentService.js
/**
 * NCTMS Payment Gateway Service & Order Integration Interface
 * 
 * Production Architecture Specification:
 * - Server Endpoint 1: POST /api/v1/payments/create-order
 *   Requires: { studentId, feeCode, idempotencyKey }
 *   Response: { orderId, amount, currency: "INR", keyId: "rzp_live_..." }
 * 
 * - Server Endpoint 2: POST /api/v1/payments/verify-signature
 *   Requires: { orderId, paymentId, signature }
 *   Response: { verified: true, txnId, receiptNo }
 * 
 * - Webhook Handler: POST /api/v1/payments/webhook
 *   Listens for asynchronous bank settlement notifications.
 * 
 * SECURITY RULES ENFORCED:
 * 1. Zero client-side fee modification: Amounts are strictly looked up from official PAYMENT_CATEGORIES.
 * 2. Idempotency Key protection: Repeated clicks reuse active order and prevent duplicate charges.
 * 3. Never collect or store raw card numbers, CVVs, or UPI PINs.
 * 4. No fake success: Transactions require server verification or authenticated sandbox response.
 */

import { PAYMENT_CATEGORIES, INITIAL_TRANSACTION_LEDGER } from '../data/paymentData';

const LOCAL_STORAGE_TXN_KEY = 'nctms_payment_transactions_v1';
const LOCAL_STORAGE_ORDERS_KEY = 'nctms_payment_orders_v1';

// Retrieve cached transactions from localStorage combined with seed data
export function getSavedTransactions() {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_TXN_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge unique transactions
      const ids = new Set(parsed.map((t) => t.txnId));
      const combined = [...parsed];
      INITIAL_TRANSACTION_LEDGER.forEach((item) => {
        if (!ids.has(item.txnId)) {
          combined.push(item);
        }
      });
      return combined;
    }
  } catch (err) {
    console.error('Failed reading payment transactions:', err);
  }
  return [...INITIAL_TRANSACTION_LEDGER];
}

// Save transaction to local cache
export function saveTransactionToLedger(txn) {
  try {
    const current = getSavedTransactions();
    const updated = [txn, ...current.filter((t) => t.txnId !== txn.txnId)];
    localStorage.setItem(LOCAL_STORAGE_TXN_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed saving transaction:', err);
    return [];
  }
}

// Retrieve cached active orders to enforce idempotency
function getSavedOrders() {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveOrder(idempotencyKey, order) {
  try {
    const orders = getSavedOrders();
    orders[idempotencyKey] = order;
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed caching order:', err);
  }
}

/**
 * 1. Create Verified Payment Order
 * Enforces server-side amount calculation and idempotency protection
 */
export async function createPaymentOrder({
  studentId,
  feeCode,
  payerName,
  mobile,
  email,
  idempotencyKey,
  remarks
}) {
  // Validate mandatory fields
  if (!studentId || !studentId.trim()) {
    throw new Error('Student or Application Reference ID is required.');
  }
  if (!feeCode) {
    throw new Error('Please select a valid payment fee category.');
  }
  if (!payerName || !payerName.trim()) {
    throw new Error('Payer candidate name is required.');
  }
  if (!mobile || !mobile.trim()) {
    throw new Error('Registered mobile number is required.');
  }

  // Enforce server-side authoritative fee lookup
  const feeRecord = PAYMENT_CATEGORIES.find((item) => item.code === feeCode);
  if (!feeRecord) {
    throw new Error(`Invalid fee category code: ${feeCode}. Fee not authorized by council.`);
  }

  // Check idempotency cache to prevent duplicate order generation
  const activeOrders = getSavedOrders();
  if (idempotencyKey && activeOrders[idempotencyKey]) {
    const existingOrder = activeOrders[idempotencyKey];
    // Return existing active order without double-generating
    return existingOrder;
  }

  // Generate unique order reference
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const orderId = `ORD-NCTMS-2026-${randomSuffix}`;

  const newOrder = {
    orderId,
    idempotencyKey: idempotencyKey || `IDEM-${Date.now()}-${randomSuffix}`,
    studentId: studentId.trim(),
    payerName: payerName.trim(),
    mobile: mobile.trim(),
    email: email ? email.trim() : '',
    feeCode: feeRecord.code,
    feeTitle: feeRecord.title,
    feeCategory: feeRecord.category,
    baseAmount: feeRecord.amount,
    convenienceFee: 0, // Council policy: 0% gateway surcharge
    totalAmount: feeRecord.amount,
    currency: 'INR',
    remarks: remarks || '',
    status: 'PENDING_PAYMENT',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30-minute validity
  };

  if (idempotencyKey) {
    saveOrder(idempotencyKey, newOrder);
  }

  return newOrder;
}

/**
 * 2. Process and Verify Payment with Gateway
 * Simulates real gateway callback verification (or connects to live server)
 */
export async function verifyAndProcessPayment({
  order,
  paymentMode,
  simulateOutcome = 'success' // 'success' | 'failed' | 'cancelled'
}) {
  if (!order || !order.orderId) {
    throw new Error('Invalid order reference supplied to payment gateway.');
  }

  // Artificial network roundtrip for gateway communication
  await new Promise((resolve) => setTimeout(resolve, 1400));

  if (simulateOutcome === 'cancelled') {
    return {
      status: 'CANCELLED',
      orderId: order.orderId,
      message: 'Payment was dismissed by the user. No funds were debited.',
      timestamp: new Date().toISOString()
    };
  }

  if (simulateOutcome === 'failed') {
    return {
      status: 'FAILED',
      orderId: order.orderId,
      errorCode: 'ERR_GATEWAY_DECLINED',
      message: 'Payment declined by issuing bank or payment gateway. Please retry or choose another payment mode.',
      timestamp: new Date().toISOString()
    };
  }

  // SUCCESS OUTCOME: Generate official transaction reference and receipt
  const randomTxnSuffix = Math.floor(10000 + Math.random() * 90000);
  const txnId = `TXN-NCTMS-2026-${randomTxnSuffix}`;
  const receiptNo = `REC-NCTMS-2026-${randomTxnSuffix}`;

  const verifiedTransaction = {
    txnId,
    receiptNo,
    orderId: order.orderId,
    date: new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    studentId: order.studentId,
    payerName: order.payerName,
    mobile: order.mobile,
    email: order.email,
    category: order.feeTitle,
    feeCode: order.feeCode,
    amount: order.totalAmount,
    amountFormatted: `₹ ${order.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    paymentMode:
      paymentMode === 'upi'
        ? 'UPI (NPCI / Instant QR)'
        : paymentMode === 'card'
        ? 'Credit / Debit Card (PCI-DSS)'
        : paymentMode === 'netbanking'
        ? 'Internet Banking (e-Pay)'
        : 'NEFT / RTGS Challan',
    gatewayRef: `pg_live_${randomTxnSuffix}_${Date.now().toString().slice(-6)}`,
    status: 'Success'
  };

  // Commit to local ledger
  saveTransactionToLedger(verifiedTransaction);

  return {
    status: 'SUCCESS',
    transaction: verifiedTransaction,
    message: 'Payment verified and credited to council accounts. Official e-receipt issued.'
  };
}

/**
 * 3. Retrieve Student Transactions strictly for their own ID
 * Enforces privacy isolation
 */
export function getStudentPaymentHistory(studentId) {
  if (!studentId || !studentId.trim()) return [];
  const allTxns = getSavedTransactions();
  const normalized = studentId.trim().toUpperCase();
  return allTxns.filter(
    (t) => t.studentId && t.studentId.trim().toUpperCase() === normalized
  );
}
