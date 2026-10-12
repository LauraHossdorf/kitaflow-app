import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "KitaFlow", description: "Personal und Betreuung gemeinsam planen", manifest: "/manifest.webmanifest" };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>) { return <html lang="de"><body>{children}</body></html>; }

