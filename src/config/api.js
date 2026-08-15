const PRIMARY_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-server-agent3-production.up.railway.app';
const LOCAL_FALLBACK_URL = 'http://localhost:3006';

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

  register: async (agentData) => {
    return performRequest('/api/v1/agent/register', agentData);
  },

  verifyLogin2FA: async (code, tempToken) => {
    return performRequest('/api/v1/agent/verify-login-2fa', { code, tempToken });
  }
};
