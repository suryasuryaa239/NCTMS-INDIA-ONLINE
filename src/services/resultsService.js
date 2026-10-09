// src/services/resultsService.js
/**
 * NCTMS Examination Results Query & Verification Service
 * 
 * Privacy & Security Architecture:
 * 1. Two-factor student authentication: Roll Number + Date of Birth
 *    Unrestricted public lookups without DOB are rejected to prevent student privacy leakage.
 * 2. Authenticated bypass: Logged-in students can view their own result immediately.
 * 3. Graceful handling of unreleased / under-scrutiny batches.
 */

import { CERTIFICATES_DATA, EXAMINATION_SESSIONS } from '../data/certificatesData';

// Helper to normalize dates for comparison (supports DD-Mon-YYYY, YYYY-MM-DD, DD/MM/YYYY)
function normalizeDate(dateStr) {
  if (!dateStr) return '';
  const clean = dateStr.trim().toLowerCase();

  // If already like "14-aug-2001"
  const monthMap = {
    '01': 'jan', '02': 'feb', '03': 'mar', '04': 'apr',
    '05': 'may', '06': 'jun', '07': 'jul', '08': 'aug',
    '09': 'sep', '10': 'oct', '11': 'nov', '12': 'dec',
    'jan': 'jan', 'feb': 'feb', 'mar': 'mar', 'apr': 'apr',
    'may': 'may', 'jun': 'jun', 'jul': 'jul', 'aug': 'aug',
    'sep': 'sep', 'oct': 'oct', 'nov': 'nov', 'dec': 'dec'
  };

  // YYYY-MM-DD format from HTML5 date picker
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    const [y, m, d] = clean.split('-');
    const mStr = monthMap[m] || m;
    return `${parseInt(d, 10)}-${mStr}-${y}`;
  }

  // DD/MM/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(clean)) {
    const [d, m, y] = clean.split('/');
    const mStr = monthMap[m.padStart(2, '0')] || m;
    return `${parseInt(d, 10)}-${mStr}-${y}`;
  }

  return clean.replace(/\s+/g, '-');
}

/**
 * Perform secure academic result lookup
 */
export async function queryExaminationResult({
  rollNo,
  dateOfBirth,
  session = 'all',
  authenticatedUser = null
}) {
  // Artificial network roundtrip for realistic verification feedback
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (!rollNo || !rollNo.trim()) {
    return {
      success: false,
      status: 'INVALID_INPUT',
      message: 'Please enter a valid Registration Number or Roll Number.'
    };
  }

  const cleanRoll = rollNo.trim().toUpperCase();
  const isOwnAuthenticatedStudent =
    authenticatedUser &&
    authenticatedUser.role === 'student' &&
    authenticatedUser.id &&
    authenticatedUser.id.toUpperCase() === cleanRoll;

  // If not logged-in as the candidate, require Date of Birth for privacy
  if (!isOwnAuthenticatedStudent && (!dateOfBirth || !dateOfBirth.trim())) {
    return {
      success: false,
      status: 'DOB_REQUIRED',
      message: 'Date of Birth is required to verify student identity and protect academic privacy.'
    };
  }

  const record = CERTIFICATES_DATA[cleanRoll];

  // If record not found, return generic privacy-preserving error
  if (!record) {
    return {
      success: false,
      status: 'NOT_FOUND',
      message:
        'No published examination record found matching the specified Registration Number and credentials. Please verify your details or contact the Controller of Examinations.'
    };
  }

  // Verify Date of Birth unless authenticated as that student
  if (!isOwnAuthenticatedStudent && dateOfBirth) {
    const userDobNorm = normalizeDate(dateOfBirth);
    const recordDobNorm = normalizeDate(record.dateOfBirth);

    if (userDobNorm !== recordDobNorm) {
      return {
        success: false,
        status: 'NOT_FOUND',
        message:
          'No published examination record found matching the specified Registration Number and credentials. Please verify your details or contact the Controller of Examinations.'
      };
    }
  }

  // Check Examination Session filter
  if (session && session !== 'all') {
    if (record.examinationMonthYear !== session) {
      return {
        success: false,
        status: 'SESSION_MISMATCH',
        message: `Candidate did not appear in the "${session}" session. Verified examination session on record is "${record.examinationMonthYear}".`
      };
    }
  }

  // Check publication status
  if (record.status === 'Draft / Internal Scrutiny') {
    return {
      success: false,
      status: 'UNDER_SCRUTINY',
      candidateName: record.studentName,
      courseName: record.courseName,
      session: record.examinationMonthYear,
      message:
        'Examination result is currently under internal scrutiny and evaluation audit. Final marks will be published online following Academic Council approval.'
    };
  }

  if (record.status === 'Ready for Publication') {
    return {
      success: false,
      status: 'PENDING_RELEASE',
      candidateName: record.studentName,
      courseName: record.courseName,
      session: record.examinationMonthYear,
      message:
        'Result moderation complete. Official publication is scheduled following digital certificate signing by the Controller of Examinations.'
    };
  }

  // PUBLISHED & VERIFIED
  return {
    success: true,
    status: 'PUBLISHED',
    record
  };
}

export { EXAMINATION_SESSIONS };
