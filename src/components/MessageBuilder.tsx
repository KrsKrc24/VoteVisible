"use client";
import { useState } from "react";
import { Copy, Check, MessageSquare } from "lucide-react";

type BillOption = {
  id: string;
  billNumber: string;
  state: string;
  title: string;
};
export default function MessageBuilder({ bills }: { bills: BillOption[] }) {
  const [billId, setBillId] = useState("");
  const [name, setName] = useState("");
  const [town, setTown] = useState("");
  const [reason, setReason] = useState("");
  const [position, setPosition] = useState("learn more about");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const bill = bills.find((b) => b.id === billId);
  const subject = bill
    ? `${bill.billNumber}: ${bill.title}`
    : "healthcare access in our community";
  const message = `Subject: A constituent's perspective on ${subject}\n\nDear Representative,\n\nMy name is ${name.trim() || "[Your name]"}, and I live in ${town.trim() || "[Your city or district]"}. I would like to ${position} ${subject}.\n\n${reason.trim() || "[Explain how this issue affects you or your community.]"}\n\nCould you share your position on this issue and what steps our state is taking? Thank you for your time and for representing our community.\n\nSincerely,\n${name.trim() || "[Your name]"}`;
  const control =
    "mt-2 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm";
  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setError("");
    } catch {
      setError(
        "Copy is unavailable in this browser. Select the preview text and copy it manually.",
      );
    }
  }
  return (
    <div
      className="notranslate mt-6 grid gap-7 rounded-3xl border border-blue-100 bg-white p-5 sm:p-8 lg:grid-cols-2"
      translate="no"
    >
      <div>
        <MessageSquare size={25} className="mb-5 text-blue-600" />
        <h3 className="text-xl font-semibold">Put it in your own words.</h3>
        <p className="mt-2 text-xs leading-6 text-slate-500">
          Your details stay in this page. Nothing is submitted or sent.
        </p>
        <label className="mt-5 block text-xs font-medium">
          Choose a bill (optional)
          <select
            value={billId}
            onChange={(e) => {
              setBillId(e.target.value);
              setCopied(false);
            }}
            className={control}
          >
            <option value="">A general healthcare issue</option>
            {bills.map((b) => (
              <option key={b.id} value={b.id}>
                {b.state} · {b.billNumber} · {b.title}
              </option>
            ))}
          </select>
        </label>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="text-xs font-medium">
            Your name
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setCopied(false);
              }}
              className={control}
              placeholder="Your name"
            />
          </label>
          <label className="text-xs font-medium">
            City or district
            <input
              value={town}
              onChange={(e) => {
                setTown(e.target.value);
                setCopied(false);
              }}
              className={control}
              placeholder="Your community"
            />
          </label>
        </div>
        <label className="mt-4 block text-xs font-medium">
          I would like to
          <select
            value={position}
            onChange={(e) => {
              setPosition(e.target.value);
              setCopied(false);
            }}
            className={control}
          >
            <option>learn more about</option>
            <option>express support for</option>
            <option>raise concerns about</option>
          </select>
        </label>
        <label className="mt-4 block text-xs font-medium">
          Why does this matter to you?
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setCopied(false);
            }}
            rows={3}
            placeholder="Share a personal experience or a question for your representative."
            className={control}
          />
        </label>
      </div>
      <div className="flex flex-col rounded-2xl bg-blue-50/60 p-5">
        <span className="eyebrow">YOUR MESSAGE PREVIEW</span>
        <pre className="mt-5 flex-1 whitespace-pre-wrap font-sans text-sm leading-7 text-slate-600">
          {message}
        </pre>
        <button type="button" onClick={copy} className="button-primary mt-6">
          {copied ? <Check size={16} /> : <Copy size={16} />}{" "}
          {copied ? "Message copied" : "Copy my message"}
        </button>
        <p role="status" className="mt-3 text-xs leading-5 text-slate-500">
          {error ||
            (copied
              ? "Paste this into your representative’s official contact form or email, then review it before sending."
              : "Review the wording and replace any brackets before sending.")}
        </p>
      </div>
    </div>
  );
}
