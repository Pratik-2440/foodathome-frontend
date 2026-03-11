import { useState } from "react";
import {
  sendOtp,
  verifyOtp,
  registerUser,
  checkEmailExists,
  checkUsernameExists,
} from "../services/api";
import "./Signup.css";

export default function Signup() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "USER",
  });

  const [usernameExists, setUsernameExists] = useState(false);

  // password rule
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const isPasswordStrong = passwordRegex.test(form.password);

  // ================= STEP 1: SEND OTP =================
  const handleSendOtp = async () => {
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter email");
      return;
    }

    try {
      const res = await checkEmailExists(email);
      if (res.data === true) {
        setError("You already have an account. Please login.");
        return;
      }

      await sendOtp(email);
      setStep(2);
      setMessage("OTP sent to your email");
    } catch {
      setError("Unable to send OTP");
    }
  };

  // ================= STEP 2: VERIFY OTP =================
  const handleVerifyOtp = async () => {
    setError("");
    setMessage("");

    try {
      await verifyOtp(email, otp);
      setStep(3);
      setMessage("Email verified successfully");
    } catch {
      setError("Invalid OTP");
    }
  };

  // ================= STEP 3: USERNAME CHECK =================
  const handleUsernameChange = async (e) => {
    const value = e.target.value;
    setForm({ ...form, username: value });

    if (value.length > 2) {
      try {
        const res = await checkUsernameExists(value);
        setUsernameExists(res.data === true);
      } catch {
        setUsernameExists(false);
      }
    } else {
      setUsernameExists(false);
    }
  };

  // ================= REGISTER =================
  const handleRegister = async () => {
    setError("");
    setMessage("");

    if (!isPasswordStrong) {
      setError(
        "Password must be 8 characters with uppercase, lowercase, number & special character"
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Password not matched");
      return;
    }

    if (usernameExists) {
      setError("Username already exists");
      return;
    }

    const payload = {
      username: form.username,
      email,
      password: form.password,
      role: form.role,
    };

    try {
      await registerUser(payload);
      setMessage("Registration successful. Please login.");
      setStep(4);
    } catch (err) {
      setError(err.response?.data || "Registration failed");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>FoodAtHome Signup</h2>

        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={handleSendOtp}>Send OTP</button>

            <p className="login-link">
              Already have an account?{" "}
              <a href="/login">Please login</a>
            </p>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerifyOtp}>Verify OTP</button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <input
              placeholder="Username"
              value={form.username}
              onChange={handleUsernameChange}
            />

            {usernameExists && (
              <p className="error-msg">Username already exists</p>
            )}

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            {!isPasswordStrong && form.password && (
              <p className="error-msg">
                Password must include uppercase, lowercase, number & special
                character
              </p>
            )}

            <input
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />

            <select
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            >
              <option value="USER">User</option>
              <option value="HOTEL">Hotel</option>
              <option value="DELIVERY">Delivery</option>
            </select>

            <button onClick={handleRegister}>Register</button>
          </>
        )}

        {/* SUCCESS */}
        {step === 4 && (
          <p className="success-msg">
            Account created successfully. Please login.
          </p>
        )}
      </div>
    </div>
  );
}
