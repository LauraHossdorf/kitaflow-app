import {test} from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {PGlite} from "@electric-sql/pglite";
test("SQL migrations support configuration and protect referential integrity",async()=>{
 const db=new PGlite();
 try {
  for(const path of ["20261012114500_init","20261012121500_director_configuration"])await db.exec(await readFile(new URL("../prisma/migrations/"+path+"/migration.sql",import.meta.url),"utf8"));
  await db.exec(`INSERT INTO "Kita" ("id","name") VALUES ('k','Test-Kita');
   INSERT INTO "Group" ("id","kitaId","name") VALUES ('g','k','Testgruppe');
   INSERT INTO "Staff" ("id","kitaId","name","groupId") VALUES ('s','k','Testperson','g');
   INSERT INTO "Child" ("id","groupId","name") VALUES ('c','g','Testkind');`);
  const result=await db.query<{plannedPlaces:number|null}>('SELECT "plannedPlaces" FROM "Group" WHERE id=$1',["g"]);
  assert.equal(result.rows[0].plannedPlaces,null);
  await assert.rejects(db.exec(`INSERT INTO "Group" ("id","kitaId","name") VALUES ('g2','k','Testgruppe')`));
  await assert.rejects(db.exec(`INSERT INTO "Child" ("id","groupId","name") VALUES ('c2','missing','Testkind')`));
  await db.exec(`INSERT INTO "User" ("id","email") VALUES ('u','test@example.invalid');
   INSERT INTO "Session" ("id","userId","tokenHash","expiresAt") VALUES ('session','u','hashed-token',NOW()+INTERVAL '1 hour');
   DELETE FROM "User" WHERE id='u';`);
  const sessions=await db.query<{count:number}>('SELECT count(*)::int AS count FROM "Session"');
  assert.equal(sessions.rows[0].count,0);
 }finally{await db.close();}
});

