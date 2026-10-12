# Kita-Konfiguration starten

## Einmalige Einrichtung
1. Änderungen aus diesem Pull Request übernehmen oder seinen Branch in Codespaces öffnen.
2. Im Terminal: `npm ci`.
3. Falls noch nicht vorhanden: `cp .env.example .env`.
4. `docker compose up -d` (lokale PostgreSQL-Datenbank).
5. `npx prisma migrate deploy` und `npm run db:generate`.
6. In der privaten Datei .env zusätzlich DIRECTOR_EMAIL, DIRECTOR_PASSWORD (mindestens 12 Zeichen) und KITA_NAME eintragen. Verwende deine selbst gewählten Zugangsdaten. Kein Passwort hier im Chat, in Screenshots oder in GitHub veröffentlichen.
7. `npm run setup:director` legt genau einen neuen Leitungszugang und eine Kita an. Vorhandene Konten werden nicht überschrieben. Die Meldung verrät keine Passwörter.
8. DIRECTOR_PASSWORD danach aus .env entfernen. Die .env-Datei ist durch .gitignore ausgeschlossen.
9. `npm run dev`. Codespaces: Port 3000 im Browser öffnen. Lokal: http://localhost:3000.

Falls Docker in der Umgebung fehlt, eine erreichbare PostgreSQL-Datenbank in DATABASE_URL hinterlegen. Der Login und die Verwaltung benötigen eine laufende, migrierte Datenbank.

## In der Oberfläche
Auf der Startseite „Kita konfigurieren“ wählen und anmelden.
- Kita-Namen speichern.
- Gruppen anlegen; geplante Plätze und übliches Personal sind optional.
- Personal mit optionaler Qualifikation und Gruppenzuordnung anlegen.
- Kinder einer bestehenden Gruppe zuordnen.
- Vorhandene Einträge aufklappen und bearbeiten.
- Bei mehreren Leitungsmitgliedschaften zwischen den eigenen Kitas wechseln.

Speichern ist nur für DIRECTOR-Mitgliedschaften der jeweiligen Kita möglich. Änderungen erzeugen einen Audit-Eintrag in derselben Datenbanktransaktion. Es gibt keine öffentliche Registrierung oder frei wählbare Leitungsrolle.

## Grenzen dieses Pakets
Keine Eltern-Einladungen, Dienstplanung, Archivierung/Löschung, Passwortzurücksetzung oder vollständiger Notfallworkflow. Die Übersicht zählt Stammdaten, keine aktuelle Anwesenheit. Geplante Plätze und Personalzahlen setzen keine fachlichen Grenzwerte. Die Ampel bleibt unkonfiguriert.

Sitzungen laufen nach 8 Stunden ab. Cookie: HttpOnly, SameSite=Lax, Secure in Produktion. Datenbank speichert nur den Hash des Sitzungstokens. Nach fünf falschen Passwortversuchen wird das Konto 15 Minuten gesperrt. Vor öffentlicher Bereitstellung sind zusätzliche netzwerkseitige Ratenbegrenzung, Backup-/Betriebskonzept und vollständige Browser-/PostgreSQL-Abnahme nötig.

