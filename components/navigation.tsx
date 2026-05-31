"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import type { ReactNode } from "react";
import { useState } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  authOnly?: boolean;
};

function HomeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 9.75V21h13V9.75" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20.25a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5h6v6h-6zM13.5 4.5h6v6h-6zM4.5 13.5h6v6h-6zM13.5 13.5h6v6h-6z" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 6.75h15a2.25 2.25 0 0 1 2.25 2.25v7.5A2.25 2.25 0 0 1 19.5 18H6.75L3 21V9A2.25 2.25 0 0 1 4.5 6.75Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 9.75h9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 13.5h6" />
    </svg>
  );
}

function LogInIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.5 19.5 12l-5.25 4.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12H9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25H12" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7.5V6.75A2.25 2.25 0 0 1 11.25 4.5H18a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 18 19.5h-6.75A2.25 2.25 0 0 1 9 17.25V16.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h11.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m7.5 8.25 3.75 3.75-3.75 3.75" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[2]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 7.5h15M4.5 12h15M4.5 16.5h15" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[2]">
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

const baseLinkClass =
  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0";

export default function Navigation() {
  const pathname = usePathname();
  const { status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isSignedIn = status === "authenticated";

  const navItems: NavItem[] = [
    { href: "/", label: "Home", icon: <HomeIcon /> },
    { href: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { href: "/messages", label: "Messages", icon: <MessageIcon />, authOnly: true },
    // { href: "/profile", label: "Profile", icon: <UserIcon /> },
  ];

  const visibleItems = navItems.filter((item) => !item.authOnly || isSignedIn);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/profile"
          className="group flex items-center gap-3 rounded-2xl px-2 py-1 text-white transition hover:bg-white/5"
        >
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-950 shadow-lg shadow-black/20 transition duration-200 group-hover:rotate-6">
            <UserIcon />
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-semibold">Profile</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {visibleItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${baseLinkClass} ${
                  active
                    ? "bg-white text-slate-950 shadow-lg shadow-black/20"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {isSignedIn ? (
            <button
              type="button"
              onClick={() => void signOut({ callbackUrl: "/" })}
              className={`${baseLinkClass} bg-rose-500 text-white shadow-lg shadow-rose-950/20 hover:bg-rose-400`}
            >
              <LogOutIcon />
              Sign out
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className={`${baseLinkClass} bg-white text-slate-950 shadow-lg shadow-black/20 hover:bg-slate-200`}
              >
                <LogInIcon />
                Log in
              </Link>
              <Link
                href="/register"
                className={`${baseLinkClass} border border-white/10 text-slate-200 hover:bg-white/10 hover:text-white`}
              >
                <UserIcon />
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="inline-flex items-center justify-center rounded-2xl border border-white/10 p-2 text-slate-100 transition hover:bg-white/10 lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-white/10 lg:hidden transition-all duration-300 ease-out ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6 lg:px-8">
          {visibleItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`${baseLinkClass} justify-start rounded-2xl ${
                  active
                    ? "bg-white text-slate-950"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}

          <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
            {isSignedIn ? (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  void signOut({ callbackUrl: "/" });
                }}
                className={`${baseLinkClass} justify-start rounded-2xl bg-rose-500 text-white hover:bg-rose-400`}
              >
                <LogOutIcon />
                Sign out
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className={`${baseLinkClass} justify-start rounded-2xl bg-white text-slate-950 hover:bg-slate-200`}
                >
                  <LogInIcon />
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className={`${baseLinkClass} justify-start rounded-2xl border border-white/10 text-slate-200 hover:bg-white/10 hover:text-white`}
                >
                  <UserIcon />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
