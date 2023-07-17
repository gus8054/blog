import axios from "axios";

export const register = async (username, email, password) => {
  try {
    await axios.post("/users", { username, email, password });
  } catch (err) {
    throw err; // 실패시 에러 발생
  }
};

export const withdraw = async (username, axiosInstance) => {
  try {
    await axiosInstance.delete(`/users/${username}`);
  } catch (err) {
    throw err; // 실패시 에러 발생
  }
};

export const checkUser = async (username, password, axiosInstance) => {
  try {
    await axiosInstance.post(`/users/${username}`, { password });
  } catch (err) {
    throw err;
  }
};
