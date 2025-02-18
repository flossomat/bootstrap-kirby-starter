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

1. PHP 8.0+ (https://www.php.net/downloads)
2. Composer:
   ```bash
   # macOS mit Homebrew:
   brew install composer

   # Windows:
   # Installer von https://getcomposer.org/download/ herunterladen
   ```
3. Node.js & npm (https://nodejs.org/)

## Installation

1. Voraussetzungen prüfen:
```bash
php -v        # Sollte PHP 8.0 oder höher anzeigen
composer -V   # Sollte Composer Version anzeigen
node -v       # Sollte Node.js Version anzeigen
npm -v        # Sollte npm Version anzeigen
```

# Falls Composer nicht gefunden wird:
# macOS/Linux:
export PATH="$HOME/.composer/vendor/bin:$PATH"
# oder
export PATH="/usr/local/bin:$PATH"

2. Kirby Plainkit klonen:
```bash
git clone https://github.com/getkirby/plainkit mein-projekt
cd mein-projekt
```

3. Bootstrap Starter hinzufügen:
```bash
git remote add bootstrap https://github.com/flossomat/bootstrap-kirby-starter.git
git pull bootstrap main --allow-unrelated-histories
```

4. Projekt aufsetzen:
```bash
composer install    # Installiert Kirby CMS
npm run setup      # Installiert npm Abhängigkeiten und initialisiert das Projekt
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