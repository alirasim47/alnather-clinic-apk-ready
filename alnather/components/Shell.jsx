"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Dashboard from "@/screens/Dashboard";
import Patients from "@/screens/Patients";
import Followups from "@/screens/Followups";
import Examiners from "@/screens/Examiners";
import Invoices from "@/screens/Invoices";
import Products from "@/screens/Products";
import Reports from "@/screens/Reports";
import Users from "@/screens/Users";
import Settings from "@/screens/Settings";

const TITLES = {
  dashboard: "لوحة التحكم",
  patients: "إدارة المرضى",
  followups: "تنبيهات المراجعات",
  examiners: "الفاحصون والكادر",
  invoices: "الفواتير والمبيعات",
  products: "المنتجات والمخزون",
  reports: "التقارير",
  users: "المستخدمون والصلاحيات",
  settings: "الإعدادات",
};

export default function Shell({ onLogout }) {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = window.location.hash.replace(/^#\/?/, "");
    if (TITLES[saved]) setPage(saved);
  }, []);

  const go = (next) => {
    setPage(next);
    setSidebarOpen(false);
    window.history.replaceState(null, "", `#${next}`);
  };

  return (
    <div className="relative flex h-[100dvh] overflow-hidden bg-gray-50" dir="rtl">
      <Sidebar
        page={page}
        setPage={go}
        onLogout={onLogout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar title={TITLES[page]} onMenu={() => setSidebarOpen(true)} />
        <main className="min-h-0 flex-1 scroll-y-touch p-3 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:p-6">
          {page === "dashboard" && <Dashboard go={go} />}
          {page === "patients" && <Patients />}
          {page === "followups" && <Followups />}
          {page === "examiners" && <Examiners />}
          {page === "invoices" && <Invoices />}
          {page === "products" && <Products />}
          {page === "reports" && <Reports />}
          {page === "users" && <Users />}
          {page === "settings" && <Settings />}
        </main>
      </div>
    </div>
  );
}
