import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Header />
      </div>
      <main className="flex-1 container mx-auto p-4">{children}</main>
      <Footer />
    </div>
  );
}