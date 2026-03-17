"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import { Mail, Lock, User, Phone, MapPin, Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const token = localStorage.getItem("accessToken");
    if (token) {
      router.replace("/dashboard");
    }
  }, [mounted, router]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/auth/register", {
        name,
        email,
        phone,
        address,
        password,
      });

      setSuccess("Account created successfully");

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err: unknown) {
      const errorMessage =
        (err as {
          response?: { data?: { message?: string } };
          request?: unknown;
        })?.response?.data?.message ||
        ((err as { request?: unknown })?.request
          ? "Server not responding. Please try again."
          : "Signup failed");

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F8F8FC] p-3">
      <div className="mx-auto grid min-h-[calc(100vh-24px)] max-w-7xl overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm lg:grid-cols-2">
        <div className="flex items-center justify-center px-4 py-8 sm:px-8 sm:py-10 md:px-12 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl lg:text-4xl">
                Create Account
              </h1>

              <p className="mt-2 text-sm text-gray-600 sm:text-base">
                Start managing your tasks with your new account.
              </p>
            </div>

            {error ? (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                {success}
              </div>
            ) : null}

            <form onSubmit={handleSignup} className="space-y-4 sm:space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#111827]">
                  Name
                </label>
                <div className="flex h-12 items-center gap-3 rounded-2xl border border-gray-300 bg-white px-4 transition focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200">
                  <User size={18} className="shrink-0 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#111827]">
                  Email
                </label>
                <div className="flex h-12 items-center gap-3 rounded-2xl border border-gray-300 bg-white px-4 transition focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200">
                  <Mail size={18} className="shrink-0 text-gray-500" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#111827]">
                    Phone
                  </label>
                  <div className="flex h-12 items-center gap-3 rounded-2xl border border-gray-300 bg-white px-4 transition focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200">
                    <Phone size={18} className="shrink-0 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Enter phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#111827]">
                    Password
                  </label>
                  <div className="flex h-12 items-center gap-3 rounded-2xl border border-gray-300 bg-white px-4 transition focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200">
                    <Lock size={18} className="shrink-0 text-gray-500" />
                    <input
                      type="password"
                      placeholder="Enter password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#111827]">
                  Address
                </label>
                <div className="flex min-h-[48px] items-start gap-3 rounded-2xl border border-gray-300 bg-white px-4 py-3 transition focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Enter your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600 sm:text-left">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-purple-600">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-600 via-violet-500 to-indigo-500 p-6 xl:p-8">
            <div className="w-full max-w-2xl overflow-hidden rounded-[28px] bg-white/10 p-3 backdrop-blur-sm">
              <img
                src="/illustration.jpg"
                alt="Signup illustration"
                className="h-full max-h-[760px] w-full rounded-[22px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}