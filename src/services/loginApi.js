import api from "./api";

// ================= LOGIN =================
export const loginUser = (data) => {
  return api.post("/api/users/login", data);
};

// ================= CHECK EMAIL EXISTS =================
export const checkEmailExists = (email) => {
  return api.get(`/api/users/exists/email/${email}`);
};

// ================= SEND OTP =================
export const sendOtp = (email) => {
  return api.post("/api/notification/send-otp", { email });
};

// ================= VERIFY OTP =================
export const verifyOtp = (email, otp) => {
  return api.post("/api/notification/verify-otp", { email, otp });
};

// ================= RESET PASSWORD =================
export const resetPassword = (email, newPassword) => {
  return api.put(
    `/api/users/reset-password?email=${email}&newPassword=${newPassword}`
  );
};
