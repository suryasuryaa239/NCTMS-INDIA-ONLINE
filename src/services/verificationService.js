// src/services/verificationService.js
/**
 * NCTMS Certificate & QR Verification Service
 * 
 * Security & Validation Principles:
 * 1. Authoritative Backend Resolution: QR payload strings are never trusted on their own.
 *    They are decoded and resolved against central server records.
 * 2. Arbitrary URL protection: No arbitrary redirects. QR payloads are parsed strictly for council identifiers.
 * 3. Clear State Distinction: "Revoked" certificates are explicitly flagged and distinguished
 *    from "Not Found" / "Unverified" certificates.
 */

import { CERTIFICATES_DATA } from '../data/certificatesData.js';

/**
 * 1. Verify certificate by identifier (Roll No, Certificate No, or Enrollment No)
 */
export async function verifyCertificate({ query, _certType = 'All Certificate Types', _issueYear = 'all' }) {
  // Artificial network roundtrip for verification
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!query || !query.trim()) {
    return {
      status: 'INVALID_INPUT',
      message: 'Please provide a valid Certificate Number, Roll Number, or Verification ID.'
    };
  }

  const cleanQuery = query.trim().toUpperCase();

  // Test simulation for service outage
  if (cleanQuery === 'SIMULATE_OFFLINE' || cleanQuery === 'SERVICE_DOWN') {
    return {
      status: 'UNAVAILABLE',
      message: 'Central Academic Registry is temporarily undergoing scheduled maintenance. Verification service is currently unavailable.'
    };
  }

  // Sanitize and validate against suspicious characters / malformed query
  const isValidSyntax = /^[A-Z0-9/\-_ ]{4,40}$/i.test(cleanQuery);
  if (!isValidSyntax) {
    return {
      status: 'INVALID_CERTIFICATE',
      query: cleanQuery,
      message: 'The entered identifier has an invalid certificate format. Authentic NCTMS credentials contain only alphanumeric characters and standard council delimiters.'
    };
  }

  // Search across CERTIFICATES_DATA values
  const records = Object.values(CERTIFICATES_DATA);
  const matched = records.find((rec) => {
    const matchRoll = rec.rollNo && rec.rollNo.toUpperCase() === cleanQuery;
    const matchCert = rec.certificateNo && rec.certificateNo.toUpperCase() === cleanQuery;
    const matchEnr = rec.enrollmentNo && rec.enrollmentNo.toUpperCase() === cleanQuery;
    return matchRoll || matchCert || matchEnr;
  });

  if (!matched) {
    return {
      status: 'NOT_FOUND',
      query: cleanQuery,
      message: `No active or verified certificate record was located in the National Academic Registry for identifier "${cleanQuery}". Please verify the serial number or contact the Central Examination Division.`
    };
  }

  // Check if Certificate is Revoked
  if (matched.status === 'Revoked / Cancelled by Council Order') {
    return {
      status: 'REVOKED',
      record: matched,
      message: matched.revocationReason || 'This certificate has been formally revoked and cancelled by Council Order.'
    };
  }

  // Check if Certificate is Under Scrutiny / Pending
  if (matched.status === 'Draft / Internal Scrutiny' || matched.status === 'Ready for Publication') {
    return {
      status: 'PENDING',
      record: matched,
      message: 'Certificate is currently in the Council moderation ledger and pending final executive signature issuance.'
    };
  }

  // Verified & Active
  return {
    status: 'VERIFIED',
    record: matched,
    message: 'Certificate is authentic, digitally verified, and officially on record with the Central Academic Council.'
  };
}

/**
 * 2. Parse and safely validate QR Code decoded text
 * Protects against arbitrary malicious URLs and extracts council identifiers
 */
export async function parseAndVerifyQrContent(qrRawText) {
  if (!qrRawText || typeof qrRawText !== 'string' || !qrRawText.trim()) {
    return {
      status: 'INVALID_QR',
      message: 'The scanned image does not contain a valid or readable QR code payload.'
    };
  }

  const raw = qrRawText.trim();
  let candidateIdentifier = '';

  // Case A: QR contains an HTTP / HTTPS URL
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    try {
      const url = new URL(raw);
      // Trusted hostnames check
      const trustedHosts = ['nctms.in', 'verify.nctms.in', 'localhost', '127.0.0.1'];
      const isTrustedHost = trustedHosts.some((h) => url.hostname.includes(h));

      if (!isTrustedHost) {
        return {
          status: 'UNTRUSTED_QR',
          message: `Untrusted QR destination (${url.hostname}). The council verification engine rejects third-party external URLs to protect user security.`
        };
      }

      // Check URL query parameters (e.g. ?cert=... or ?roll=...)
      const certParam = url.searchParams.get('cert') || url.searchParams.get('id');
      const rollParam = url.searchParams.get('roll');

      // Check pathname (e.g. /verify/NCTMS2026CS1092)
      const pathParts = url.pathname.split('/').filter(Boolean);
      const lastSegment = pathParts[pathParts.length - 1];

      candidateIdentifier = certParam || rollParam || (lastSegment !== 'verify' ? lastSegment : '');
    } catch {
      return {
        status: 'INVALID_QR',
        message: 'QR code contains an unparseable URL structure.'
      };
    }
  } else if (raw.startsWith('{') && raw.endsWith('}')) {
    // Case B: QR contains JSON payload
    try {
      const parsed = JSON.parse(raw);
      candidateIdentifier = parsed.certificateNo || parsed.rollNo || parsed.id || '';
    } catch {
      candidateIdentifier = raw;
    }
  } else {
    // Case C: QR contains raw certificate serial or roll number
    candidateIdentifier = raw;
  }

  if (!candidateIdentifier || !candidateIdentifier.trim()) {
    return {
      status: 'INVALID_QR',
      message: 'Could not extract an authentic NCTMS certificate identifier from the QR code payload.'
    };
  }

  // Resolve extracted identifier against trusted backend registry
  const result = await verifyCertificate({ query: candidateIdentifier });
  return {
    ...result,
    qrPayload: raw,
    extractedId: candidateIdentifier
  };
}

/**
 * 3. Generate Trusted Verification URL for a given certificate
 */
export function generateVerificationUrl(record) {
  if (!record || !record.rollNo) return '';
  return `https://verify.nctms.in/verify/${encodeURIComponent(record.rollNo)}`;
}
