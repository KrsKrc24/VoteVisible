import Link from "next/link";
import MessageBuilder from "@/components/MessageBuilder";
import { allBills } from "@/data/bills";

export const metadata = {
  title: "Take Action | VoteVisible",
  description:
    "Find your representatives and learn how to speak up about healthcare legislation in your state.",
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
    findDistrict:
      "https://geo.maps.arcgis.com/apps/instant/lookup/index.html?appid=fd070b56c975456ea2a25f7e3f4289d1",
  },
  {
    state: "California",
    legislature: "https://www.legislature.ca.gov",
    findDistrict: "https://findyourrep.legislature.ca.gov/",
  },
  {
    state: "Texas",
    legislature: "https://capitol.texas.gov",
    findDistrict: "https://wrm.capitol.texas.gov/",
  },
  {
    state: "New York",
    legislature: "https://www.nysenate.gov",
    findDistrict: "https://www.nysenate.gov/find-my-senator",
  },
  {
    state: "Pennsylvania",
    legislature: "https://www.palegis.us",
    findDistrict: "https://www.palegis.us/find-my-legislator",
  },
  {
    state: "Florida",
    legislature: "https://www.flsenate.gov",
    findDistrict: "https://www.flsenate.gov/Senators/Find",
  },
  {
    state: "Illinois",
    legislature: "https://ilga.gov",
    findDistrict:
      "https://elections.il.gov/ElectionOperations/DistrictLocator/AddressFinder.aspx",
  },
  {
    state: "Nevada",
    legislature: "https://www.leg.state.nv.us/",
    findDistrict: "https://www.leg.state.nv.us/whosmylegislator/",
  },
  {
    state: "Arizona",
    legislature: "https://www.azleg.gov/",
    findDistrict: "https://www.azleg.gov/findmylegislator/",
  },
  {
    state: "Georgia",
    legislature: "https://www.legis.ga.gov/",
    findDistrict: "https://www.legis.ga.gov/find-my-legislator",
  },
  {
    state: "North Carolina",
    legislature: "https://www.ncleg.gov/",
    findDistrict: "https://www.ncleg.gov/findyourlegislators",
  },
];

export default function TakeActionPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
        Take Action
      </span>
      <h1 className="mt-2 text-3xl font-bold text-navy-900 sm:text-4xl">
        Contact your state representatives
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
        State legislators pay close attention to messages from constituents,
        especially young people, who vote less often but are directly affected
        by healthcare decisions. Here&apos;s how to make your voice count.
      </p>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-navy-900">
          1. Find your representatives
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Use your state legislature&apos;s district finder to look up who
          represents you based on your home address.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {STATE_RESOURCES.map((resource) => (
            <div
              key={resource.state}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <h3 className="font-semibold text-navy-900">{resource.state}</h3>
              <div className="mt-3 flex flex-col gap-2 text-sm">
                <a
                  href={resource.findDistrict}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-700 hover:text-blue-800"
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
        <h2 className="text-lg font-semibold text-navy-900">
          2. Pick a bill that affects you
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Browse the{" "}
          <Link
            href="/bills"
            className="font-medium text-blue-700 hover:text-blue-800"
          >
            Bills Explorer
          </Link>{" "}
          to find legislation tied to the resources you care about, including
          mental health, maternal care, rural hospitals, and drug pricing.
        </p>
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-semibold text-navy-900">
          3. Send a clear, personal message
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Short, specific, and personal messages are more effective than form
          letters. Build a personal message below, review it, and copy it into
          your representative’s contact form.
        </p>
        <MessageBuilder
          bills={allBills.map(({ id, billNumber, state, title }) => ({
            id,
            billNumber,
            state,
            title,
          }))}
        />
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
          className="mt-4 inline-flex rounded-full bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-400"
        >
          Explore bills
        </Link>
      </div>
    </div>
  );
}
