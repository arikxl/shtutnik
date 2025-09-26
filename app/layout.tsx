import type { Metadata } from "next";
import {  Varela_Round } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const varelaRound = Varela_Round({
  weight: "400", // It's good practice to specify weights
  subsets: ["latin", "hebrew"], // Add 'hebrew' subset for Hebrew characters
});



export const metadata: Metadata = {
  title: "שקר-לי ~ arikxl",
  description: "מחווה למשחק חרטטוני - created by Arik Alexandrov - arikxl",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he">
      <body dir="rtl"
        className={`${varelaRound.className}  antialiased`}
      >

        <nav className=" flex justify-around">
          <Link href='/instructions'>הוראות</Link>
          <Link href='/quiz'>ראש בראש</Link>
          <Link href='/meumat'>מאומת או מחורטט</Link>
          <Link href='/tmunot'>תמו-NOT</Link>
          <Link href='/results'>תוצאות</Link>
          <Link href='/'>בית</Link>
        </nav>

        {children}
      </body>
    </html>
  );
}
