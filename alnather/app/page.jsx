"use client";
import React, { useState, useEffect } from "react";
import Shell from "@/components/Shell";
import ClinicLogo from "@/components/ClinicLogo";
import { readStorage, STORAGE_KEYS, writeStorage, ensureClinicBaseline } from "@/lib/storage";

export default function Home() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    ensureClinicBaseline();
    const saved = readStorage(STORAGE_KEYS.auth, false);
    setAuthed(Boolean(saved));
  }, []);

  const handleLogin = (username) => {
    writeStorage(STORAGE_KEYS.auth, true);
    writeStorage("clinic-current-user", username);
    setAuthed(true);
  };

  const handleLogout = () => {
    writeStorage(STORAGE_KEYS.auth, false);
    writeStorage("clinic-current-user", "");
    setAuthed(false);
  };

  if (!authed) return <Login onLogin={handleLogin} />;
  return <Shell onLogout={handleLogout} />;
}

function Login({ onLogin }) {
  const [intro, setIntro] = useState(true);
  const [u, setU] = useState("admin");
  const [p, setP] = useState("admin123");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (u.trim() === "admin" && p === "admin123") {
      setError("");
      onLogin(u.trim());
      return;
    }
    setError("اسم المستخدم أو كلمة المرور غير صحيحة");
  };

  if (intro) return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-gradient-to-br from-[#2c1b3d] via-[#341f48] to-[#1d1732] p-4">
      <div className="absolute left-[-80px] top-[-80px] h-60 w-60 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute bottom-[-100px] right-[-60px] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="relative w-full max-w-xl rounded-[28px] bg-[#f7f4fb] p-6 text-center shadow-[0_30px_80px_rgba(12,8,20,0.55)] sm:p-10">
        <span className="absolute left-5 top-5 text-xs font-bold text-gray-400">v1.0.0</span>
        <div className="mx-auto mb-6 w-fit rounded-2xl bg-primary p-3 shadow-lg ring-1 ring-primary/20">
          <ClinicLogo compact={false} className="justify-center text-white" />
        </div>
        <h1 className="text-3xl font-black leading-tight text-primary">بوابة إدارة العيادة</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-600">
          نظام متكامل لإدارة المرضى والفحوصات والمراجعات والمخزون والفواتير، مصمم لتسهيل العمل اليومي داخل العيادة.
        </p>
        <div className="mt-7 grid gap-3 text-right sm:grid-cols-2">
          {["إدارة المرضى والفحوصات", "متابعة المراجعات وملفات المرضى", "إدارة المخزون والمنتجات", "التقارير والفواتير"].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-3 shadow-sm">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success/15 text-success"><i className="fa-solid fa-check text-xs" /></span>
              <span className="text-sm font-bold text-gray-700">{item}</span>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setIntro(false)} className="btn-accent mt-8 w-full py-3 text-base sm:w-auto sm:min-w-48">
          التالي <i className="fa-solid fa-arrow-left" />
        </button>
        <p className="mt-6 text-xs font-bold text-gray-400">عيادة العلي — نظام إدارة فحص النظر والبصريات</p>
      </div>
    </div>
  );

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-gradient-to-br from-[#2c1b3d] via-[#341f48] to-[#1d1732] p-4">
      <div className="absolute left-[-80px] top-[-80px] h-60 w-60 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute bottom-[-100px] right-[-60px] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="relative w-full max-w-md rounded-[28px] border border-white/10 bg-white p-6 shadow-[0_30px_80px_rgba(12,8,20,0.55)] sm:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 w-fit rounded-2xl bg-primary p-3"><ClinicLogo compact={false} className="justify-center text-white" /></div>
          <p className="text-xs font-black tracking-[0.2em] text-gray-400">تسجيل الدخول</p>
          <h2 className="mt-2 text-2xl font-black text-primary">مرحباً بعودتك</h2>
        </div>
        <form onSubmit={submit} className="space-y-4">
              <div className="relative">
                <input
                  className="input pr-11" placeholder="اسم المستخدم" value={u}
                  onChange={(e) => setU(e.target.value)}
                />
                <i className="fa-regular fa-user absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <div className="relative">
                <input
                  type="password" className="input pr-11" placeholder="كلمة المرور" value={p}
                  onChange={(e) => setP(e.target.value)}
                />
                <i className="fa-solid fa-lock absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-600">{error}</div>}

              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-yellow-500" />
                تذكرني على هذا الجهاز
              </label>

              <button type="submit" className="btn-accent w-full py-3 text-base">
                <i className="fa-solid fa-right-to-bracket" /> تسجيل الدخول
              </button>
        </form>
        <button type="button" onClick={() => setIntro(true)} className="mt-4 w-full text-sm font-bold text-primary underline">العودة إلى الشرح</button>
        <div className="mt-5 rounded-xl bg-slate-50 p-3 text-center text-[11px] font-bold text-gray-500">بيانات الدخول التجريبية: admin / admin123</div>
      </div>
    </div>
  );
}
