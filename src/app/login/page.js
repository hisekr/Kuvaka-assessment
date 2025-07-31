"use client";

import React from "react";
import OtpForm from "@/components/OtpForm";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

const LoginPage = () => {
  const router = useRouter();

  const redirectToSignup = () => {
    router.push("/signup");
  };

  return (
    <>
      <ProtectedRoute>
        <div className="flex flex-1  items-center justify-center bg-[var(--background)] text-[var(--foreground)] p-4 flex-col gap-2">
          <OtpForm mode="login" />
          <div>
            {`Haven't already signed up? `}
            <button
              onClick={redirectToSignup}
              className="font-bold cursor-pointer hover:underline"
            >
              Signup
            </button>
          </div>
        </div>
      </ProtectedRoute>
    </>
  );
};

export default LoginPage;
