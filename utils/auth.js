export const checkAuth = () => {
  if (typeof window === 'undefined') return false;

  const token = localStorage.getItem('token');
  const expiredAt = localStorage.getItem('expired_at');

  if (!token || !expiredAt) return false;

  const currentDate = new Date();
  const expiryDate = new Date(expiredAt);

  return currentDate < expiryDate;
};

export const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('expired_at');
    window.location.href = '/login';
  }
};

export const isAuthRoute = (pathname) => {
  const authRoutes = ['/login', '/register'];
  return authRoutes.includes(pathname);
};