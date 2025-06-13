import { Geist, Geist_Mono, Sixtyfour_Convergence, Inter_Tight, Orbitron, Sacramento, Poppins } from "next/font/google";
import "./globals.css";
import { ContextProvider } from "../context/context"; // Make sure this path is correct

export const metadata = {
  title: "DERMATOLOGY WEBSITE",
  description: "dermatology website",
};

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  subsets: ["latin"],
});

const sixtyfourConvergence = Sixtyfour_Convergence({
  subsets: ["latin"],
  variable: "--font-sixtyfour-convergence",
});

const sacramento = Sacramento({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-sacramento',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Orbitron:wght@400..900&family=Sacramento&family=Sixtyfour+Convergence&display=swap"
          rel="stylesheet"
        />
        <link href="https://cdn.jsdelivr.net/npm/@fontsource/fredoka-one/index.css" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${poppins.variable} ${geistMono.variable} antialiased`}>
        <ContextProvider>
          {children}
        </ContextProvider>
      </body>
    </html>
  );
}
