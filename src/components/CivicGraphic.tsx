import {
  HeartPulse,
  Landmark,
  Languages,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

/** Decorative graphic. All real counts live in the accompanying stat strip. */
export default function CivicGraphic() {
  return (
    <div className="civic-graphic" aria-hidden="true">
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="orbit orbit-three" />
      <svg className="civic-connections" viewBox="0 0 520 520" fill="none">
        <path
          d="M260 110V200M110 285l100-25M310 260l120 75"
          stroke="#b8cdff"
          strokeWidth="2"
          strokeDasharray="5 7"
        />
        <path
          className="signal-path"
          d="M50 260h65l20-25 24 50 23-80 32 110 22-55h230"
          stroke="#3b7cf9"
          strokeWidth="2"
        />
      </svg>
      <div className="civic-core">
        <HeartPulse size={61} strokeWidth={1.25} />
        <span>YOUR EVERYDAY</span>
        <strong>starts with policy.</strong>
      </div>
      <div className="graphic-card graphic-law">
        <span className="graphic-icon">
          <Landmark size={20} />
        </span>
        <div>
          <small>STATE LEGISLATION</small>
          <strong>From the capitol</strong>
        </div>
        <ArrowUpRight size={17} />
      </div>
      <div className="graphic-card graphic-language">
        <Languages size={25} className="text-blue-600" />
        <div>
          <small>ACROSS LANGUAGES</small>
          <strong>మీ స్వరం matters.</strong>
        </div>
      </div>
      <div className="graphic-card graphic-community">
        <span className="graphic-icon">
          <Sparkles size={20} />
        </span>
        <div>
          <small>TO YOUR COMMUNITY</small>
          <strong>Make it personal.</strong>
        </div>
      </div>
      <div className="orbit-dot dot-one" />
      <div className="orbit-dot dot-two" />
      <span className="graphic-caption">UNDERSTAND. CONNECT. SPEAK UP.</span>
    </div>
  );
}
