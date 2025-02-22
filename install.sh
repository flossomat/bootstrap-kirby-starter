#!/bin/bash

# Farben für die Ausgabe
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funktion zum Anzeigen von Fortschritt
echo_step() {
    echo -e "${BLUE}→ $1${NC}"
}

echo_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# 1. Kirby Plainkit klonen
echo_step "Klone Kirby Plainkit..."
git clone https://github.com/getkirby/plainkit.git .

# 2. Bootstrap Starter temporär klonen
echo_step "Klone Bootstrap Starter..."
git clone https://github.com/flossomat/bootstrap-kirby-starter.git bootstrap-temp

# 3. Dateien kopieren
echo_step "Kopiere Dateien..."
cp -r bootstrap-temp/assets ./
cp bootstrap-temp/gulpfile.js ./
cp bootstrap-temp/package.json ./
cp bootstrap-temp/composer.json ./
cp bootstrap-temp/.env.example ./
cp bootstrap-temp/.gitignore ./

# 4. Back-to-Top Plugin installieren
echo_step "Installiere Back-to-Top Plugin..."
mkdir -p site/plugins
curl -L https://github.com/flossomat/kirby-backtotop/archive/main.zip -o backtotop.zip
unzip backtotop.zip -d site/plugins/
mv site/plugins/kirby-backtotop-main site/plugins/kirby-backtotop
rm backtotop.zip

# 5. Aufräumen
echo_step "Räume auf..."
rm -rf bootstrap-temp

# 6. Umgebungsvariablen einrichten
echo_step "Erstelle .env aus .env.example..."
cp .env.example .env

# Projektname aus aktuellem Verzeichnis ermitteln
PROJECT_NAME=$(basename "$PWD")
echo_step "Erkannter Projektname: $PROJECT_NAME"

# Optional: LOCAL_URL in .env setzen wenn gewünscht
# sed -i '' "s|LOCAL_URL=|LOCAL_URL=http://localhost/${PROJECT_NAME}|" .env

# 7. Abhängigkeiten installieren
echo_step "Installiere Abhängigkeiten..."
composer install
npm install

# 8. Projekt initialisieren
echo_step "Initialisiere Projekt..."
npm run setup

echo_success "Installation abgeschlossen!"
echo_success "Back-to-Top Button ist installiert. Fügen Sie <?php snippet('backtotop') ?> in Ihr Template ein."
echo_success "Passe die Umgebungsvariablen in .env an und starte dann den Entwicklungsserver mit: npm start" 