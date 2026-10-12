import Link from "next/link";
import {login} from "./actions";
export default async function Login({searchParams}:{searchParams:Promise<{error?:string}>}) {
 const {error}=await searchParams;
 return <main className="mx-auto max-w-md px-5 py-16"><Link href="/" className="rounded-xl p-2 text-2xl font-bold">KitaFlow.</Link><h1 className="mt-10 text-3xl font-semibold">Anmelden</h1><p className="mt-3 text-slate-600">Mit deinem freigegebenen Kita-Zugang.</p>
 {error&&<p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-red-800">Anmeldung nicht möglich. Bitte Zugangsdaten prüfen oder nach 15 Minuten erneut versuchen.</p>}
 <form action={login} className="mt-6 space-y-5 rounded-2xl bg-white p-6"><label className="block">E-Mail<input name="email" type="email" autoComplete="username" required maxLength={254}/></label><label className="block">Passwort<input name="password" type="password" autoComplete="current-password" required maxLength={1024}/></label><button className="action-button">Anmelden</button></form></main>;
}

