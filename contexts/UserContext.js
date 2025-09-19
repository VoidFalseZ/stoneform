"use client"; // aman buat Next.js 13+, kalau Next.js 12 ga masalah juga

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { redirectToLogin } from "../utils/auth";
import { getUserInfo } from "../utils/api";

const UserContext = createContext();
const REFRESH_INTERVAL = 10000; // 10 seconds

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserInfo = useCallback(async () => {
        // prevent concurrent fetches
        if (fetchUserInfo.isFetching) return;
        fetchUserInfo.isFetching = true;
        const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register' || window.location.pathname === '/';
        const token = localStorage.getItem("token");
        const expiredAt = localStorage.getItem("expired_at");

        // Don't show error on auth pages
        if (!token || !expiredAt) {
            if (!isAuthPage) {
                setError("No authentication token found");
                redirectToLogin();
            }
            setLoading(false);
            return;
        }

        // Check if token is expired
        let expiryDate;
        try {
            expiryDate = new Date(expiredAt);
        } catch {
            expiryDate = null;
        }
        const currentDate = new Date();
        if (!expiryDate || currentDate > expiryDate) {
            if (!isAuthPage) {
                localStorage.removeItem("token");
                localStorage.removeItem("expired_at");
                localStorage.removeItem("user");
                localStorage.removeItem("application");
                setUser(null);
                setApplication(null);
                redirectToLogin();
            }
            setLoading(false);
            return;
        }

        try {
            const data = await getUserInfo();
            // Check for session expired by status or message
            const sessionExpired = (
                data.status === 401 ||
                data.status === 403 ||
                /sesi anda telah habis/i.test(data.message || "") ||
                /token expired/i.test(data.message || "") ||
                /unauthorized/i.test(data.message || "") ||
                /invalid token/i.test(data.message || "") ||
                /jwt expired/i.test(data.message || "")
            );

            if (data.success) {
                if (data.data.user) {
                    localStorage.setItem("user", JSON.stringify(data.data.user));
                    setUser(data.data.user);
                }
                if (data.data.application) {
                    localStorage.setItem("application", JSON.stringify(data.data.application));
                    setApplication(data.data.application);
                }
                setError(null);
            } else if (sessionExpired) {
                localStorage.removeItem("token");
                localStorage.removeItem("expired_at");
                localStorage.removeItem("user");
                localStorage.removeItem("application");
                setUser(null);
                setApplication(null);
                redirectToLogin();
                setLoading(false);
                return;
            } else {
                setError(data.message || "Failed to fetch user info");
            }
        } catch (err) {
            console.error("Fetch user error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
            fetchUserInfo.isFetching = false;
        }
    }, []);

    // Ensure listeners (storage and custom token event) are active even on auth pages
    useEffect(() => {
        const handleStorage = (e) => {
            if (!e.key) return;
            if (e.key === 'token' || e.key === 'expired_at') {
                const tokenNow = localStorage.getItem('token');
                const expiredAtNow = localStorage.getItem('expired_at');
                let expiryNow;
                try { expiryNow = expiredAtNow ? new Date(expiredAtNow) : null; } catch { expiryNow = null; }
                const now = new Date();
                if (!tokenNow || !expiredAtNow || !expiryNow || now >= expiryNow) {
                    stopInterval();
                    localStorage.removeItem("token");
                    localStorage.removeItem("expired_at");
                    localStorage.removeItem("user");
                    localStorage.removeItem("application");
                    setUser(null);
                    setApplication(null);
                    redirectToLogin();
                } else {
                    fetchUserInfo();
                    startInterval();
                }
            }
        };

        const handleTokenChanged = () => {
            const tokenNow = localStorage.getItem('token');
            const expiredAtNow = localStorage.getItem('expired_at');
            let expiryNow;
            try { expiryNow = expiredAtNow ? new Date(expiredAtNow) : null; } catch { expiryNow = null; }
            const now = new Date();
            if (!tokenNow || !expiredAtNow || !expiryNow || now >= expiryNow) {
                stopInterval();
                localStorage.removeItem("token");
                localStorage.removeItem("expired_at");
                localStorage.removeItem("user");
                localStorage.removeItem("application");
                setUser(null);
                setApplication(null);
                redirectToLogin();
            } else {
                fetchUserInfo();
                startInterval();
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('storage', handleStorage);
            window.addEventListener('user-token-changed', handleTokenChanged);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('storage', handleStorage);
                window.removeEventListener('user-token-changed', handleTokenChanged);
            }
        };
    }, [fetchUserInfo]);

    const intervalRef = useRef(null);

    const startInterval = () => {
        if (intervalRef.current) return; // already running
        intervalRef.current = setInterval(() => {
            const tokenNow = localStorage.getItem("token");
            const expiredAtNow = localStorage.getItem("expired_at");
            let expiryDateNow;
            try { expiryDateNow = expiredAtNow ? new Date(expiredAtNow) : null; } catch { expiryDateNow = null; }
            const currentDateNow = new Date();
            if (tokenNow && expiredAtNow && expiryDateNow && currentDateNow < expiryDateNow) {
                fetchUserInfo();
            } else {
                // token invalid/expired -> stop interval and redirect
                stopInterval();
                localStorage.removeItem("token");
                localStorage.removeItem("expired_at");
                localStorage.removeItem("user");
                localStorage.removeItem("application");
                setUser(null);
                setApplication(null);
                redirectToLogin();
            }
        }, REFRESH_INTERVAL);
    };

    const stopInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        // Hilangkan pengecekan isAuthPage agar interval tetap berjalan di semua halaman jika token valid
        const storedUser = localStorage.getItem("user");
        const storedApplication = localStorage.getItem("application");
        const token = localStorage.getItem("token");
        const expiredAt = localStorage.getItem("expired_at");
        let expiryDate;
        try {
            expiryDate = expiredAt ? new Date(expiredAt) : null;
        } catch {
            expiryDate = null;
        }
        const currentDate = new Date();

        // Jika token dan expiredAt valid, start fetch + interval walau storedUser kosong
        if (token && expiredAt && expiryDate && currentDate < expiryDate) {
            if (storedUser) {
                try { setUser(JSON.parse(storedUser)); } catch { setUser(null); }
            }
            if (storedApplication) {
                try { setApplication(JSON.parse(storedApplication)); } catch { setApplication(null); }
            }
            setLoading(false);

            // Fetch data dari API untuk sync user info dan refresh token
            const initializeUser = async () => {
                try {
                    await fetchUserInfo();
                } catch (error) {
                    console.error("Failed to initialize user:", error);
                }
            };
            initializeUser();

            // start managed interval
            startInterval();
        } else {
            setUser(null);
            setApplication(null);
            setLoading(false);
        }

        // Listen for storage changes (other tabs or manual edits)
        const handleStorage = (e) => {
            if (!e.key) return;
            if (e.key === 'token' || e.key === 'expired_at') {
                const tokenNow = localStorage.getItem('token');
                const expiredAtNow = localStorage.getItem('expired_at');
                let expiryNow;
                try { expiryNow = expiredAtNow ? new Date(expiredAtNow) : null; } catch { expiryNow = null; }
                const now = new Date();
                if (!tokenNow || !expiredAtNow || !expiryNow || now >= expiryNow) {
                    // token removed/expired
                    stopInterval();
                    localStorage.removeItem("token");
                    localStorage.removeItem("expired_at");
                    localStorage.removeItem("user");
                    localStorage.removeItem("application");
                    setUser(null);
                    setApplication(null);
                    redirectToLogin();
                } else {
                    // token set/updated -> trigger immediate fetch and ensure interval running
                    fetchUserInfo();
                    startInterval();
                }
            }
        };

        // Custom event listener for same-tab token updates (storage event doesn't fire in same tab)
        const handleTokenChanged = () => {
            const tokenNow = localStorage.getItem('token');
            const expiredAtNow = localStorage.getItem('expired_at');
            let expiryNow;
            try { expiryNow = expiredAtNow ? new Date(expiredAtNow) : null; } catch { expiryNow = null; }
            const now = new Date();
            if (!tokenNow || !expiredAtNow || !expiryNow || now >= expiryNow) {
                stopInterval();
                localStorage.removeItem("token");
                localStorage.removeItem("expired_at");
                localStorage.removeItem("user");
                localStorage.removeItem("application");
                setUser(null);
                setApplication(null);
                redirectToLogin();
            } else {
                fetchUserInfo();
                startInterval();
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('storage', handleStorage);
            window.addEventListener('user-token-changed', handleTokenChanged);
        }

        // Cleanup on unmount
        return () => {
            stopInterval();
            if (typeof window !== 'undefined') {
                window.removeEventListener('storage', handleStorage);
                window.removeEventListener('user-token-changed', handleTokenChanged);
            }
        };
    }, [fetchUserInfo]);

    const refreshUser = useCallback(() => {
        setLoading(true);
        return fetchUserInfo();
    }, [fetchUserInfo]);

    return (
        <UserContext.Provider value={{ 
            user, 
            setUser, 
            application,
            setApplication,
            loading, 
            error, 
            refreshUser 
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
