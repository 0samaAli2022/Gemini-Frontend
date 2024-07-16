import {
  useEffect,
  useState,
  useLayoutEffect,
  createContext,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const navigate = useNavigate();

  useLayoutEffect(() => {
    const authInterceptor = axios.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;

      return config;
    });

    return () => axios.interceptors.request.eject(authInterceptor);
  }, [token]);

  useLayoutEffect(() => {
    const refreshInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response.status === 401 &&
          error.response.statusText === "Unauthorized" &&
          !originalRequest._retry
        ) {
          try {
            const response = await axios.get("/api/auth/refresh");
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            originalRequest._retry = true;
            return axios(originalRequest);
          } catch {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setToken(null);
            setUser(null);
            navigate("/login");
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const data = await response.data.data;
      console.log(data.token);
      console.log(data.user);
      setUser(data.user);
      setToken(data.token);
      //console.log(data);
      localStorage.setItem("token", data.token); // Store token in local storage
      localStorage.setItem("user", JSON.stringify(data.user)); // Store user in local storage
      navigate("/"); // Redirect to home after login
    } catch (error) {
      console.error("Login failed: ", error);
      throw new Error(error.response.data.message);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token"); // Remove token from local storage
    localStorage.removeItem("user"); // Remove user from local storage
    navigate("/login");
  };
  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
