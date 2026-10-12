import {PrismaClient} from "@prisma/client";
import {hashPassword} from "../src/lib/password";
const db=new PrismaClient();
async function main(){
 const email=process.env.DIRECTOR_EMAIL?.trim().toLowerCase();
 const password=process.env.DIRECTOR_PASSWORD;
 const kitaName=process.env.KITA_NAME?.trim();
 if(!email||!email.includes("@")||!password||password.length<12||password.length>1024||!kitaName||kitaName.length>120)throw new Error("In .env DIRECTOR_EMAIL, DIRECTOR_PASSWORD (mindestens 12 Zeichen) und KITA_NAME setzen.");
 if(await db.user.findUnique({where:{email}}))throw new Error("Zugang existiert bereits. Kein vorhandenes Konto wird verändert.");
 await db.user.create({data:{email,passwordHash:await hashPassword(password),memberships:{create:{role:"DIRECTOR",kita:{create:{name:kitaName}}}}}});
 console.log("Leitungszugang und Kita wurden angelegt. Bootstrap-Passwort aus .env entfernen.");
}
main().catch(()=>{console.error("Einrichtung fehlgeschlagen. Angaben, Datenbank und vorhandene Konten prüfen.");process.exitCode=1;}).finally(()=>db.$disconnect());

