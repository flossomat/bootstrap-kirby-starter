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

1. PHP 8.1-8.3 (https://www.php.net/downloads)
2. Node.js & npm (https://nodejs.org/)

## Installation

1. Voraussetzungen prüfen:
```bash
php -v        # Sollte PHP 8.1-8.3 anzeigen
node -v       # Sollte Node.js Version anzeigen
npm -v        # Sollte npm Version anzeigen
```

2. Kirby als Git-Submodule installieren:
```bash
# Kirby Starterkit klonen
git clone https://github.com/getkirby/starterkit.git mein-projekt
cd mein-projekt

# Kirby als Submodule einrichten
rm -R kirby
git add kirby
git submodule add https://github.com/getkirby/kirby.git kirby
git commit -m "Setup Kirby as a submodule"
```

3. Bootstrap Starter hinzufügen:
```bash
git remote add bootstrap https://github.com/flossomat/bootstrap-kirby-starter.git
git config pull.rebase false  # Merge-Strategie festlegen
git pull bootstrap main --allow-unrelated-histories

# Bei Konflikten:
# 1. Konflikte in den Dateien lösen
# 2. Gelöste Dateien stagen
git add .
# 3. Merge abschließen
git commit -m "Merge bootstrap-kirby-starter into project"
```

4. Projekt aufsetzen:
```bash
npm install     # Node-Abhängigkeiten installieren
npm run setup   # Projekt initialisieren
```

5. FTP-Konfiguration (optional):
```bash
cp .env.example .env
# .env Datei mit FTP-Daten bearbeiten
```

6. Entwicklungsserver starten:
```bash
npm start
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
├── kirby/          # Kirby Core (Git Submodule)
└── site/           # Kirby System
    ├── blueprints/ # Kirby Blueprints
    ├── snippets/   # Kirby Snippets
    └── templates/  # Kirby Templates
```

## Assets und Entwicklung

Das Projekt nutzt Bootstrap 5 und Gulp für Asset-Management:

- SASS/SCSS Kompilierung
- JavaScript Optimierung
- Bildoptimierung
- Browser-Sync
- FTP Deployment

### Entwicklungsserver starten:
```bash
npm start
```

### Assets bauen:
```bash
npm run build
```

### Deployment:
```bash
gulp deploy-dry  # Test
gulp deploy      # Produktiv
```