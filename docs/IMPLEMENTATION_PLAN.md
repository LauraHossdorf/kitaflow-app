# KitaFlow MVP – Implementierungsplan

## Paket 1: Fundament (dieser Pull Request)
Next.js App Router, TypeScript, Tailwind, PostgreSQL/Prisma, mobile Startansicht, Manifest, Rollenprüfungs-Hilfsfunktion und reine Berechnungsfunktion. Keine Anmeldung, CRUD-Endpunkte oder echten Personaldaten in diesem Paket. Manifest ist die PWA-Vorbereitung; Service Worker und vollständige Installierbarkeit folgen.

## Paket 2: Anmeldung und Mandanten
Serverseitig verifizierte Sitzungen, sichere Login-Lösung, Einladungen statt öffentlicher Rollenwahl. Mitgliedschaften je Kita: DIRECTOR, STAFF, PARENT. Jede Datenabfrage und Mutation prüft Kita-Zugehörigkeit; Eltern sehen nur zugeordnete Kinder. Abnahme: unauthentifiziert 401, falsche Kita/Rolle 403; Tests für objektbezogene Zugriffe.

## Paket 3: Stammdaten und Dashboard
Kita, Gruppen, Kinder, Elternzuordnungen, Personal, Qualifikationen und zeitbezogene Personalverfügbarkeit. Seiten: Login, Dashboard, Kita-Einstellungen, Gruppenliste/-detail, Kinderliste/-detail, Personal, Dienstübersicht. Validierte Formulare und API-Endpunkte /api/kitas, /api/groups, /api/children, /api/staff. Tagesansicht mit realen Anwesenheitsdaten; keine erfundenen Zähler.

## Paket 4: Versionierte Berechnung
Regelwerk-Liste, Editor, Freigabeansicht. Entwürfe erhalten keine fachlichen Vorgaben. Freigaben nur durch Leitung; freigegebene Versionen werden unveränderlich behandelt, Änderungen erzeugen neue Versionen. Evaluationen persistieren Eingabesnapshot, Regelversion, Engine-Version und Ergebnis. Ohne freigegebene Regeln: NOT_CONFIGURED, bei unvollständigen Daten: INSUFFICIENT_DATA. Die zunächst einfache Quotientenstrategie ist technisch austauschbar; Definition der qualifizierten Fachkraft und fachliche Grenzwerte müssen vor Freigabe entschieden werden.

## Paket 5: Notfallworkflow
Elternpräferenzen mit Zeiträumen, Ausnahmen und Gruppenbezug, konkrete Anfragen und Rückmeldungen, Leitungsplanung und Bestätigung, Verlauf. Endpunkte /api/preferences, /api/emergencies, /api/responses, /api/decisions. Leitungsentscheidung in Transaktion mit Kita-/Kinderzuordnung und Audit-Eintrag. Kein automatisches Ranking, keine automatische Auswahl oder Absage. Elternpräferenzen sind keine Leitungsentscheidung.

## Paket 6: PWA und Abnahme
Service Worker ausschließlich für öffentliche statische Inhalte; keine geschützten APIs, Sitzungen oder Personendaten im Cache. Installationsprüfung mit PNG-Icons, Offline-Hinweis, mobiles Formular- und Tastaturverhalten. Migrationen in PostgreSQL testen, Berechtigungs-/Workflowtests, Build, Sicherheitsprüfung vor echten Daten.

## Noch offene fachliche Fragen
Qualifikationsdefinition, Alters-/Gruppengewichtung, Bezugszeiträume, Datenqualität, Gültigkeitszeitraum freigegebener Regeln und verbindliche Ampelgrenzen. Keine voreingestellten Betreuungsgrenzen.

## GitHub
Arbeitsbranch codex/kitaflow-foundation → Pull Request nach develop → Prüfung und Merge. main bleibt für freigegebene Stände. Ein Merge ist keine Veröffentlichung.

