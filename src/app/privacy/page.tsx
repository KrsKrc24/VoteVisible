import Link from "next/link";

export const metadata = {
  title: "Privacy | VoteVisible",
  description:
    "How VoteVisible handles saved bills, message drafts, and optional translation.",
};

export default function PrivacyPage() {
  return (
    <article className="policy-page mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <p className="section-label">Site information</p>
      <h1 className="editorial-title mt-3 text-4xl">Privacy policy</h1>
      <p className="mt-4 text-sm text-slate-600">Updated October 24, 2026</p>
      <section>
        <h2>Using the site</h2>
        <p>
          VoteVisible is a student-run information project based in Issaquah,
          Washington. You can browse without an account. We do not ask for a
          password, payment details, or a home address to read bills. The site
          currently has no advertising or dedicated analytics integration.
        </p>
      </section>
      <section>
        <h2>Saved bills and search filters</h2>
        <p>
          When you save a bill, its identifier is stored in your browser on that
          device. It stays there until you remove it or clear the site’s browser
          data. Saved bills do not sync to an account. If browser storage is
          blocked, saves may last only for the current visit.
        </p>
        <p>
          Search terms and filters appear in the page URL so you can return to a
          search or share it. Anyone you share that URL with can see those
          terms. Avoid entering personal or sensitive information in search.
        </p>
      </section>
      <section>
        <h2>Message drafts</h2>
        <p>
          The message builder uses the name, community, and message you type to
          prepare a draft in the page. VoteVisible does not submit that draft or
          save those fields to an account or database. Copying puts the draft on
          your device’s clipboard; other software on your device may have access
          to that clipboard. A representative’s contact form handles information
          you choose to send there under its own privacy rules.
        </p>
      </section>
      <section>
        <h2>Optional Google translation</h2>
        <p>
          Google’s translation service loads when you select a non-English
          reading language. The public bill title and summary are supplied for
          translation, and your browser connects to Google. Google may process
          technical information such as your IP address, browser information,
          and cookies under its own policy. You can read the English original
          without loading this service.
        </p>
        <p>
          Google’s widget may write a translation cookie. VoteVisible clears
          legacy language-preference cookies when starting a fresh reader and
          does not use them as proof that a translation finished. Returning to
          English closes the translated reader; it does not erase information
          already processed by Google.
        </p>
        <p>
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read Google’s privacy policy (new tab)
          </a>
        </p>
      </section>
      <section>
        <h2>Hosting and external links</h2>
        <p>
          Requests to serve the website may be processed in hosting or security
          logs, including technical connection information. Those services have
          their own retention practices. VoteVisible does not set a separate
          retention period for provider logs. Official legislature sites and
          other external pages operate independently of VoteVisible.
        </p>
      </section>
      <section>
        <h2>Your choices and questions</h2>
        <p>
          You can remove saved bills, clear browser site data, decline
          translation, or block third-party requests using your browser
          settings. The site does not request your precise location; district
          lookup links take you to the relevant external tool.
        </p>
        <p>
          Questions about the site can be raised through the{" "}
          <a
            href="https://github.com/KrsKrc24/VoteVisible/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            project issue tracker (new tab)
          </a>
          . Issues are public, so do not post personal, medical, or other
          sensitive information there.
        </p>
      </section>
      <p className="mt-10 border-t border-slate-300 pt-5 text-sm">
        <Link href="/terms">Terms of use</Link>
      </p>
    </article>
  );
}
