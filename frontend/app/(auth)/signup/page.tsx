"use client";

import { Navbar } from "@/components/navbar";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signupUser } from "@/services/authService";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { validateEmail } from "@/utils/validateEmail";
import { Footer } from "@/components/footer";

export default function Signup() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const setAuth = useAuthStore((s) => s.setAuth);
  const [fullNameValue, setFullNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (accessToken) {
      router.replace("/account");
    }
  }, [accessToken, router]);

  const { mutate: signup, isPending } = useMutation({
    mutationFn: () =>
      signupUser({
        full_name: fullNameValue,
        email: emailValue,
        password: passwordValue,
      }),
    onSuccess: (data) => {
      if (data.status === "error" || !data.data) {
        setValidationError(data.status_message);
        return;
      }
      const { access_token, id, full_name, email } = data.data;
      setAuth(access_token, { id, full_name, email });
      router.push("/account");
    },
    onError: () => {
      setValidationError("An error occurred while signing up");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError("");

    if (!validateEmail(emailValue)) {
      setValidationError("Invalid email address");
      return;
    }

    if (passwordValue.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }

    signup();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-5 px-8">
        <Navbar />
        <div className="flex items-center justify-center mt-20">
          <div className="w-full max-w-sm flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold -mb-1">
                Create an account
              </h1>
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

              {validationError && (
                <p className="text-sm text-destructive">{validationError}</p>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="rounded cursor-pointer"
              >
                {isPending ? "Signing up..." : "Sign up"}
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
      </div>
      <Footer />
    </div>
  );
}
