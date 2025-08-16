// Utility function for joining class names
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Format currency in KES
export function formatCurrency(amount, currency = 'KES') {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format date to local format
export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Africa/Nairobi',
    ...options,
  };

  return new Intl.DateTimeFormat('en-KE', defaultOptions).format(new Date(date));
}

// Format relative time
export function formatRelativeTime(date) {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now - targetDate) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(date);
}

// Truncate text
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

// Calculate distance between two points (Haversine formula)
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

// Format phone number for display (mask middle digits)
export function maskPhoneNumber(phoneNumber) {
  if (!phoneNumber || phoneNumber.length < 10) return phoneNumber;
  
  const countryCode = phoneNumber.startsWith('+254') ? '+254' : '';
  const number = phoneNumber.replace('+254', '').replace(/^0/, '');
  
  if (number.length >= 9) {
    const masked = number.substring(0, 3) + '***' + number.substring(6);
    return countryCode + (countryCode ? '' : '0') + masked;
  }
  
  return phoneNumber;
}

// Validate Kenyan phone number
export function isValidKenyanPhone(phoneNumber) {
  // Remove spaces and hyphens
  const cleaned = phoneNumber.replace(/[\s-]/g, '');
  
  // Check formats: +254XXXXXXXXX, 254XXXXXXXXX, 07XXXXXXXX, 01XXXXXXXX
  const patterns = [
    /^\+254[17]\d{8}$/, // +254 format
    /^254[17]\d{8}$/, // 254 format
    /^0[17]\d{8}$/, // 07/01 format
  ];
  
  return patterns.some(pattern => pattern.test(cleaned));
}

// Format Kenyan phone to E.164 format
export function formatKenyanPhoneToE164(phoneNumber) {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // Handle different formats
  if (cleaned.startsWith('254')) {
    return '+' + cleaned;
  } else if (cleaned.startsWith('0')) {
    return '+254' + cleaned.substring(1);
  } else if (cleaned.length === 9) {
    return '+254' + cleaned;
  }
  
  return phoneNumber; // Return original if can't format
}

// Get user's current location
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
}

// Debounce function
export function debounce(func, wait, immediate = false) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

// Generate random ID
export function generateId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// File size formatter
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Validate file type and size
export function validateFile(file, allowedTypes = [], maxSize = 5 * 1024 * 1024) {
  const errors = [];
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push('Invalid file type');
  }
  
  if (file.size > maxSize) {
    errors.push(`File too large. Maximum size is ${formatFileSize(maxSize)}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Parse URL search params
export function parseSearchParams(search) {
  const params = new URLSearchParams(search);
  const result = {};
  
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
}

// Build URL search params
export function buildSearchParams(params) {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value.toString());
    }
  });
  
  return searchParams.toString();
}

// Kenya counties list
export const KENYA_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
  'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
  'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
  'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia',
  'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
];

// Product categories
export const PRODUCT_CATEGORIES = [
  'Fruits',
  'Vegetables',
  'Grains',
  'Dairy',
  'Legumes',
  'Herbs & Spices',
  'Nuts & Seeds',
  'Beverages',
  'Other'
];

// Unit types
export const UNIT_TYPES = [
  'kg',
  'g',
  'tonnes',
  'pieces',
  'bunches',
  'crates',
  'bags',
  'litres',
  'ml',
  'packets'
];

// Order statuses
export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_TRANSIT: 'in_transit',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Payment statuses
export const PAYMENT_STATUSES = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};