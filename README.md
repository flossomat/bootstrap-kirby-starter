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

### Verfügbare Befehle

#### NPM
- `npm run setup`: Initialisiert das Projekt (Installation & Grundstruktur)
- `npm start`: Startet den Entwicklungsserver mit Live-Reload
- `npm run build`: Erstellt optimierte Assets für Produktion

#### Gulp
- `gulp`: Startet Entwicklungsmodus (Browser-Sync, Watch, Kompilierung)
- `gulp sass`: Kompiliert SCSS zu CSS
- `gulp js`: Kompiliert JavaScript-Dateien
- `gulp build`: Erstellt optimierte Assets
- `gulp init`: Initialisiert die Projektstruktur

### Entwicklungsserver

Der Entwicklungsserver wird automatisch gestartet und bietet:
- Live Reload bei Änderungen
- SASS-Kompilierung
- JavaScript-Optimierung
- Browser-Synchronisation

### Assets Build

Der Build-Prozess optimiert:
- SCSS wird zu CSS kompiliert und minimiert
- JavaScript wird zusammengefasst und minimiert
- Sourcemaps werden für Debugging generiert

## Lizenz

MIT License