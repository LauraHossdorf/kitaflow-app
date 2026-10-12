import Link from "next/link";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import {currentUser,director} from "@/lib/session";
import {logout} from "../login/actions";
import {saveKita,saveGroup,saveChild,saveStaff} from "./actions";
import {SubmitButton} from "@/components/submit-button";
type GroupOption={id:string;name:string};
function Identity({kitaId,id}:{kitaId:string;id?:string}) {return <><input type="hidden" name="kitaId" value={kitaId}/>{id&&<input type="hidden" name="id" value={id}/>}</>;}
function GroupSelect({groups,value="",optional=false}:{groups:GroupOption[];value?:string;optional?:boolean}) {return <label>Gruppe<select name="groupId" defaultValue={value} required={!optional}><option value="">{optional?"Keine feste Zuordnung":"Bitte auswählen"}</option>{groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select></label>;}
export default async function DirectorPage({searchParams}:{searchParams:Promise<{kita?:string;error?:string;success?:string}>}) {
 const params=await searchParams;
 const user=await currentUser();
 if(!user)redirect("/login");
 const memberships=user.memberships.filter(m=>m.role==="DIRECTOR");
 if(!memberships.length)return <main className="mx-auto max-w-xl p-8"><h1 className="text-2xl font-semibold">Kein Leitungszugang</h1><p className="mt-3">Die Konfiguration ist ausschließlich für Kita-Leitungen verfügbar.</p><form action={logout}><SubmitButton>Abmelden</SubmitButton></form></main>;
 const kitaId=params.kita??memberships[0].kitaId;
 await director(kitaId);
 const kita=await db.kita.findUniqueOrThrow({where:{id:kitaId},include:{groups:{orderBy:{name:"asc"},include:{children:{orderBy:{name:"asc"}}}},staff:{orderBy:{name:"asc"}}}});
 const groups=kita.groups;
 const children=groups.flatMap(g=>g.children);
 return <main className="mx-auto max-w-5xl px-5 py-8">
 <header className="flex flex-wrap items-center justify-between gap-4"><Link href="/" className="rounded-xl p-2 text-2xl font-bold">KitaFlow.</Link><form action={logout}><SubmitButton>Abmelden</SubmitButton></form></header>
 <h1 className="mt-8 text-3xl font-semibold">Kita konfigurieren</h1><p className="mt-3 text-slate-600">Gruppen, Team und Kinder von {kita.name} verwalten.</p>
 {memberships.length>1&&<nav aria-label="Kita auswählen" className="mt-4 flex flex-wrap gap-3">{memberships.map(m=><Link key={m.id} aria-current={m.kitaId===kitaId?"page":undefined} href={"/leitung?kita="+m.kitaId} className="rounded-xl bg-white px-4 py-2">{m.kita.name}</Link>)}</nav>}
 {params.error&&<p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-red-800">{params.error}</p>}
 {params.success&&<p role="status" className="mt-5 rounded-xl bg-[#e4f2d9] p-4">Änderungen gespeichert.</p>}
 <section aria-label="Stammdatenübersicht" className="mt-6 grid grid-cols-3 gap-3">{[[groups.length,"Gruppen"],[kita.staff.length,"Mitarbeitende"],[children.length,"Kinder"]].map(([n,label])=><div key={label} className="hover-surface rounded-2xl bg-white p-4"><p className="text-2xl font-bold">{n}</p><p className="text-sm">{label}</p></div>)}</section>
 <p className="mt-4 text-sm text-slate-600">Diese Zahlen sind Stammdaten, keine aktuelle Anwesenheit. Die Kita-Ampel bleibt ohne freigegebenes Regelwerk nicht konfiguriert.</p>
 <nav className="mt-6 flex flex-wrap gap-3" aria-label="Konfigurationsbereiche">{[["kita","Kita"],["gruppen","Gruppen"],["personal","Personal"],["kinder","Kinder"]].map(([id,label])=><a key={id} href={"#"+id} className="rounded-xl bg-white px-4 py-2">{label}</a>)}</nav>
 <section id="kita" className="config-section"><h2>Kita-Einstellungen</h2><form action={saveKita} className="config-form"><Identity kitaId={kitaId}/><label>Kita-Name<input name="name" required maxLength={120} defaultValue={kita.name}/></label><SubmitButton>Speichern</SubmitButton></form></section>
 <section id="gruppen" className="config-section"><h2>Gruppen</h2><p className="mb-5 text-sm text-slate-600">Geplante Plätze und übliches Personal sind optionale Planungsangaben. Sie setzen keine Betreuungsgrenzen.</p>
 <form action={saveGroup} className="config-form"><Identity kitaId={kitaId}/><h3>Gruppe anlegen</h3><label>Gruppenname<input name="name" required maxLength={120}/></label><label>Geplante Plätze<input type="number" name="plannedPlaces" min={0} max={10000}/></label><label>Übliche Anzahl Mitarbeitende<input type="number" name="usualStaff" min={0} max={10000}/></label><SubmitButton>Gruppe anlegen</SubmitButton></form>
 {!groups.length&&<p className="mt-4">Noch keine Gruppen angelegt.</p>}
 {groups.map(g=><details key={g.id} className="mt-4 rounded-xl border border-slate-200"><summary className="hover-surface cursor-pointer rounded-xl p-4">{g.name} · {g.children.length} Kinder</summary><form action={saveGroup} className="config-form m-4"><Identity kitaId={kitaId} id={g.id}/><label>Gruppenname<input name="name" required maxLength={120} defaultValue={g.name}/></label><label>Geplante Plätze<input type="number" name="plannedPlaces" min={0} max={10000} defaultValue={g.plannedPlaces??""}/></label><label>Übliche Anzahl Mitarbeitende<input type="number" name="usualStaff" min={0} max={10000} defaultValue={g.usualStaff??""}/></label><SubmitButton>Änderungen speichern</SubmitButton></form></details>)}</section>
 <section id="personal" className="config-section"><h2>Personal</h2><form action={saveStaff} className="config-form"><Identity kitaId={kitaId}/><h3>Teammitglied anlegen</h3><label>Name<input name="name" required maxLength={120}/></label><label>Qualifikation (optional)<input name="qualification" maxLength={120}/></label><GroupSelect groups={groups} optional/><SubmitButton>Teammitglied anlegen</SubmitButton></form>
 {!kita.staff.length&&<p className="mt-4">Noch kein Personal angelegt.</p>}
 {kita.staff.map(s=><details key={s.id} className="mt-4 rounded-xl border border-slate-200"><summary className="hover-surface cursor-pointer rounded-xl p-4">{s.name} · {s.qualification??"Qualifikation offen"}</summary><form action={saveStaff} className="config-form m-4"><Identity kitaId={kitaId} id={s.id}/><label>Name<input name="name" required maxLength={120} defaultValue={s.name}/></label><label>Qualifikation<input name="qualification" maxLength={120} defaultValue={s.qualification??""}/></label><GroupSelect groups={groups} value={s.groupId??""} optional/><SubmitButton>Änderungen speichern</SubmitButton></form></details>)}</section>
 <section id="kinder" className="config-section"><h2>Kinder</h2>
 {!groups.length?<p>Lege zuerst eine Gruppe an, um Kinder zuzuordnen.</p>:<form action={saveChild} className="config-form"><Identity kitaId={kitaId}/><h3>Kind anlegen</h3><label>Name<input name="name" required maxLength={120}/></label><GroupSelect groups={groups}/><SubmitButton>Kind anlegen</SubmitButton></form>}
 {!children.length&&<p className="mt-4">Noch keine Kinder angelegt.</p>}
 {children.map(c=><details key={c.id} className="mt-4 rounded-xl border border-slate-200"><summary className="hover-surface cursor-pointer rounded-xl p-4">{c.name} · {groups.find(g=>g.id===c.groupId)?.name}</summary><form action={saveChild} className="config-form m-4"><Identity kitaId={kitaId} id={c.id}/><label>Name<input name="name" required maxLength={120} defaultValue={c.name}/></label><GroupSelect groups={groups} value={c.groupId}/><SubmitButton>Änderungen speichern</SubmitButton></form></details>)}</section>
 </main>;
}

