# Bootstrap Kirby Starter

Ein Entwicklungstemplate für Kirby CMS mit Bootstrap 5 und Gulp.

## Features
- Bootstrap 5
- Kirby CMS Ready
- SASS/SCSS Kompilierung
- JavaScript Optimierung
- Bildoptimierung
- Browser-Sync
- FTP Deployment
- Back to Top Button

## Voraussetzungen

- PHP 8.0+
- Composer
- Node.js & npm

## Installation

1. Repository klonen:
```bash
git clone https://github.com/flossomat/bootstrap-kirby-starter.git mein-projekt
cd mein-projekt
```

2. Git neu initialisieren (optional):
```bash
rm -rf .git
git init
git add .
git commit -m "Initial commit"
```

3. Projekt aufsetzen:
```bash
composer install  # Installiert Kirby CMS
npm run setup    # Installiert npm Abhängigkeiten und initialisiert das Projekt
```

4. FTP-Konfiguration (optional):
```bash
cp .env.example .env
# .env Datei mit FTP-Daten bearbeiten
```

5. Entwicklungsserver starten:
```bash
npm start
```

## Verzeichnisstruktur

```
bootstrap-kirby-starter/
├── assets/
│   ├── css/          # Kompilierte CSS-Dateien
│   ├── fonts/        # Schriftarten
│   ├── images/       # Optimierte Bilder
│   ├── js/          # JavaScript-Dateien
│   └── sass/        # SCSS-Quelldateien
├── content/         # Kirby Inhalte
└── site/           # Kirby System
    ├── blueprints/ # Kirby Blueprints
    ├── snippets/   # Kirby Snippets
    └── templates/  # Kirby Templates
```

## Entwicklung

- `npm start`: Startet den Entwicklungsserver
- `npm run build`: Erstellt optimierte Assets
- `gulp deploy-dry`: Testet das Deployment
- `gulp deploy`: Lädt Dateien auf den Server
- `gulp clean-cache`: Löscht den Kirby-Cache