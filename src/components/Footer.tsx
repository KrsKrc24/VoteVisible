import Link from "next/link";

const TEAM = ["Shritan Pothini", "Akshaj Mamidi", "Arjun Harshe", "Prady Mandalapu", "Alexander Mammar"];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-950 text-slate-400">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <span className="text-lg font-semibold text-white">VoteVisible</span>
            <p className="mt-3 max-w-xs text-sm leading-6">
              Translating state healthcare legislation into plain language so
              young people can see the real impact on their communities.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Explore
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/bills" className="hover:text-blue-300">Bills Explorer</Link></li>
              <li><Link href="/take-action" className="hover:text-blue-300">Take Action</Link></li>
              <li><Link href="/about" className="hover:text-blue-300">About the Team</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Team
            </h3>
            <ul className="mt-3 space-y-1 text-sm">
              {TEAM.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-500">
          VoteVisible is an independent civic-tech project based in Issaquah, Washington.
          Bill data is condensed for readability — always verify details with your state
          legislature&apos;s official records before taking action.
        </div>
      </div>
    </footer>
  );
}
