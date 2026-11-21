import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Faceless Shorts Factory | Groq + Remotion',
  description: 'Instant YouTube Shorts Generator powered by Groq Llama 3.3 70B and Remotion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090a0f] text-gray-100 antialiased selection:bg-amber-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
