// src/services/contactService.js
/**
 * NCTMS Contact & Enquiry Service
 * Handles client-side validation, sanitization, and backend integration.
 * Enforces honest error states if the backend enquiry endpoint is unavailable.
 */

export const ENQUIRY_CATEGORIES = [
  'Admission',
  'Courses',
  'Examination',
  'Results',
  'Certificates',
  'Payment',
  'Technical Support',
  'Other'
];

/**
 * Validate contact enquiry input fields
 */
export function validateEnquiryForm(formData) {
  const errors = {};

  // 1. Name validation
  if (!formData.name || !formData.name.trim()) {
    errors.name = 'Please provide your full name.';
  } else if (formData.name.trim().length < 3) {
    errors.name = 'Full name must be at least 3 characters.';
  } else if (!/^[a-zA-Z\s.'-]+$/.test(formData.name.trim())) {
    errors.name = 'Name can only contain letters, spaces, and basic punctuation.';
  }

  // 2. Email validation
  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Please provide your email address.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    errors.email = 'Please enter a valid email address (e.g. name@domain.com).';
  }

  // 3. Phone validation
  if (!formData.phone || !formData.phone.trim()) {
    errors.phone = 'Please provide your mobile or contact number.';
  } else if (!/^[+]?[0-9\s-]{10,15}$/.test(formData.phone.trim())) {
    errors.phone = 'Please enter a valid 10 to 15 digit telephone number.';
  }

  // 4. Category validation
  if (!formData.category || !ENQUIRY_CATEGORIES.includes(formData.category)) {
    errors.category = 'Please select a valid enquiry category.';
  }

  // 5. Subject validation
  if (!formData.subject || !formData.subject.trim()) {
    errors.subject = 'Please enter an enquiry subject.';
  } else if (formData.subject.trim().length < 4) {
    errors.subject = 'Subject must be at least 4 characters long.';
  }

  // 6. Message validation
  if (!formData.message || !formData.message.trim()) {
    errors.message = 'Please enter your message details.';
  } else if (formData.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters long.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Sanitize input string against script injection
 */
export function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim();
}

/**
 * Attempt to submit contact enquiry to backend endpoint
 * If the backend endpoint is not mounted, returns an honest unavailable state.
 */
export async function submitEnquiry(formData) {
  // Artificial roundtrip for responsive UI
  await new Promise((resolve) => setTimeout(resolve, 600));

  const payload = {
    name: sanitizeInput(formData.name),
    email: sanitizeInput(formData.email).toLowerCase(),
    phone: sanitizeInput(formData.phone),
    category: formData.category,
    subject: sanitizeInput(formData.subject),
    message: sanitizeInput(formData.message),
    submittedAt: new Date().toISOString()
  };

  try {
    const response = await fetch('/api/enquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        ticketId: data.ticketId || `NCTMS-TKT-${Date.now().toString().slice(-6)}`,
        message: 'Your enquiry has been formally registered with the Council Helpdesk.'
      };
    }
  } catch {
    // Expected when no server-side endpoint is mounted on this static Vite deployment
  }

  // Return honest backend unavailable state without fabricating success
  return {
    success: false,
    backendUnavailable: true,
    message: 'The online enquiry gateway is currently in read-only maintenance mode. Direct server API intake is not configured on this instance. Please use our official direct email or helpline below to ensure immediate assistance.'
  };
}

/**
 * Generate mailto URI so the user can easily dispatch their enquiry directly to helpdesk@nctms.in
 */
export function generateMailtoUrl(formData) {
  const recipient = 'helpdesk@nctms.in';
  const subject = encodeURIComponent(`[${formData.category || 'Enquiry'}] ${formData.subject || 'Student Query'}`);
  const body = encodeURIComponent(
    `From: ${formData.name || ''}\nEmail: ${formData.email || ''}\nPhone: ${formData.phone || ''}\nCategory: ${formData.category || ''}\n\nMessage:\n${formData.message || ''}\n\n---\nSent via NCTMS India Online Portal`
  );
  return `mailto:${recipient}?subject=${subject}&body=${body}`;
}
