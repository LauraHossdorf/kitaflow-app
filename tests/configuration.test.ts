import {test} from "node:test";
import assert from "node:assert/strict";
import {hashPassword,verifyPassword} from "../src/lib/password";
import {name,optionalCount} from "../src/lib/validation";
test("passwords are salted and incorrect passwords are rejected",async()=>{
 const a=await hashPassword("test-password-long"),b=await hashPassword("test-password-long");
 assert.notEqual(a,b);
 assert.ok(await verifyPassword("test-password-long",a));
 assert.equal(await verifyPassword("wrong",a),false);
 assert.equal(await verifyPassword("test-password-long","invalid"),false);
});
test("configuration preserves unset counts and rejects malformed data",()=>{
 assert.equal(optionalCount(""),null);
 assert.equal(optionalCount("0"),0);
 assert.equal(optionalCount("12"),12);
 for(const value of ["-1","1.5","NaN","10001"," 2"])assert.throws(()=>optionalCount(value));
 assert.equal(name("  Sonnengruppe  "),"Sonnengruppe");
 assert.throws(()=>name(" "));
 assert.throws(()=>name("a".repeat(121)));
});

