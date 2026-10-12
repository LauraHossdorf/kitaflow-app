import Link from "next/link";
const modules = [
  ["Kita & Gruppen", "Strukturen und Gruppenzuordnungen verwalten."],
  ["Kinder & Eltern", "Elternzugänge und Kinder sicher zuordnen."],
  ["Personal", "Verfügbarkeit und Qualifikationen erfassen."],
  ["Notfallplanung", "Rückmeldungen sammeln. Die Leitung entscheidet."],
];
export default function Home() {
 return <main className="mx-auto max-w-5xl px-5 py-8 sm:py-14">
  <header className="flex items-center justify-between gap-4"><Link href="/" className="rounded-xl px-3 py-2 text-2xl font-bold">KitaFlow<span className="text-emerald-600">.</span></Link><Link href="/leitung" className="rounded-full bg-white px-4 py-2 text-sm font-semibold">Kita konfigurieren</Link></header>
  <section className="mt-12"><p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">Gemeinsam den Alltag gestalten</p><h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">Mehr Überblick.<br/>Mehr Raum für Betreuung.</h1><p className="mt-5 max-w-xl text-lg text-slate-600">Personal, Gruppen und Notfallplanung an einem Ort. Jede Betreuungsentscheidung bleibt bei der Kita-Leitung.</p></section>
  <section aria-labelledby="status" className="hover-surface mt-10 rounded-3xl border border-slate-200 bg-white p-6"><h2 id="status" className="text-xl font-semibold">Kita-Ampel</h2><p className="mt-3 flex items-center gap-3"><span aria-hidden="true" className="h-3 w-3 rounded-full bg-slate-400"/>Nicht konfiguriert</p><p className="mt-2 text-slate-600">Es gibt noch kein freigegebenes Regelwerk und keine erfassten Personaldaten. Eine Bewertung ist deshalb nicht möglich.</p></section>
  <section aria-label="Geplante Funktionen" className="mt-6 grid gap-4 sm:grid-cols-2">{modules.map(([title,description])=><article key={title} className="hover-surface rounded-2xl bg-white p-6"><h2 className="text-lg font-semibold">{title}</h2><p className="mt-2 text-slate-600">{description}</p><p className="mt-4 text-xs font-medium text-slate-500">Geplant · noch nicht verfügbar</p></article>)}</section>
  <footer className="mt-8 text-sm text-slate-600">Die Kita-Konfiguration ist für angemeldete Leitungen verfügbar. Auf dieser öffentlichen Seite werden keine personenbezogenen Daten angezeigt.</footer>
 </main>;
}

