"use client";
// ============================================================
// طبقة البيانات — نسخة التطبيق المستقل (APK)
// كل البيانات تُحفظ محلياً على الجهاز عبر localStorage.
// لا يوجد أي اتصال بسيرفر أو شبكة — التطبيق يعمل بالكامل Offline.
// نفس الواجهة (fetchCollection / saveCollection / saveSingleItem /
// deleteSingleItem) المستخدمة في كل الشاشات، فقط تغيّر التنفيذ الداخلي.
// ============================================================

import { readStorage, writeStorage, STORAGE_KEYS, DEFAULT_BASELINE } from "./storage";

function keyFor(name) {
  return STORAGE_KEYS[name] || `clinic-${name}-v1`;
}

function notifyUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("clinic-data-updated"));
  }
}

// جلب مجموعة بيانات كاملة (أو كائن الإعدادات)
export async function fetchCollection(name, fallback) {
  const key = keyFor(name);
  const defaultValue =
    fallback !== undefined
      ? fallback
      : name === "settings"
      ? DEFAULT_BASELINE.settings
      : DEFAULT_BASELINE[name] || [];
  return readStorage(key, defaultValue);
}

// استبدال مجموعة بيانات كاملة دفعة واحدة
export async function saveCollection(name, data) {
  const key = keyFor(name);
  writeStorage(key, data);
  notifyUpdate();
  return data;
}

// إضافة/تعديل عنصر واحد داخل مجموعة (أو دمج كائن الإعدادات)
export async function saveSingleItem(name, item) {
  const key = keyFor(name);

  if (name === "settings") {
    const current = readStorage(key, DEFAULT_BASELINE.settings);
    const next = { ...(current || {}), ...item };
    writeStorage(key, next);
    notifyUpdate();
    return next;
  }

  const list = readStorage(key, []);
  const arr = Array.isArray(list) ? list : [];
  const idx = arr.findIndex((x) => String(x?.id) === String(item?.id));
  const next = idx >= 0 ? arr.map((x, i) => (i === idx ? item : x)) : [...arr, item];

  writeStorage(key, next);
  notifyUpdate();
  return item;
}

// حذف عنصر بمعرّفه من مجموعة — يرجع القائمة بعد الحذف
export async function deleteSingleItem(name, id) {
  const key = keyFor(name);
  const list = readStorage(key, []);
  const arr = Array.isArray(list) ? list : [];
  const next = arr.filter((x) => String(x?.id) !== String(id));

  writeStorage(key, next);
  notifyUpdate();
  return next;
}
