"use client";

import { Navbar } from "@/components/navbar";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signupUser } from "@/services/authService";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { validateEmail } from "@/utils/validateEmail";

export default function Signup() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const setAuth = useAuthStore((s) => s.setAuth);
  const [fullNameValue, setFullNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (accessToken) {
      router.replace("/account");
    }
  }, [accessToken, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!validateEmail(emailValue)) {
      setError("Invalid email address");
      setLoading(false);
      return;
    }

    if (passwordValue.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const data = await signupUser({
        full_name: fullNameValue,
        email: emailValue,
        password: passwordValue,
      });

      if (data.status === "error" || !data.data) {
        setError(data.status_message);
        return;
      }

      const { access_token, id, full_name, email } = data.data;
      setAuth(access_token, { id, full_name, email });

      router.push("/account");
    } catch (error) {
      console.error(error);
      setError("An error occurred while signing up");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-20">
        <div className="w-full max-w-sm flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold -mb-1">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your details to sign up
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullNameValue}
                onChange={(e) => setFullNameValue(e.target.value)}
                required
                className="border rounded px-3 h-9 text-sm bg-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="johndoe@gmail.com"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                required
                className="border rounded px-3 h-9 text-sm bg-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                required
                className="border rounded px-3 h-9 text-sm bg-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Sign up"}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary underline underline-offset-4"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
