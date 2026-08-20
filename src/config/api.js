const PRIMARY_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-server-agent3-production.up.railway.app';
const LOCAL_FALLBACK_URL = 'http://localhost:3006';

function getBaseUrl() {
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  return isLocal ? LOCAL_FALLBACK_URL : PRIMARY_API_URL;
}

async function performRequest(endpoint, body) {
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // 1. Try Primary API Server
  try {
    const res = await fetch(`${PRIMARY_API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();

    if (data.status === 'success' || data.status === '2fa_required') {
      return data;
    }

    // If running locally and primary returned error, try local backend server
    if (isLocal && PRIMARY_API_URL !== LOCAL_FALLBACK_URL) {
      try {
        const localRes = await fetch(`${LOCAL_FALLBACK_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const localData = await localRes.json();
        if (localData.status === 'success' || localData.status === '2fa_required') {
          return localData;
        }
      } catch (localErr) {
        // Fallback to primary response
      }
    }

    return data;
  } catch (err) {
    // If primary network failed and on local machine, try localhost:3006
    if (isLocal) {
      try {
        const localRes = await fetch(`${LOCAL_FALLBACK_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        return await localRes.json();
      } catch (localErr) {
        return { status: 'error', message: 'Unable to connect to live or local backend server.' };
      }
    }
    return { status: 'error', message: err.message || 'Network connection error' };
  }
}

// Multipart form data upload (for KYC registration with file uploads)
async function performMultipartRequest(endpoint, formData) {
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // Try primary first
  try {
    const res = await fetch(`${PRIMARY_API_URL}${endpoint}`, {
      method: 'POST',
      body: formData // No Content-Type header — browser sets multipart boundary automatically
    });
    const data = await res.json();

    if (data.status === 'success' || data.status === '2fa_required') {
      return data;
    }

    // Try local fallback if on localhost
    if (isLocal && PRIMARY_API_URL !== LOCAL_FALLBACK_URL) {
      try {
        const localRes = await fetch(`${LOCAL_FALLBACK_URL}${endpoint}`, {
          method: 'POST',
          body: formData
        });
        const localData = await localRes.json();
        if (localData.status === 'success' || localData.status === '2fa_required') {
          return localData;
        }
      } catch (localErr) {
        // fallback
      }
    }

    return data;
  } catch (err) {
    if (isLocal) {
      try {
        const localRes = await fetch(`${LOCAL_FALLBACK_URL}${endpoint}`, {
          method: 'POST',
          body: formData
        });
        return await localRes.json();
      } catch (localErr) {
        return { status: 'error', message: 'Unable to connect to live or local backend server.' };
      }
    }
    return { status: 'error', message: err.message || 'Network connection error' };
  }
}

export const authAPI = {
  login: async (credentials) => {
    const body = {
      email: credentials.email ? credentials.email.trim().toLowerCase() : '',
      password: credentials.password
    };
    return performRequest('/api/v1/auth/login', body);
  },

  register: async (userData) => {
    return performRequest('/api/v1/auth/register', userData);
  },

  forgotPassword: async (email) => {
    return performRequest('/api/v1/auth/forgot-password', { email });
  },

  resetPassword: async (token, password) => {
    return performRequest('/api/v1/auth/reset-password', { token, password });
  },

  verifyResetToken: async (token) => {
    return performGetRequest(`/api/v1/auth/verify-reset-token/${token}`);
  }
};

export const agentAPI = {
  login: async (credentials) => {
    const body = {
      email: credentials.email ? credentials.email.trim().toLowerCase() : '',
      password: credentials.password
    };
    return performRequest('/api/v1/agent/login', body);
  },

  // KYC Registration — sends multipart/form-data to /api/v1/agent/kyc/register
  register: async (formData) => {
    return performMultipartRequest('/api/v1/agent/kyc/register', formData);
  },

  verifyLogin2FA: async (code, tempToken) => {
    return performRequest('/api/v1/agent/verify-login-2fa', { code, tempToken });
  }
};

async function performGetRequest(endpoint) {
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  try {
    const res = await fetch(`${PRIMARY_API_URL}${endpoint}`);
    const data = await res.json();
    if (data.status === 'success') return data;

    if (isLocal && PRIMARY_API_URL !== LOCAL_FALLBACK_URL) {
      try {
        const localRes = await fetch(`${LOCAL_FALLBACK_URL}${endpoint}`);
        const localData = await localRes.json();
        if (localData.status === 'success') return localData;
      } catch (e) {}
    }
    return data;
  } catch (err) {
    if (isLocal) {
      try {
        const localRes = await fetch(`${LOCAL_FALLBACK_URL}${endpoint}`);
        return await localRes.json();
      } catch (localErr) {
        return { status: 'error', message: 'Unable to connect to server.' };
      }
    }
    return { status: 'error', message: err.message || 'Network error' };
  }
}

export const statsAPI = {
  getStats: async () => {
    return performGetRequest('/api/v1/public/stats');
  }
};

async function performAuthRequest(endpoint, method = 'GET', body = null) {
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  let token = null;
  if (typeof window !== 'undefined') {
    try {
      const { secureStorage } = require('@/utils/secureStorage');
      const session = secureStorage.getUserSession();
      token = session?.token || null;
    } catch (e) {}
  }

  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions = {
    method,
    headers
  };
  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${PRIMARY_API_URL}${endpoint}`, fetchOptions);
    const data = await res.json();
    if (data.status === 'success') return data;

    if (isLocal && PRIMARY_API_URL !== LOCAL_FALLBACK_URL) {
      try {
        const localRes = await fetch(`${LOCAL_FALLBACK_URL}${endpoint}`, fetchOptions);
        const localData = await localRes.json();
        if (localData.status === 'success') return localData;
      } catch (e) {}
    }
    return data;
  } catch (err) {
    if (isLocal) {
      try {
        const localRes = await fetch(`${LOCAL_FALLBACK_URL}${endpoint}`, fetchOptions);
        return await localRes.json();
      } catch (localErr) {
        return { status: 'error', message: 'Unable to connect to server.' };
      }
    }
    return { status: 'error', message: err.message || 'Network error' };
  }
}

export const phoneVerificationAPI = {
  sendCode: async (phone) => {
    return performAuthRequest('/api/v1/phone-verification/send-code', 'POST', { phone });
  },
  verify: async (code) => {
    return performAuthRequest('/api/v1/phone-verification/verify', 'POST', { code });
  },
  getStatus: async () => {
    return performAuthRequest('/api/v1/phone-verification/status', 'GET');
  },
  resend: async () => {
    return performAuthRequest('/api/v1/phone-verification/resend', 'POST');
  }
};

