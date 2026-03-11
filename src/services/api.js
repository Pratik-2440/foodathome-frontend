import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ SEND OTP
export const sendOtp = (email) =>
  api.post("/api/notification/send-otp", { email });

// ✅ VERIFY OTP
export const verifyOtp = (email, otp) =>
  api.post("/api/notification/verify-otp", { email, otp });

// ✅ REGISTER USER
export const registerUser = (user) =>
  api.post("/api/users/register", user);

// ✅ CHECK EMAIL EXISTS
export const checkEmailExists = (email) =>
  api.get(`/api/users/exists/email/${email}`);

// ✅ CHECK USERNAME EXISTS
export const checkUsernameExists = (username) =>
  api.get(`/api/users/exists/username/${username}`);


export default api   ;
