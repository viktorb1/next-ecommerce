import type { Metadata } from "next";
import { Roboto, Lobster_Two } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const roboto = Roboto({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--font-roboto" });
const lobster = Lobster_Two({ weight: "700", subsets: ["latin"], variable: "--font-lobster" });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  console.log(session);
  return (
    <html lang="en">
      <body className={`mx-20 lg:mx-48 vsc-initialized ${roboto.variable} ${lobster.variable}`}>
        <Nav user={session?.user} expires={session?.expires as string} />
        {children}
      </body>
    </html>
  );
}
