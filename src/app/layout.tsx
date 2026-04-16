import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Из найма в консалтинг — Диагностика экспертизы",
  description:
    "Узнайте свой потенциал независимого консультанта за 15 минут. Программа Ольги Полднер для топ-менеджеров.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Source+Sans+3:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
