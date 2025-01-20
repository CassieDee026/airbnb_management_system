import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import { ClerkProvider} from '@clerk/nextjs'
import NavBar from '@/components/layout/NavBar';
import { ThemeProvider } from '@/components/theme-provider';
import Container from "@/components/Container";

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
    <ClerkProvider dynamic>
      <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider  
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
              <Toaster/>
        <main className='flx flex-col min-h-screen
        bg-secondary'> 
        <NavBar/>
        <section className='flex-grow'>
          <Container>
            {children}
          </Container>
        </section>
        </main>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
