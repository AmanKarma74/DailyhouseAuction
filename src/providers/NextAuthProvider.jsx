"use client"; 
// src/providers/NextAuthProvider.jsx

import { SessionProvider } from "next-auth/react";

export default function NextAuthProvider({ children }) {
  // SessionProvider NextAuth ke context ko provide karta hai
  return <SessionProvider>{children}</SessionProvider>;
}