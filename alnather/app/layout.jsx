import "./globals.css";
import "@fontsource/tajawal/400.css";
import "@fontsource/tajawal/500.css";
import "@fontsource/tajawal/700.css";
import "@fontsource/tajawal/800.css";
import "@fontsource/tajawal/900.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export const metadata = {
  title: "عيادتي — نظام إدارة العيادات",
  description: "نظام متكامل لإدارة العيادات والمرضى والفحوصات",
  appleWebApp: { capable: true, statusBarStyle: "default" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#2c1b3d" />
      </head>
      <body>{children}</body>
    </html>
  );
}
