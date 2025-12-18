import { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: null,
        loading: true,
    });

    useEffect(() => {
        const loadUser = async () => {
            const storedToken = localStorage.getItem("auth_token");
            const storedUser = localStorage.getItem("auth_user");

            if (storedToken && storedUser) {
                setAuth({
                    user: JSON.parse(storedUser),
                    token: storedToken,
                    loading: false,
                });
            } else {
                setAuth((prev) => ({ ...prev, loading: false }));
            }
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post("/auth/login", { email, password });

            if (data.success) {
                localStorage.setItem("auth_token", data.token);
                localStorage.setItem("auth_user", JSON.stringify(data.user));

                setAuth({
                    user: data.user,
                    token: data.token,
                    loading: false,
                });
                return { success: true };
            }
        } catch (error) {
            console.error("Login failed:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Login failed"
            };
        }
    };

    const signup = async (name, email, password) => {
        try {
            const { data } = await api.post("/auth/signup", { name, email, password });
            return data; // Usually we ask them to login after signup or auto-login
        } catch (error) {
            console.error("Signup failed:", error);
            throw error.response?.data || { message: "Signup failed" };
        }
    };

    const logout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        setAuth({
            user: null,
            token: null,
            loading: false,
        });
    };

    return (
        <AuthContext.Provider value={{ auth, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);