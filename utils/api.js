// utils/api.js
import { handleApiResponse } from './apiHandler';

const BASE_URL = 'https://tlqkiw-ip-103-66-62-198.tunnelmole.net/api';
function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token') || '';
  }
  return '';
}

// Get user information
export const getUserInfo = async () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${BASE_URL}/users/info`, { headers });
  return handleApiResponse(response);
};

// Get investment history (riwayat deposit)
export const getInvestmentHistory = async () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${BASE_URL}/users/investments`, { headers });
  return handleApiResponse(response);
};

// Withdraw user balance
export const withdrawUser = async ({ amount, bank_account_id }) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${BASE_URL}/users/withdrawal`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ amount, bank_account_id }),
  });
  const data = await response.json().catch(() => ({}));
  return data;
};

// Get withdrawal history
export const getWithdrawalHistory = async () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${BASE_URL}/users/withdrawal`, { headers });
  const data = await response.json().catch(() => ({}));
  return data;
};

export const getUserTransactions = async () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${BASE_URL}/users/transaction`, { headers });
  const data = await response.json().catch(() => ({}));
  return data;
};

// Get active investments
export const getActiveInvestments = async () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${BASE_URL}/users/investments/active`, { headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Gagal memuat investasi aktif');
  }
  return data;
};

// Change user password
export const changePassword = async ({ current_password, password, confirmation_password }) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${BASE_URL}/users/change-password`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ current_password, password, confirmation_password }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Gagal mengubah kata sandi');
  }
  return data;
};

// Get team invited/active stats
export const getTeamInvited = async () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${BASE_URL}/users/team-invited`, { headers });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Gagal memuat data tim');
  }
  return await response.json();
};

// Get team invited/active stats for a specific level
export const getTeamInvitedByLevel = async (level) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${BASE_URL}/users/team-invited/${level}`, { headers });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Gagal memuat data tim');
  }
  return await response.json();
};

// Get team member data for a specific level
export const getTeamDataByLevel = async (level) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${BASE_URL}/users/team-data/${level}`, { headers });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Gagal memuat data anggota tim');
  }
  return await response.json();
};

// Get bonus tasks
export const getBonusTasks = async () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${BASE_URL}/users/task`, { headers });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Gagal memuat tugas bonus');
  }
  return await response.json();
};

// Submit/claim bonus task
export const submitBonusTask = async (taskId) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${BASE_URL}/users/task/submit`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ task_id: taskId }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Gagal mengambil hadiah');
  }
  return data;
};

// Get products with Bearer token from localStorage
export const getProducts = async () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${BASE_URL}/products`, { headers });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Gagal memuat produk');
  }
  return await response.json();
};

export async function checkForumStatus() {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${BASE_URL}/users/check-forum`, { headers });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Gagal memuat produk');
  }
  return await response.json();
}

export async function submitForumTestimonial({ image, description }) {
  const token = getToken();
  const formData = new FormData();
  formData.append('image', image);
  formData.append('description', description);
  const res = await fetch(`${BASE_URL}/users/forum/submit`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // Do NOT set 'Content-Type' here, let browser set it for FormData
    },
    body: formData,
  });
  if (!res.ok) {
    let msg = 'Gagal submit forum';
    try { msg = (await res.json()).message; } catch {}
    return { success: false, message: msg };
  }
  return await res.json();
}

// Get forum testimonials (testimoni penarikan)
export const getForumTestimonials = async () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${BASE_URL}/users/forum`, { headers });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Gagal memuat testimoni');
  }
  return await response.json();
};

// Get spin prize list
export const getSpinPrizeList = async () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  try {
    const response = await fetch(`${BASE_URL}/spin-prize-list`, { headers });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Gagal memuat hadiah spin');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching spin prize list:', error);
    throw error;
  }
};

// Spin wheel (POST) - Updated to accept prize code parameter
export const spinWheel = async (prizeCode) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  try {
    const response = await fetch(`${BASE_URL}/users/spin`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        code: prizeCode // Send the selected prize code to backend
      })
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Spin gagal');
    }
    return await response.json();
  } catch (error) {
    console.error('Error spinning wheel:', error);
    throw error;
  }
};

// Get payment by order_id
export const getPaymentByOrderId = async (orderId) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${BASE_URL}/users/payments/${orderId}`, { headers });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Gagal memuat data pembayaran');
  }
  return await response.json();
};

// Create investment
export const createInvestment = async (payload) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${BASE_URL}/users/investments`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Gagal membuat investasi');
  }
  return await response.json();
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json().catch(() => ({}));
    // Always return the response JSON, even for 4xx/5xx
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Terjadi kesalahan. Coba lagi.' };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json().catch(() => ({}));
    // Always return the response JSON, even for 4xx
    return data;
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Terjadi kesalahan. Coba lagi.' };
  }
};

// BANK ACCOUNT MANAGEMENT
// Get all bank accounts for user
export const getBankAccounts = async () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${BASE_URL}/users/bank`, { headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Gagal memuat rekening bank');
  }
  return data;
};

// Get detail bank account by id
export const getBankAccountById = async (id) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${BASE_URL}/users/bank/${id}`, { headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Gagal memuat detail rekening bank');
  }
  return data;
};

// Add new bank account
export const addBankAccount = async ({ bank_id, account_number, account_name }) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${BASE_URL}/users/bank`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ bank_id, account_number, account_name }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Gagal menambah rekening bank');
  }
  return data;
};

// Edit bank account
export const editBankAccount = async ({ id, bank_id, account_number, account_name }) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${BASE_URL}/users/bank`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ id, bank_id, account_number, account_name }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Gagal mengedit rekening bank');
  }
  return data;
};

// Delete bank account
export const deleteBankAccount = async (id) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${BASE_URL}/users/bank`, {
    method: 'DELETE',
    headers,
    body: JSON.stringify({ id }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Gagal menghapus rekening bank');
  }
  return data;
};

// Get bank list
export const getBankList = async () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${BASE_URL}/bank`, { headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Gagal memuat daftar bank');
  }
  return data;
};

// Spin wheel v2 (server-driven) - no body, server chooses prize based on auth
export const spinV2 = async () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  try {
    const response = await fetch(`${BASE_URL}/users/spin`, {
      method: 'POST',
      headers,
    });
    // return parsed JSON even on non-200 so caller can show message
    const data = await response.json().catch(() => ({}));
    return data;
  } catch (error) {
    console.error('Error spinning wheel:', error);
    return { success: false, message: 'Network error' };
  }
};