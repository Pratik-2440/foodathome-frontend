import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  checkEmailExists,
  sendOtp,
  verifyOtp,
  resetPassword,
} from "../services/loginApi";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  // steps
  // 1 = login
  // 2 = email
  // 3 = otp
  // 4 = reset
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  // ================= LOGIN =================
  const handleLogin = async () => {
    setError("");
    setMessage("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      const res = await loginUser({ email, password });

      // ✅ IMPORTANT FIX (token issue)
      const token = res.data.token || res.data;

      localStorage.setItem("token", token);

      navigate("/dashboard", { replace: true });
    } catch {
      setError("Invalid email or password");
    }
  };

  // ================= SEND OTP =================
  const handleSendOtp = async () => {
    setError("");
    setMessage("");

    try {
      const res = await checkEmailExists(email);

      if (!res.data) {
        setError("You don't have an account. Please signup.");
        return;
      }

      await sendOtp(email);

      setStep(3);
      setMessage("OTP sent to your email");
    } catch {
      setError("Unable to send OTP");
    }
  };

  // ================= VERIFY OTP =================
  const handleVerifyOtp = async () => {
    setError("");
    setMessage("");

    try {
      await verifyOtp(email, otp);
      setStep(4);
      setMessage("OTP verified. Please reset password.");
    } catch {
      setError("Invalid OTP");
    }
  };

  // ================= RESET PASSWORD =================
  const handleResetPassword = async () => {
    setError("");
    setMessage("");

    if (!passwordRegex.test(password)) {
      setError(
        "Password must contain uppercase, lowercase, number & special character"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Password not matched");
      return;
    }

    try {
      await resetPassword(email, password);

      setMessage("Password reset successfully. Please login.");

      setStep(1);
      setPassword("");
      setConfirmPassword("");
    } catch {
      setError("Unable to reset password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>FoodAtHome Login</h2>

        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}

        {/* ===== LOGIN ===== */}
        {step === 1 && (
          <>
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="btn-primary" onClick={handleLogin}>
              Login
            </button>

            <button className="btn-link" onClick={() => setStep(2)}>
              Forgot password?
            </button>

            <p className="link">
              Don’t have account? <a href="/signup">Signup</a>
            </p>
          </>
        )}

        {/* ===== EMAIL ===== */}
        {step === 2 && (
          <>
            <input
              placeholder="Enter registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button className="btn-primary" onClick={handleSendOtp}>
              Send OTP
            </button>

            <button className="btn-link" onClick={() => setStep(1)}>
              Back to login
            </button>
          </>
        )}

        {/* ===== OTP ===== */}
        {step === 3 && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button className="btn-primary" onClick={handleVerifyOtp}>
              Verify OTP
            </button>
          </>
        )}

        {/* ===== RESET ===== */}
        {step === 4 && (
          <>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button className="btn-primary" onClick={handleResetPassword}>
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}
