import {test} from "node:test";
import assert from "node:assert/strict";
import {evaluate} from "../src/lib/engine";
import {requireRole} from "../src/lib/access";
test("missing or unapproved rules never produce a green assessment",()=>{
 assert.equal(evaluate({children:10,qualifiedStaff:2},null).status,"NOT_CONFIGURED");
 assert.equal(evaluate({children:10,qualifiedStaff:2},{id:"draft",version:1,approved:false,warningRatio:null,criticalRatio:null}).status,"NOT_CONFIGURED");
});
test("configured rules need valid staffing data",()=>{
 // Synthetic test values, not childcare limits.
 const rule={id:"test",version:1,approved:true,warningRatio:100,criticalRatio:200};
 assert.equal(evaluate({children:10,qualifiedStaff:0},rule).status,"INSUFFICIENT_DATA");
 assert.equal(evaluate({children:200,qualifiedStaff:1},rule).status,"RED");
 assert.throws(()=>evaluate({children:10,qualifiedStaff:2},{...rule,criticalRatio:50}),/INVALID_RULE/);
});
test("access cannot cross tenant boundaries or grant parents director rights",()=>{
 assert.throws(()=>requireRole([{kitaId:"a",role:"DIRECTOR"}],"b",["DIRECTOR"]),/FORBIDDEN/);
 assert.throws(()=>requireRole([{kitaId:"a",role:"PARENT"}],"a",["DIRECTOR"]),/FORBIDDEN/);
});

