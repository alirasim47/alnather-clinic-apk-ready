const AR_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

const AR_WEEKDAYS = [
  "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"
];

export const fmtMoney = (n) =>
  new Intl.NumberFormat("ar-IQ", {
    style: "currency",
    currency: "IQD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

export const fmtDate = (d) => {
  const date = parseLocalDate(d);
  if (Number.isNaN(date.getTime())) return "—";
  return `${date.getDate()} ${AR_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

export const todayISO = () => {
  const date = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

function parseLocalDate(value) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(value);
}

export const longDate = () => {
  const date = new Date();
  return `${AR_WEEKDAYS[date.getDay()]}، ${date.getDate()} ${AR_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

export function buildWhatsApp({
  phone,
  name,
  date,
  time,
  clinic = "عيادتي",
  countryCode = "964",
  customTemplate = "",
}) {
  const clean = String(phone || "").replace(/\D/g, "");
  const full = clean.startsWith("0") ? countryCode + clean.slice(1) : clean;

  let finalMessage = "";

  if (customTemplate && customTemplate.trim().length > 0) {
    finalMessage = customTemplate
      .replace(/{name}/g, name || "")
      .replace(/{date}/g, date || "")
      .replace(/{time}/g, time || "")
      .replace(/{clinic}/g, clinic || "");
  } else {
    finalMessage =
      `مرحباً ${name} 👋\n` +
      `نودّ تذكيركم بموعد المراجعة في عيادة *${clinic}* لفحص النظر.\n` +
      `🗓️ التاريخ: ${date}\n⏰ الوقت: ${time}\n` +
      `نسعد بخدمتكم، وفي حال وجود أي استفسار يرجى التواصل معنا.`;
  }

  return `https://wa.me/${full}?text=${encodeURIComponent(finalMessage)}`;
}

export const openWhatsApp = (payload) =>
  window.open(buildWhatsApp(payload), "_blank");

export function printPrescription({ patient, exam, rx, clinic }) {
  const row = (label, od, os) => `
    <tr>
      <td class="lbl">${label}</td>
      <td>${od.SPH || "—"}</td><td>${od.CYL || "—"}</td><td>${od.AXIS || "—"}</td>
      <td>${os.SPH || "—"}</td><td>${os.CYL || "—"}</td><td>${os.AXIS || "—"}</td>
    </tr>`;

  const html = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8">
  <title>وصفة نظر — ${patient.name}</title>
  <style>
    *{box-sizing:border-box;font-family:Tajawal,sans-serif}
    body{margin:24px;color:#1f2937}
    .head{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #2c1b3d;padding-bottom:12px}
    .logo{display:flex;align-items:center;gap:10px;font-size:22px;font-weight:800;color:#2c1b3d}
    .logo i{color:#eab308;font-size:26px}
    h2{margin:18px 0 6px;font-size:16px;color:#2c1b3d}
    table{width:100%;border-collapse:collapse;margin-top:8px}
    th,td{border:1px solid #d1d5db;padding:8px 10px;text-align:center;font-size:13px}
    th{background:#2c1b3d;color:#fff}
    td.lbl{background:#f3f4f6;font-weight:800}
    .meta{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px;font-size:13px}
    .meta div{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:8px}
    .foot{margin-top:28px;font-size:11px;color:#6b7280;text-align:center;border-top:1px dashed #d1d5db;padding-top:10px}
    @media print{.noprint{display:none}}
  </style></head><body>
    <div class="head">
      <div class="logo">👁️ ${clinic.name}</div>
      <div style="font-size:12px;color:#6b7280">${clinic.phone || ""}<br>وصفة فحص نظر</div>
    </div>
    <div class="meta">
      <div><b>المريض:</b> ${patient.name}</div>
      <div><b>التاريخ:</b> ${exam.date}</div>
      <div><b>الفاحص:</b> ${exam.examiner}</div>
      <div><b>PD:</b> ${exam.pd || "—"}</div>
      <div><b>حدة الإبصار OD/OS:</b> ${exam.vaOD || "—"} / ${exam.vaOS || "—"}</div>
      <div><b>نوع العدسة:</b> ${exam.lens || "—"}</div>
    </div>
    <h2>الرؤية البعيدة (Distance)</h2>
    <table>
      <tr><th rowspan="2">العين</th><th colspan="3">OD — اليمنى</th><th colspan="3">OS — اليسرى</th></tr>
      <tr><th>SPH</th><th>CYL</th><th>AXIS</th><th>SPH</th><th>CYL</th><th>AXIS</th></tr>
      ${row("بعيد", rx.distance.OD, rx.distance.OS)}
    </table>
    <h2>الرؤية القريبة (Near)</h2>
    <table>
      <tr><th rowspan="2">العين</th><th colspan="3">OD — اليمنى</th><th colspan="3">OS — اليسرى</th></tr>
      <tr><th>SPH</th><th>CYL</th><th>AXIS</th><th>SPH</th><th>CYL</th><th>AXIS</th></tr>
      ${row("قريب", rx.near.OD, rx.near.OS)}
    </table>
    ${exam.refraction ? `<h2>نتيجة الانكسار</h2><p style="font-size:13px">${exam.refraction}</p>` : ""}
    ${exam.notes ? `<h2>ملاحظات</h2><p style="font-size:13px">${exam.notes}</p>` : ""}
   <div class="foot">تم إصدار هذه الوصفة إلكترونياً بواسطة نظام عيادتي لإدارة العيادات</div>
    <script>window.onload=()=>setTimeout(()=>window.print(),300)</script>
  </body></html>`;

  const w = window.open("", "_blank", "width=800,height=900");
  w.document.write(html);
  w.document.close();
}
