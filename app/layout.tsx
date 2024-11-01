import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { ClerkProvider} from '@clerk/nextjs'
import NavBar from '@/components/layout/NavBar';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Cozy Homes",
  description: "Enjoy the comfort of our homes",
  icons: {icon:'/logo.jpg'}
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <main className='flx flex-col min-h-screen
        bg-secondary'> 
        <NavBar/>
        <section className="bg-red-500">
        {children}
        </section>
        </main>
      </body>
    </html>
    </ClerkProvider>
  );
}
