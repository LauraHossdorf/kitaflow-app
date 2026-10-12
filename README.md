# KitaFlow
Digitale Plattform zur Unterstützung von Kita-Leitungen und pädagogischen Teams bei Personal-, Gruppen-, Betreuungs- und Notfallplanung.

## Status
Technisches Grundgerüst. Die öffentliche Startansicht zeigt ausschließlich den Entwicklungsstatus. Leitungslogin und Formulare für Kita, Gruppen, Personal und Kinder sind implementiert. Der Notfallworkflow folgt. Keine echten Kinder- oder Personaldaten eingeben.

## Lokal starten
Voraussetzungen: Node.js >= 20.9 und Docker mit Compose.
1. `npm ci`
2. `cp .env.example .env`
3. `docker compose up -d`
4. `npm run db:generate`
5. `npx prisma migrate deploy`
6. `npm run dev`
Öffnen: http://localhost:3000

Die Zugangsdaten in compose.yaml und .env.example sind nur für die lokale Entwicklung.

## Prüfen
`npm test`, `npm run typecheck`, `npm run build`, `npx prisma validate`.

## Architektur
Next.js App Router, TypeScript, Tailwind CSS, PostgreSQL, Prisma. Datenmodell unter prisma/schema.prisma. Regel-Engine unter src/lib/engine.ts; Rollenprüfung unter src/lib/access.ts. Geschützte Leitungsaktionen prüfen die Datenbank-Sitzung und Kita-Mitgliedschaft.

Keine voreingestellten Grenzwerte. Ohne freigegebene Konfiguration liefert die Engine NOT_CONFIGURED. Fehlende Fachkräfte liefern INSUFFICIENT_DATA, keine positive Ampel. Testzahlen sind rein synthetisch. Die Engine kennt keine Kinder-IDs und trifft keine Betreuungsentscheidungen.

Regelversionen, Eingabesnapshots, Elternpräferenzen, Rückmeldungen, manuelle Entscheidungen und Audit-Einträge sind im Schema vorbereitet. Leitungsaktionen prüfen Kita-Zugehörigkeit und schreiben Audit-Einträge in Transaktionen. Autorenzuordnungen für den Elternworkflow und unveränderliche Regel-Freigaben folgen.

PWA-Manifest vorhanden; Service Worker und vollständige Installierbarkeit sind Folgearbeit. Es gibt keinen Offline-Cache für Personaldaten.

Der konkrete weitere Plan steht in [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md).


## Validierung dieses Änderungspakets
Sechs Tests, Next.js-Produktionsbuild inklusive TypeScript-Prüfung und Prisma-Schemavalidierung bestanden. Beide SQL-Migrationen wurden in eingebettetem PostgreSQL (PGlite) angewendet; Stammdaten und Fremdschlüssel geprüft. Vollständige Browserprüfung des Login-/Verwaltungsablaufs gegen eine separate PostgreSQL-Instanz ist noch offen.

## Leitungszugang und Konfiguration
Die vollständige Startanleitung steht in [docs/KITA_CONFIGURATION.md](docs/KITA_CONFIGURATION.md). Login unter /login, Verwaltung unter /leitung. Keine vorgegebenen Passwörter und keine öffentliche Registrierung.
