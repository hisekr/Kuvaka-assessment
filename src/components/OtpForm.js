"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchCountries } from "@/services/api";

const otpSchema = z.object({
  country: z.string().min(1, "Select country"),
  phone: z
    .string()
    .min(8, "Enter valid phone number")
    .max(15, "Phone number too long"),
});

const OtpForm = ({ mode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    onError: () => toast.error("Failed to load countries codes"),
  });

  const checkUserExists = (phoneNumber) => {
    const storedAuth = JSON.parse(localStorage.getItem("authState") || "{}");
    const existingNumbers = storedAuth.signupNumbers || [];
    return existingNumbers.includes(phoneNumber);
  };

  const onSubmit = async (data) => {
    try {
      const phoneFull = `${data.country}${data.phone}`;

      if (!/^\+?\d+$/.test(phoneFull)) {
        toast.error("Invalid phone number format");
        return;
      }

      const userExists = checkUserExists(phoneFull);

      console.log("userExists", userExists);

      if (mode === "signup" && userExists) {
        toast.error(
          "This number is already registered. Please login to continue."
        );
        return;
      }

      if (mode === "login" && !userExists) {
        toast.error("Number not registered. Please signup");
        return;
      }

      setLoading(true);
      await new Promise((res) => setTimeout(res, 1500));

      localStorage.setItem("otpPhone", phoneFull);
      localStorage.setItem("authMode", mode);

      router.push("/otp-verification");
    } catch (error) {
      console.error("Error occured: ", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-[var(--background)] text-[var(--foreground)] p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 capitalize">
        {mode} - Enter phone
      </h2>

      {isLoading ? (
        <p className="text-center text-sm bg-[var(--background)] text-[var(--foreground)]">
          Loading countries...
        </p>
      ) : isError ? (
        <p className="text-center text-sm bg-[var(--background)] text-[var(--foreground)]">
          Failed to load countries
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <select
            {...register("country")}
            className="w-full border p-2 sm:p-3 text-sm sm:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--background)] text-[var(--foreground)]"
            defaultValue=""
          >
            <option value="" disabled>
              Select country code
            </option>
            {data?.map((c) => (
              <option key={c.name} value={c.code}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>

          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country.message}</p>
          )}

          <input
            type="tel"
            {...register("phone")}
            placeholder="Phone number"
            className="border p-2 w-full rounded-md bg-[var(--background)] text-[var(--foreground)]"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 w-full disabled:opacity-50"
            disabled={!isValid || loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}
    </div>
  );
};

export default OtpForm;
