import { GeistSans } from "geist/font/sans";
import "../theme/globals.css";
import AuthButton from "../components/AuthButton";
import Link from "next/link";
import StoreProvider from "./StoreProvider";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Stonks Fullstack",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <StoreProvider>
        <body className="bg-background text-foreground">
          <nav className="w-full flex justify-between border-b border-b-foreground/10  h-16 px-[20rem]">
            <ul className="h-full w-full flex items-center justify-between">
              <li>
                <Link href="/">Stonks</Link>
              </li>
              <li>
                <AuthButton />
              </li>
            </ul>
          </nav>
          {children}
        </body>
      </StoreProvider>
    </html>
  );
}
