import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import ts from 'typescript';
const cache = new Map();
function readModule(filename) {
  filename = path.resolve(filename.endsWith('.ts') ? filename : `${filename}.ts`);
  if(cache.has(filename)) return cache.get(filename);
  const compiledModule = {exports:{}};
  cache.set(filename,compiledModule.exports);
  const compiled = ts.transpileModule(fs.readFileSync(filename,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS, target:ts.ScriptTarget.ES2020}}).outputText;
  vm.runInNewContext(compiled,{exports:compiledModule.exports,module:compiledModule,require:(id)=>readModule(path.resolve(path.dirname(filename),id))},{filename});
  return compiledModule.exports;
}
const {allBills,billsByState,STATUS_META,TOPIC_META,filterBills,getBillStats}=readModule('src/data/bills/index.ts');
const ids = new Set();
for(const b of allBills) {
  assert(!ids.has(b.id), `Duplicate bill ID: ${b.id}`);ids.add(b.id);
  assert(billsByState[b.state]?.includes(b), `Unregistered state: ${b.id}`);
  assert(STATUS_META[b.status],`Invalid status: ${b.id}`);
  assert(b.title?.trim() && b.summary?.trim(),`Missing title/summary: ${b.id}`);
  assert(b.topics.length > 0 && new Set(b.topics).size === b.topics.length,`Missing/duplicate topics: ${b.id}`);
  for(const topic of b.topics) assert(TOPIC_META[topic],`Invalid topic ${topic}: ${b.id}`);
  if(b.statusDate) assert(/^\d{4}-\d{2}(?:-\d{2})?$/.test(b.statusDate) && !Number.isNaN(Date.parse(b.statusDate)),`Invalid date: ${b.id}`);
  if(/^Vetoed by/i.test(b.statusLabel)) assert.equal(b.status,'vetoed',`Contradictory veto category: ${b.id}`);
}
const stats=getBillStats();
assert.equal(Object.values(stats.byState).reduce((a,b)=>a+b,0),allBills.length);
assert.equal(Object.keys(STATUS_META).reduce((n,s)=>n+filterBills(allBills,{status:s}).length,0),allBills.length);
assert.equal(filterBills(allBills,{query:'wAsHiNgToN'}).length,billsByState.Washington.length);
assert.equal(filterBills(allBills,{state:'Arizona',topic:'drug-pricing'}).length,allBills.filter(b=>b.state==='Arizona' && b.topics.includes('drug-pricing')).length);
console.log(`Data checks passed: ${allBills.length} unique bills, ${Object.keys(billsByState).length} states, ${Object.keys(TOPIC_META).length} topic definitions. Counts and status labels are consistent. Legislative accuracy requires review against official sources.`);
