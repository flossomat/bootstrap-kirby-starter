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

### Automatische Installation

```bash
# 1. Neues Projektverzeichnis erstellen
mkdir mein-projekt
cd mein-projekt

# 2. Installations-Skript herunterladen und ausführen
curl -o- https://raw.githubusercontent.com/flossomat/bootstrap-kirby-starter/main/install.sh | bash
```

### Manuelle Installation

Falls Sie die Installation lieber manuell durchführen möchten:

1. Kirby Plainkit klonen:
```bash
git clone https://github.com/getkirby/plainkit.git mein-projekt
cd mein-projekt
```

2. Bootstrap Starter hinzufügen:
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

### Deployment

#### FTP-Konfiguration
1. Die .env.example wurde bei der Installation bereits als .env kopiert.
   Falls nicht, können Sie sie manuell kopieren:
```bash
cp .env.example .env
```

2. Passen Sie die FTP-Zugangsdaten in `.env` an:
```env
FTP_HOST=ftp.example.com
FTP_USER=username
FTP_PASSWORD=password
```
#### Upload-Befehle
- `gulp deploy-dry`: Testet das Deployment (zeigt zu aktualisierende Dateien)
- `gulp deploy`: Lädt Dateien auf den Server
- `gulp production`: Baut Assets und führt Deployment durch

#### Content-Synchronisation
- `gulp download-content-dry`: Zeigt zu aktualisierende Content-Dateien
- `gulp download-content`: Lädt Content-Ordner vom Server

## Lizenz

MIT License
