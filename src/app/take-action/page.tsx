import Link from "next/link";

export const metadata = {
  title: "Take Action — VoteVisible",
  description: "Find your representatives and learn how to speak up about healthcare legislation in your state.",
};

const STATE_RESOURCES = [
  {
    state: "Washington",
    legislature: "https://leg.wa.gov",
    findDistrict: "https://app.leg.wa.gov/DistrictFinder/",
  },
  {
    state: "Oregon",
    legislature: "https://www.oregonlegislature.gov",
    findDistrict: "https://www.oregonlegislature.gov/FindYourLegislator/leg-districts.html",
  },
  {
    state: "California",
    legislature: "https://www.legislature.ca.gov",
    findDistrict: "https://findyourrep.legislature.ca.gov/",
  },
  {
    state: "Texas",
    legislature: "https://capitol.texas.gov",
    findDistrict: "https://fyi.capitol.texas.gov/",
  },
];

export default function TakeActionPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <span className="text-xs font-semibold uppercase tracking-wide text-teal-600">
        Take Action
      </span>
      <h1 className="mt-2 text-3xl font-bold text-navy-900 sm:text-4xl">
        Your representatives want to hear from you
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
        State legislators pay close attention to messages from constituents
        &mdash; especially young people, who vote less often but are directly
        affected by healthcare decisions. Here&apos;s how to make your voice count.
      </p>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-navy-900">1. Find your representatives</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Use your state legislature&apos;s district finder to look up who
          represents you based on your home address.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {STATE_RESOURCES.map((resource) => (
            <div key={resource.state} className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-navy-900">{resource.state}</h3>
              <div className="mt-3 flex flex-col gap-2 text-sm">
                <a
                  href={resource.findDistrict}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-teal-700 hover:text-teal-800"
                >
                  Find your district &rarr;
                </a>
                <a
                  href={resource.legislature}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-slate-700"
                >
                  State legislature site
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-semibold text-navy-900">2. Pick a bill that affects you</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Browse the{" "}
          <Link href="/bills" className="font-medium text-teal-700 hover:text-teal-800">
            Bills Explorer
          </Link>{" "}
          to find legislation tied to the resources you care about &mdash;
          mental health, maternal care, rural hospitals, drug pricing, and more.
        </p>
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-semibold text-navy-900">3. Send a clear, personal message</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Short, specific, and personal messages are more effective than form
          letters. Here&apos;s a template to start from:
        </p>
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm leading-7 text-slate-700">
          <p>Subject: Please support/oppose [Bill Number] &mdash; [Bill Title]</p>
          <p className="mt-3">Dear [Representative Name],</p>
          <p className="mt-3">
            My name is [Your Name] and I&apos;m a constituent in [City/District].
            I&apos;m writing about [Bill Number], which would [one sentence on
            what the bill does]. This matters to me because [a sentence about
            how it affects you, your school, or your community].
          </p>
          <p className="mt-3">
            I hope you&apos;ll [support/oppose] this bill. Thank you for
            representing our district.
          </p>
          <p className="mt-3">Sincerely, [Your Name]</p>
        </div>
      </div>

      <div className="mt-12 rounded-2xl bg-navy-900 p-6 text-center">
        <h2 className="text-lg font-semibold text-white">
          Not sure where to start?
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          Browse enacted and pending bills tagged by topic to find the issue
          that matters most to you.
        </p>
        <Link
          href="/bills"
          className="mt-4 inline-flex rounded-full bg-gold-400 px-5 py-2.5 text-sm font-semibold text-navy-950 hover:bg-gold-300"
        >
          Explore bills
        </Link>
      </div>
    </div>
  );
}
