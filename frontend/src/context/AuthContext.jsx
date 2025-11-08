import { createContext, useContext, useReducer, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case "LOGIN_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
        user: null,
        token: null,
      };
    case "LOGOUT":
      return { ...state, user: null, token: null, error: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.token) {
      localStorage.setItem("token", state.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
    } else {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    }
  }, [state.token]);

  const login = async (email, password) => {
    dispatch({ type: "LOADING" });
    try {
      const response = await api.post("/auth/login", { email, password });
      dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      dispatch({ type: "LOGIN_ERROR", payload: message });
      throw error;
    }
  };

  const register = async (name, email, password) => {
    dispatch({ type: "LOADING" });
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      dispatch({ type: "LOGIN_ERROR", payload: message });
      throw error;
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
