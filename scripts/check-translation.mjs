import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import ts from 'typescript';

const compiled = ts.transpileModule(fs.readFileSync('src/lib/translation-frame.ts', 'utf8'), {
  compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020},
}).outputText;
const api = {};
vm.runInNewContext(compiled, {exports: api});
const message = {type: 'votevisible-reader', request: 7, language: 'te', status: 'ready'};
assert.equal(api.isReaderMessage(message, 7, 'te'), true);
assert.equal(api.isReaderMessage(message, 8, 'te'), false, 'A completed old request must never replace the new selection');
assert.equal(api.isReaderMessage(message, 7, 'hi'), false, 'Another language must not be accepted');
for (const invalid of [null, '', {}, {...message, status: 'anything'}, {...message, type: 'other'}]) {
  assert.equal(api.isReaderMessage(invalid, 7, 'te'), false);
}
const attack = '</script><script>alert("unsafe")</script><img src=x onerror=alert(1)>';
const doc = api.buildTranslationDocument({request: 7, language: 'te', title: attack, summary: 'A & B < C "quoted"'});
assert.equal((doc.match(/<script>/g) || []).length, 1, 'Bill text must not add executable script elements');
assert.equal(doc.includes('<img src=x'), false);
assert.ok(doc.includes('&lt;img'));
assert.ok(doc.includes('A &amp; B &lt; C &quot;quoted&quot;'));
assert.ok(doc.includes('\\u003c/script>'));
assert.ok(doc.includes('pageLanguage:\'en\''), 'Each translation starts from English');
assert.ok(doc.includes('setTimeout(fail, 22000)'), 'Network failures must resolve to an explicit error');
console.log('Reader checks passed: stale requests, language mismatch, message validation, HTML/script escaping, English source, and timeout handling.');

// Execute the actual frame script with a deterministic widget and clock.
function runFrame() {
  const posts = [];
  const timers = new Map();
  const intervals = new Map();
  let nextId = 0;
  let notify = () => {};
  let script;
  const summary = {textContent: 'English source'};
  const combo = {value: '', options: [{value: 'te'}], dispatchEvent() {}};
  const content = {scrollHeight: 250};
  const environment = {
    window: {}, location: {hostname: 'preview.example.com'},
    parent: {postMessage: message => posts.push(message)},
    document: {
      cookie: '', documentElement: {},
      querySelector: () => combo,
      getElementById: id => id === 'summary' ? summary : content,
      createElement: () => ({}), head: {appendChild: value => {script = value;}},
    },
    setTimeout: (callback, delay) => {timers.set(++nextId, {callback, delay}); return nextId;},
    clearTimeout: id => timers.delete(id),
    setInterval: callback => {intervals.set(++nextId, callback); return nextId;},
    clearInterval: id => intervals.delete(id),
    Event: class {},
    MutationObserver: class {constructor(callback) {notify = callback;} observe() {} disconnect() {}},
    ResizeObserver: class {observe() {}},
    google: {translate: {TranslateElement: class {}}},
  };
  const frameHtml = api.buildTranslationDocument({request: 9, language: 'te', title: 'Title', summary: 'English source'});
  vm.runInNewContext(frameHtml.match(/<script>([\s\S]*)<\/script>/)[1], environment);
  return {
    posts, combo,
    load() {environment.window.googleTranslateElementInit(); for (const callback of [...intervals.values()]) callback();},
    translate(text) {summary.textContent = text; notify();},
    flush(delay) {for (const [id, timer] of [...timers]) if (timer.delay === delay) {timers.delete(id); timer.callback();}},
    failNetwork() {script.onerror();},
  };
}
let frameTest = runFrame();
frameTest.load(); frameTest.flush(900);
assert.equal(frameTest.posts.length, 0, 'An unchanged English frame must not report a completed translation');
frameTest.translate('తెలుగు అనువాదం'); frameTest.flush(900);
assert.equal(frameTest.posts.at(-1).status, 'ready');
assert.equal(frameTest.posts.at(-1).language, 'te');
frameTest = runFrame(); frameTest.load(); frameTest.translate('Old response'); frameTest.combo.value = 'hi'; frameTest.flush(900);
assert.equal(frameTest.posts.length, 0, 'A language mismatch must not be confirmed');
frameTest.flush(22000);
assert.equal(frameTest.posts.at(-1).status, 'error', 'Timeout must report an error, not readiness');
frameTest = runFrame(); frameTest.failNetwork();
assert.equal(frameTest.posts.at(-1).status, 'error', 'A blocked Google script must offer a retry state');
console.log('Frame behavior checks passed: unchanged original, translated output, wrong-language completion, timeouts, and blocked scripts.');
