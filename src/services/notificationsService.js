// src/services/notificationsService.js
/**
 * NCTMS News & Notifications Service
 * Provides filtering, searching, sorting, and detail retrieval
 */

import { NOTIFICATIONS_DATA, NOTIFICATION_CATEGORIES } from '../data/notificationsData.js';

/**
 * Helper to parse dates like "05-Oct-2026" or "14-Mar-2024" into timestamps for sorting
 */
function parseDateStrToTime(dateStr) {
  if (!dateStr) return 0;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthStr = parts[1].toLowerCase();
    const year = parseInt(parts[2], 10);
    const months = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };
    const month = months[monthStr] ?? 0;
    return new Date(year, month, day).getTime();
  }
  return new Date(dateStr).getTime() || 0;
}

/**
 * Query announcements with category, search, sort, and pagination
 */
export async function getNotifications({
  category = 'All',
  search = '',
  sort = 'newest',
  page = 1,
  pageSize = 6
} = {}) {
  // Simulate rapid async response
  await new Promise((resolve) => setTimeout(resolve, 80));

  let results = [...NOTIFICATIONS_DATA];

  // 1. Category Filter
  if (category && category !== 'All') {
    results = results.filter((item) => item.category === category);
  }

  // 2. Search Keyword Filter (Title, Description, Content, Reference No)
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    results = results.filter((item) => {
      const matchTitle = item.title && item.title.toLowerCase().includes(q);
      const matchShort = item.shortDescription && item.shortDescription.toLowerCase().includes(q);
      const matchRef = item.referenceNo && item.referenceNo.toLowerCase().includes(q);
      const matchCat = item.category && item.category.toLowerCase().includes(q);
      const matchContent = Array.isArray(item.fullContent) &&
        item.fullContent.some((p) => p.toLowerCase().includes(q));
      return matchTitle || matchShort || matchRef || matchCat || matchContent;
    });
  }

  // 3. Sorting
  results.sort((a, b) => {
    const timeA = parseDateStrToTime(a.date);
    const timeB = parseDateStrToTime(b.date);
    if (sort === 'oldest') {
      return timeA - timeB;
    }
    // Default newest first, with pinned items priority on the first page
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    return timeB - timeA;
  });

  // 4. Pagination
  const total = results.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const safePage = Math.max(1, Math.min(page, totalPages));
  const offset = (safePage - 1) * pageSize;
  const paginatedItems = results.slice(offset, offset + pageSize);

  return {
    items: paginatedItems,
    total,
    totalPages,
    currentPage: safePage,
    hasMore: safePage < totalPages
  };
}

/**
 * Retrieve single announcement by unique ID
 */
export async function getNotificationById(id) {
  await new Promise((resolve) => setTimeout(resolve, 60));
  if (!id) return null;
  const cleanId = id.trim().toLowerCase();
  return NOTIFICATIONS_DATA.find((item) => item.id.toLowerCase() === cleanId) || null;
}

/**
 * Retrieve featured / pinned notices for header spotlight
 */
export async function getFeaturedNotifications() {
  await new Promise((resolve) => setTimeout(resolve, 40));
  return NOTIFICATIONS_DATA.filter((item) => item.isPinned);
}

/**
 * Retrieve related announcements in the same category
 */
export async function getRelatedNotifications(currentId, category, limit = 3) {
  await new Promise((resolve) => setTimeout(resolve, 40));
  return NOTIFICATIONS_DATA
    .filter((item) => item.id !== currentId && (!category || item.category === category))
    .slice(0, limit);
}

/**
 * Export available categories
 */
export function getCategories() {
  return NOTIFICATION_CATEGORIES;
}
