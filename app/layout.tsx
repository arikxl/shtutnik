import type { Metadata } from "next";
import { Varela_Round } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const varelaRound = Varela_Round({
  weight: "400", // It's good practice to specify weights
  subsets: ["latin", "hebrew"], // Add 'hebrew' subset for Hebrew characters
});


export const metadata: Metadata = {
  title: "שטותניק ~ arikxl",
  description: "מחווה למשחק חרטטוני - created by Arik Alexandrov - arikxl",
};


const colors = [
  'bg-gradient-to-tr from-lime-200 to-cyan-300',
  'bg-gradient-to-l from-violet-300 to-sky-200',
  'bg-gradient-to-t from-amber-300 to-pink-300'
];


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const randomGradientClass = colors[Math.floor(Math.random() * colors.length)];

  return (
    <html lang="he">
      <body dir="rtl"
        className={`${varelaRound.className} flex flex-col items-center  antialiased overflow-y-hidden bg-black h-[100vh]`}
      >
        <Providers>
          <main className={`${randomGradientClass} w-[400px] m-auto overflow-y-hidden overflow-x-hidden h-[100dvh]`}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}




{/* <nav className=" flex justify-around">
          <Link href='/instructions'>הוראות</Link>
          <Link href='/quiz'>ראש בראש</Link>
          <Link href='/meumat'>מאומת או מחורטט</Link>
          <Link href='/tmunot'>תמו-NOT</Link>
          <Link href='/results'>תוצאות</Link>
          <Link href='/'>בית</Link>
        </nav> */}