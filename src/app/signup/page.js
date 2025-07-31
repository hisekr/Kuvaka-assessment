"use client";

import React from "react";
import OtpForm from "@/components/OtpForm";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function SignupPage() {
  const router = useRouter();

  const redirectToLogin = () => {
    router.push("/login");
  };

  return (
    <ProtectedRoute>
      <div className="flex-1  flex items-center justify-center bg-[var(--background)] text-[var(--foreground)] p-4 flex-col gap-2">
        <OtpForm mode="signup" />
        <div>
          Already have an Account?{" "}
          <button
            onClick={redirectToLogin}
            className="font-bold cursor-pointer hover:underline"
          >
            login
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
