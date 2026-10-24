import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      className="notranslate border-t border-slate-300 bg-background text-slate-600"
      translate="no"
    >
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-col justify-between gap-7 sm:flex-row">
          <div>
            <Image
              src="/logo.png"
              alt="VoteVisible"
              width={130}
              height={30}
              className="h-7 w-auto mix-blend-multiply"
            />
            <p className="mt-4 max-w-md text-sm leading-7">
              A student-run guide to state healthcare legislation, based in
              Issaquah, Washington.
            </p>
          </div>
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-start gap-x-6 gap-y-4 text-sm underline underline-offset-4"
          >
            <Link href="/bills">Bills</Link>
            <Link href="/take-action">Contact tools</Link>
            <Link href="/about">Our team</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms of use</Link>
          </nav>
        </div>
        <p className="mt-8 border-t border-slate-300 pt-5 text-xs leading-6">
          Summaries are shortened for readability. Check the official
          legislative record for current text and status before taking action.
        </p>
      </div>
    </footer>
  );
}
