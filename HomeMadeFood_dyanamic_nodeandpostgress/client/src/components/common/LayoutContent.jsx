"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

function useIsAuthPage() {
  const pathname = usePathname().toLowerCase();
  return pathname === "/login" || pathname === "/register";
}

// usePathname() is only known at request time on dynamic routes, so each part that
// needs it sits in its own <Suspense>. The page content itself is never blocked.
// Dynamic routes are never login/register, so showing the Header/Footer as the
// fallback is always correct.
function ChromeHeader() {
  return useIsAuthPage() ? null : <Header />;
}

function ChromeFooter() {
  return useIsAuthPage() ? null : <Footer />;
}

export default function LayoutContent({ children }) {
  return (
    <>
      <Suspense fallback={<Header />}>
        <ChromeHeader />
      </Suspense>

      {children}

      <Suspense fallback={<Footer />}>
        <ChromeFooter />
      </Suspense>
    </>
  );
}
