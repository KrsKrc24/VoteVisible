export const metadata = {
  title: "About — VoteVisible",
  description: "VoteVisible is a civic-tech project based in Issaquah, Washington, translating healthcare legislation into plain language for young people.",
};

const TEAM = [
  { name: "Shritan Pothini", role: "Team Lead" },
  { name: "Akshaj Mamidi", role: "Team Member" },
  { name: "Arjun Harshe", role: "Team Member" },
  { name: "Prady Mandalapu", role: "Team Member" },
  { name: "Alexander Mammar", role: "Team Member" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
        About
      </span>
      <h1 className="mt-2 text-3xl font-bold text-navy-900 sm:text-4xl">
        Civic tech, built by students, for students
      </h1>

      <p className="mt-6 text-lg leading-8 text-slate-700">
        Young people across the country have no accessible way to understand
        how state government decisions affect the resources they depend on
        &mdash; hospitals, clinics, mental health services, and schools.
        That gap leaves students powerless in civic processes that directly
        shape their health and well-being.
      </p>
      <p className="mt-4 text-lg leading-8 text-slate-700">
        VoteVisible is a free, mobile-friendly platform that translates state
        healthcare legislation into plain language, shows which bills became
        law and which didn&apos;t, and gives students a direct way to contact
        their representatives about the issues that affect their communities.
      </p>

      <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-navy-900">Based in Issaquah, Washington</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          VoteVisible started as a local project tracking Washington State
          budget and healthcare decisions, and has since expanded to cover
          healthcare legislation in Oregon, California, Texas, New York,
          Pennsylvania, Florida, and Illinois.
        </p>
      </div>

      <h2 className="mt-14 text-2xl font-bold text-navy-900">The team</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {TEAM.map((member) => (
          <div key={member.name} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-700 text-sm font-bold text-white">
              {member.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <h3 className="mt-3 font-semibold text-navy-900">{member.name}</h3>
            <p className="text-sm text-slate-500">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
