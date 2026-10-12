"use server";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import {hashPassword,verifyPassword} from "@/lib/password";
import {createSession,destroySession} from "@/lib/session";
const invalid=()=>redirect("/login?error=invalid");
export async function login(data:FormData) {
 const email=String(data.get("email")??"").trim().toLowerCase();
 const password=String(data.get("password")??"");
 if(email.length>254||password.length>1024||!email||!password)invalid();
 const user=await db.user.findUnique({where:{email}});
 if(!user?.passwordHash) {await hashPassword(password);invalid();}
 if(user!.lockedUntil && user!.lockedUntil>new Date())invalid();
 if(!await verifyPassword(password,user!.passwordHash!)) {
  const changed=await db.user.update({where:{id:user!.id},data:{failedLoginAttempts:{increment:1}}});
  if(changed.failedLoginAttempts>=5) await db.user.update({where:{id:user!.id},data:{lockedUntil:new Date(Date.now()+15*60*1000),failedLoginAttempts:0}});
  invalid();
 }
 await db.user.update({where:{id:user!.id},data:{failedLoginAttempts:0,lockedUntil:null}});
 await createSession(user!.id);
 redirect("/leitung");
}
export async function logout() {await destroySession();redirect("/login");}

