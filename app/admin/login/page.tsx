"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-white font-bold text-lg">زين العابدين للإلكترونيات</h1>
          <p className="text-slate-400 text-sm mt-1">لوحة التحكم</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface rounded-2xl border border-slate-700 p-6 space-y-4">
          <div>
            <Label htmlFor="email" className="text-slate-300">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="admin@zainelectronics.com"
              className="bg-dark-bg border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-slate-300">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="bg-dark-bg border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-800 text-red-400 text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>

        <p className="text-center text-slate-500 text-xs mt-6">
          هذه الصفحة مخصصة للإدارة فقط
        </p>
      </div>
    </div>
  );
}
