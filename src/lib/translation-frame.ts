/** A fresh, non-React document for each translation request. Google never edits the app DOM. */
export interface TranslationRequest {
  request: number;
  language: string;
  title: string;
  summary: string;
}

export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );
}

export function isReaderMessage(
  value: unknown,
  request: number,
  language: string,
): value is {
  type: "votevisible-reader";
  request: number;
  language: string;
  status: "ready" | "error" | "resize";
  height?: number;
} {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return (
    data.type === "votevisible-reader" &&
    data.request === request &&
    data.language === language &&
    ["ready", "error", "resize"].includes(String(data.status))
  );
}

export function buildTranslationDocument(input: TranslationRequest): string {
  // Script payloads must also escape '<': a literal closing script tag would end the element.
  const payload = JSON.stringify(input)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
  *{box-sizing:border-box}body{margin:0!important;top:0!important;background:#f8f9f5;color:#1e293b;font:17px/1.8 system-ui,sans-serif;overflow-wrap:anywhere}h2{margin:0 0 16px;color:#1c2c3d;font-size:24px;line-height:1.4}p{margin:0;white-space:pre-line}#widget,iframe.skiptranslate,#goog-gt-tt{display:none!important}.goog-text-highlight{background:transparent!important;box-shadow:none!important}article{padding:4px 2px 12px}
  </style></head><body><article id="content"><h2>${escapeHtml(input.title)}</h2><p id="summary">${escapeHtml(input.summary)}</p></article><div id="widget"></div>
  <script>
  (() => {
    const config = ${payload};
    const widgetCode = ({he:'iw',jv:'jw'})[config.language] || config.language;
    let done = false, quiet, poll, observer;
    const send = (status) => parent.postMessage({type:'votevisible-reader', request:config.request, language:config.language, status, height:document.getElementById('content').scrollHeight+16}, '*');
    const stop = () => { clearTimeout(quiet); clearInterval(poll); if(observer) observer.disconnect(); };
    const fail = () => { if(done) return; done=true; stop(); send('error'); };
    const timeout = setTimeout(fail, 22000);
    // Discard obsolete page-wide widget cookies. No cookie is used as app state.
    try {
      const labels = location.hostname.split('.');
      const scopes = [''];
      for(let i=0;i<labels.length-1;i++) scopes.push(labels.slice(i).join('.'),'.'+labels.slice(i).join('.'));
      scopes.forEach(domain => { document.cookie='googtrans=; path=/; Max-Age=0'+(domain?'; domain='+domain:''); });
    } catch (_) {}
    const isTranslated = () => {
      const select=document.querySelector('select.goog-te-combo');
      const text=document.getElementById('summary').textContent.trim();
      return select && select.value===widgetCode && text && text!==config.summary.trim();
    };
    const changed = () => {
      clearTimeout(quiet);
      if(!isTranslated()) return;
      quiet=setTimeout(() => {
        if(done || !isTranslated()) return;
        done=true; clearTimeout(timeout); stop();
        document.documentElement.lang=config.language;
        document.documentElement.dir=['ar','fa','he','ur','ps','sd','yi','ug','dv'].includes(config.language)?'rtl':'ltr';
        send('ready');
      },900);
    };
    window.googleTranslateElementInit = () => {
      try {
        new google.translate.TranslateElement({pageLanguage:'en',autoDisplay:false},'widget');
        observer=new MutationObserver(changed);
        observer.observe(document.getElementById('content'),{subtree:true,childList:true,characterData:true});
        let tries=0;
        poll=setInterval(() => {
          const select=document.querySelector('select.goog-te-combo');
          if(select && Array.from(select.options).some(option=>option.value===widgetCode)) {
            clearInterval(poll); select.value=widgetCode; select.dispatchEvent(new Event('change',{bubbles:true})); changed();
          } else if(++tries>65) fail();
        },150);
      } catch (_) { fail(); }
    };
    new ResizeObserver(() => { if(done) send('resize'); }).observe(document.getElementById('content'));
    const script=document.createElement('script');
    script.src='https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.onerror=fail; document.head.appendChild(script);
  })();
  </script></body></html>`;
}
