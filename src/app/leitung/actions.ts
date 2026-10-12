"use server";
import {Prisma} from "@prisma/client";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import {director} from "@/lib/session";
import {name,optionalCount,InputError} from "@/lib/validation";

async function save(data:FormData,kind:"kita"|"group"|"staff"|"child") {
 const kitaId=String(data.get("kitaId")??"");
 const user=await director(kitaId);
 let message="Gespeichert.";
 try {
  await db.$transaction(async tx=>{
   const id=String(data.get("id")??"");
   const label=name(data.get("name"));
   let entityId=kitaId;
   if(kind==="kita") {
    await tx.kita.update({where:{id:kitaId},data:{name:label}});
   } else if(kind==="group") {
    const values={name:label,plannedPlaces:optionalCount(data.get("plannedPlaces")),usualStaff:optionalCount(data.get("usualStaff"))};
    if(id) {
     if(!await tx.group.findFirst({where:{id,kitaId}}))throw new InputError("Eintrag nicht gefunden.");
     await tx.group.update({where:{id},data:values});entityId=id;
    } else entityId=(await tx.group.create({data:{...values,kitaId}})).id;
   } else if(kind==="staff") {
    const qualification=String(data.get("qualification")??"").trim();
    if(qualification.length>120)throw new InputError("Qualifikation darf höchstens 120 Zeichen enthalten.");
    const groupId=String(data.get("groupId")??"")||null;
    if(groupId&&!await tx.group.findFirst({where:{id:groupId,kitaId}}))throw new InputError("Gruppe nicht gefunden.");
    const values={name:label,qualification:qualification||null,groupId};
    if(id) {
     if(!await tx.staff.findFirst({where:{id,kitaId}}))throw new InputError("Eintrag nicht gefunden.");
     await tx.staff.update({where:{id},data:values});entityId=id;
    } else entityId=(await tx.staff.create({data:{...values,kitaId}})).id;
   } else {
    const groupId=String(data.get("groupId")??"");
    if(!await tx.group.findFirst({where:{id:groupId,kitaId}}))throw new InputError("Bitte eine Gruppe dieser Kita auswählen.");
    if(id) {
     if(!await tx.child.findFirst({where:{id,group:{kitaId}}}))throw new InputError("Eintrag nicht gefunden.");
     await tx.child.update({where:{id},data:{name:label,groupId}});entityId=id;
    } else entityId=(await tx.child.create({data:{name:label,groupId}})).id;
   }
   await tx.auditEvent.create({data:{kitaId,actorUserId:user.id,action:kind.toUpperCase()+"_SAVED",entityId}});
  });
 } catch(error) {
  if(error instanceof Prisma.PrismaClientKnownRequestError)message=error.code==="P2002"?"Dieser Gruppenname ist bereits vergeben.":"Speichern nicht möglich. Bitte erneut versuchen.";
  else message=error instanceof InputError?error.message:"Speichern nicht möglich.";
  redirect("/leitung?kita="+encodeURIComponent(kitaId)+"&error="+encodeURIComponent(message));
 }
 revalidatePath("/leitung");
 redirect("/leitung?kita="+encodeURIComponent(kitaId)+"&success=1");
}
export async function saveKita(data:FormData){await save(data,"kita");}
export async function saveGroup(data:FormData){await save(data,"group");}
export async function saveStaff(data:FormData){await save(data,"staff");}
export async function saveChild(data:FormData){await save(data,"child");}

