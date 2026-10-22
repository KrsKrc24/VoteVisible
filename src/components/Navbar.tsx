"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import CommandPalette from "./CommandPalette";

const LINKS = [
  { href: "/bills", label: "Bills" },
  { href: "/take-action", label: "Take Action" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-950/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center rounded-lg bg-white px-2.5 py-1.5" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="VoteVisible" width={173} height={40} priority className="h-6 w-auto" />
        </Link>

        <div className="hidden items-center gap-8 sm:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-blue-300"
            >
              {link.label}
            </Link>
          ))}
          <CommandPalette />
          <Link
            href="/take-action"
            className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-400"
          >
            Contact Reps
          </Link>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-md text-slate-200 sm:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-navy-950 px-5 pb-5 sm:hidden">
          <div className="flex flex-col gap-4 pt-4">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-blue-300"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/take-action"
              className="rounded-full bg-blue-500 px-4 py-2 text-center text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Contact Reps
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
