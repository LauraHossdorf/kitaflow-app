import "server-only";
import {cookies} from "next/headers";
import {createHash,randomBytes} from "node:crypto";
import {redirect} from "next/navigation";
import {db} from "./db";
import {requireRole} from "./access";
const cookieName="kitaflow_session";
const tokenHash=(token:string)=>createHash("sha256").update(token).digest("hex");
export async function createSession(userId:string) {
 const jar=await cookies();
 const old=jar.get(cookieName)?.value;
 if(old) await db.session.deleteMany({where:{tokenHash:tokenHash(old)}});
 const token=randomBytes(32).toString("hex");
 const expiresAt=new Date(Date.now()+8*60*60*1000);
 await db.session.create({data:{userId,tokenHash:tokenHash(token),expiresAt}});
 jar.set(cookieName,token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",expires:expiresAt});
}
export async function currentUser() {
 const token=(await cookies()).get(cookieName)?.value;
 if(!token || !/^[a-f0-9]{64}$/.test(token)) return null;
 const session=await db.session.findUnique({where:{tokenHash:tokenHash(token)},include:{user:{include:{memberships:{include:{kita:true}}}}}});
 if(!session || session.expiresAt<=new Date()) return null;
 return session.user;
}
export async function director(kitaId:string) {
 const user=await currentUser();
 if(!user) redirect("/login");
 requireRole(user.memberships,kitaId,["DIRECTOR"]);
 return user;
}
export async function destroySession() {
 const jar=await cookies();const token=jar.get(cookieName)?.value;
 if(token) await db.session.deleteMany({where:{tokenHash:tokenHash(token)}});
 jar.delete(cookieName);
}

