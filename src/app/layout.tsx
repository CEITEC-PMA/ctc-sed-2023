import * as React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeProviderComponent from "./theme-provider";
import { UserContextProvider } from "@/userContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SED - Sistema de Eleição de Diretores",
  description: "Sistema de Eleição de Diretores",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <ThemeProviderComponent>
        <body className={inter.className}>
          <UserContextProvider>{children}</UserContextProvider>
        </body>
      </ThemeProviderComponent>
    </html>
  );
}
