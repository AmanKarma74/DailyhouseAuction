import { Open_Sans, Montserrat } from 'next/font/google';

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap', 
  variable: '--font-open-sans', 
  weights: ['300', '400', '500', '600', '700'], 
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat', // CSS variable name
  weights: ['400', '600', '700', '800', '900'],
});

import "./globals.scss";
import Footer from "@/components/Footer";
import NextAuthProvider from '@/providers/NextAuthProvider';

export default function RootLayout({ children }) {

  return (
    <html lang="en" className={`${openSans.variable} ${montserrat.variable}`}>
      <body>
        <NextAuthProvider> 
          {children}
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}
