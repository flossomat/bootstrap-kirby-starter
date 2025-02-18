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

## Weitere Informationen

[... Rest der Dokumentation ...]