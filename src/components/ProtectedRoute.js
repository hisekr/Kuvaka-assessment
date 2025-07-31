// components/ProtectedRoute.js
"use client";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isLoggedIn = isAuthenticated && user;

    if (!isLoggedIn && (pathname.startsWith("/dashboard") || pathname.startsWith("/otp-verification"))) {
      router.replace("/login");
    } else if (isLoggedIn && (pathname === "/" || pathname === "/login")) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, user, pathname, router]);

  return children;
}
