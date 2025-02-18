# Bootstrap Kirby Starter

Ein Entwicklungstemplate für Kirby CMS mit Bootstrap 5 und Gulp.

## Features
- Bootstrap 5
- Kirby CMS Ready
- SASS/SCSS Kompilierung
- JavaScript Optimierung
- Browser-Sync
- Live Reload
- Back to Top Button

## Voraussetzungen

1. PHP 8.1-8.3 (https://www.php.net/downloads)
2. Node.js & npm (https://nodejs.org/)

## Installation

1. Voraussetzungen prüfen:
```bash
php -v        # Sollte PHP 8.1-8.3 anzeigen
node -v       # Sollte Node.js Version anzeigen
npm -v        # Sollte npm Version anzeigen
```

2. Kirby Plainkit klonen:
```bash
git clone https://github.com/getkirby/plainkit.git mein-projekt
cd mein-projekt
```

3. Bootstrap Starter hinzufügen:
```bash
# Bootstrap Starter temporär klonen
git clone https://github.com/flossomat/bootstrap-kirby-starter.git bootstrap-temp
# Bootstrap-spezifische Dateien kopieren
cp -r bootstrap-temp/assets ./
cp bootstrap-temp/gulpfile.js ./
cp bootstrap-temp/package.json ./
cp bootstrap-temp/.env.example ./
# Aufräumen
rm -rf bootstrap-temp
```

4. Projekt aufsetzen:
```bash
npm install     # Node-Abhängigkeiten installieren
npm run setup   # Projekt initialisieren
```

## Verzeichnisstruktur

```
projekt/
├── assets/
│   ├── css/          # Kompilierte CSS-Dateien
│   ├── fonts/        # Schriftarten
│   ├── images/       # Optimierte Bilder
│   ├── js/          # JavaScript-Dateien
│   └── sass/        # SCSS-Quelldateien
├── content/         # Kirby Inhalte
├── kirby/          # Kirby Core
└── site/           # Kirby System
    ├── blueprints/ # Kirby Blueprints
    ├── snippets/   # Kirby Snippets
    └── templates/  # Kirby Templates
```

## Entwicklung

### Assets

Das Projekt nutzt Bootstrap 5 und Gulp für Asset-Management:

- SASS/SCSS wird zu CSS kompiliert
- JavaScript wird optimiert
- Bilder werden automatisch optimiert
- Browser-Sync für Live-Reload
- FTP-Deployment für einfaches Hochladen

### Befehle

- `npm start`: Startet den Entwicklungsserver mit Browser-Sync
- `npm run build`: Erstellt optimierte Assets für Produktion
- `gulp deploy-dry`: Testet das FTP-Deployment
- `gulp deploy`: Lädt Dateien auf den Server
- `gulp clean-cache`: Löscht den Kirby-Cache

### SASS-Struktur

```
assets/sass/
├── main.scss         # Haupt-SCSS-Datei
├── _bootstrap.scss   # Bootstrap-Konfiguration
├── _variables.scss   # Projekt-Variablen
└── _custom.scss      # Benutzerdefinierte Stile
```

### FTP-Deployment

1. `.env.example` zu `.env` kopieren
2. FTP-Zugangsdaten in `.env` eintragen
3. `gulp deploy-dry` zum Testen
4. `gulp deploy` für tatsächliches Deployment

## Weitere Informationen

[... Rest der Dokumentation ...]