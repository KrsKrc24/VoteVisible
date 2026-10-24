"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import CommandPalette from "./CommandPalette";

const LINKS = [
  { href: "/bills", label: "Bills" },
  { href: "/take-action", label: "Take Action" },
  { href: "/about", label: "About" },
];

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600";
const ctaStyle = `rounded-none bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white  hover:bg-blue-700 ${focusRing}`;

export default function Navbar() {
  const pathname = usePathname();
  const [menuPathname, setMenuPathname] = useState<string | null>(null);
  const open = menuPathname === pathname;
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.key === "Escape" &&
        !event.defaultPrevented &&
        !document.querySelector("dialog[open]")
      ) {
        setMenuPathname(null);
        menuButtonRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function linkStyle(href: string) {
    return `rounded-none px-3 py-2 text-sm font-medium  ${focusRing} ${
      isActive(href)
        ? "bg-surface text-blue-700"
        : "text-slate-600 hover:bg-surface hover:text-blue-700"
    }`;
  }

  return (
    <header
      className="notranslate sticky top-0 z-50 border-b border-slate-200/80 bg-background "
      translate="no"
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8"
      >
        <Link
          href="/"
          aria-label="VoteVisible home"
          className={`shrink-0 rounded-none ${focusRing}`}
          onClick={() => setMenuPathname(null)}
        >
          <Image
            src="/logo.png"
            alt="VoteVisible"
            width={173}
            height={40}
            preload
            className="h-7 w-auto mix-blend-multiply sm:h-8"
          />
        </Link>

        <div className="ml-auto hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={linkStyle(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <CommandPalette />
          <Link
            href="/take-action"
            className={`hidden md:inline-flex ${ctaStyle}`}
          >
            Contact Reps
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            className={`flex min-h-11 items-center px-2 text-sm justify-center rounded-none text-slate-600  hover:bg-surface hover:text-blue-700 md:hidden ${focusRing}`}
            onClick={() => setMenuPathname(open ? null : pathname)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls={menuId}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      <div
        id={menuId}
        hidden={!open}
        className="border-t border-slate-200 bg-paper px-5 pb-5 md:hidden"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-2 pt-4">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={linkStyle(link.href)}
              onClick={() => setMenuPathname(null)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/take-action"
            className={`mt-2 text-center ${ctaStyle}`}
            onClick={() => setMenuPathname(null)}
          >
            Contact Reps
          </Link>
        </div>
      </div>
    </header>
  );
}
