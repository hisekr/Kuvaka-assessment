"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login, signup } from "../../store/slices/authSlice";
import { toast } from "react-toastify";

export default function OTPVerificationPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { signupNumbers } = useSelector((state) => state.auth);

  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);
  const {
    register,
    handleSubmit,
    watch,
    setFocus,
    setValue,
  } = useForm({
    mode: "onChange",
  });

  // Load OTP info from localStorage
  useEffect(() => {
    const storedPhone = localStorage.getItem("otpPhone");
    const storedMode = localStorage.getItem("authMode");

    if (!storedPhone || !storedMode) {
      toast.error("No OTP request found. Please try again.");
      router.push("/login");
      return;
    }

    setPhone(storedPhone);
    setMode(storedMode);
    setTimeout(() => setFocus("otp0"), 100);
  }, [router, setFocus]);

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const otpValues = watch(["otp0", "otp1", "otp2", "otp3"]);
  const isDisabled = otpValues.some((val) => !val || val.trim() === "");

  const onSubmit = async (data) => {
    const otpCode = [0, 1, 2, 3].map((i) => data[`otp${i}`]).join("");
    if (otpCode.length !== 4) {
      toast.error("Invalid OTP");
      return;
    }

    setLoading(true);

    try {
      const storedAuth = JSON.parse(localStorage.getItem("authState")) || {};
      const existingNumbers = storedAuth.signupNumbers || [];

      if (mode === "signup" && existingNumbers.includes(phone)) {
        toast.error("This number is already signed up!");
        return;
      }

      if (mode === "login" && !existingNumbers.includes(phone)) {
        toast.error("Number not registered. Please signup.");
        return;
      }

      if (mode === "signup") {
        dispatch(signup({ phone }));
        toast.success("Signed up successfully!");
      } else {
        dispatch(login({ phone }));
        toast.success("Logged in successfully!");
      }

      [0, 1, 2, 3].forEach((i) => {
        setValue(`otp${i}`, "");
        if (inputRefs.current[i]) inputRefs.current[i].value = "";
      });

      localStorage.removeItem("otpPhone");
      localStorage.removeItem("authMode");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, "");
    e.target.value = val;
    setValue(`otp${index}`, val);
    if (val.length === 1 && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);
    pasteData.split("").forEach((char, i) => {
      setValue(`otp${i}`, char);
      inputRefs.current[i].value = char;
    });
    if (pasteData.length === 4) {
      inputRefs.current[3]?.focus();
    }
  };

  const handleResend = () => {
    toast.info("OTP resent to your phone!");
    setTimer(30);
    setCanResend(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] p-4">
      <h2 className="text-xl mb-4 text-center bg-[var(--background)] text-[var(--foreground)]">
        OTP sent to <span className="font-mono">{phone}</span>
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center"
        onPaste={handlePaste}
      >
        <div className="flex space-x-2 mb-4">
          {[0, 1, 2, 3].map((i) => (
            <input
              key={i}
              {...register(`otp${i}`, {
                required: true,
                maxLength: 1,
                minLength: 1,
              })}
              type="text"
              maxLength={1}
              className="w-12 h-12 text-center border rounded text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--background)] text-[var(--foreground)]"
              onChange={(e) => handleOtpChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              ref={(el) => (inputRefs.current[i] = el)}
              inputMode="numeric"
              pattern="\d*"
              autoComplete="one-time-code"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isDisabled || loading}
          className={`w-full mt-2 px-6 py-3 rounded ${
            isDisabled || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>

      <div className="mt-4 text-sm bg-[var(--background)] text-[var(--foreground)]">
        {canResend ? (
          <button
            onClick={handleResend}
            className="text-blue-600 font-medium hover:underline"
          >
            Resend OTP
          </button>
        ) : (
          <p>Resend available in {timer}s</p>
        )}
      </div>
    </div>
  );
}
