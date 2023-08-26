import { createContext, useState } from "react";
import axios from "axios";
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [accessToken, setAccessToken] = useState();

  const login = async (inputUsername, inputPassword) => {
    try {
      const response = await axios.post("/api/auth/login", {
        username: inputUsername,
        password: inputPassword,
      });
      const { username, email, role } = JSON.parse(
        atob(response.data.accessToken.split(".")[1])
      );
      setAccessToken(response.data.accessToken);
      setUser({ username, email, role });
    } catch (err) {
      throw err;
    }
  };
  const getRefreshToken = async () => {
    try {
      const response = await axios.get("/api/auth/refreshtoken");
      setAccessToken(response.data.accessToken);
      return response.data.accessToken;
    } catch (err) {
      throw err;
    }
  };

  const logout = async (isRequest = true) => {
    try {
      if (isRequest) await getMyAxiosInstance().get("/api/auth/logout");
      setAccessToken(null);
      setUser(null);
    } catch (err) {
      throw err;
    }
  };
  const getMyAxiosInstance = () => {
    const instance = axios.create({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403) {
          const newAccessToken = await getRefreshToken();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return instance(prevRequest);
        }
        return Promise.reject(error);
      }
    );
    return instance;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, getMyAxiosInstance }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
