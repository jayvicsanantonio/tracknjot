import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { GlobalToolbar } from '@/components/global-toolbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Notes',
  description: 'Apple Notes clone built with Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>
          {`
            @supports (font: -apple-system-body) {
              :root {
                --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              }
            }
          `}
        </style>
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <GlobalToolbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
