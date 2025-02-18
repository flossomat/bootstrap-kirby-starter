"use strict";
var gulp = require('gulp'),
    sass = require('gulp-sass')(require('sass')),
    autoprefixer = require('gulp-autoprefixer'),
    newer = require('gulp-newer'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch');

/**
 * Gulp-Konfiguration für das formt Website-Projekt
 * Verarbeitet SCSS zu CSS, optimiert Assets und ermöglicht FTP-Deployment
 */

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "localhost:8888/bootstrap-kirby-starter/",
        port: 8888,
        open: true,
        notify: false
    });
});

gulp.task('sass', function () {
    return gulp.src([
        'assets/sass/**/*.scss'
    ])
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({ Browserslist: ['last 2 versions'], cascade: false }))
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./assets/css/'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function() {
    var cssFiles = ['assets/sass/*.scss'];
    gulp.watch(cssFiles, gulp.parallel('sass'))
    .on('change', browserSync.reload);

    // Watch .php files
    var watcher3 = gulp.watch('site/**/*.php');
    watcher3.on('change', browserSync.reload);
});

var jsInput = { js: 'assets/js/dev/**/*.js' }
gulp.task('js', function() {
    return gulp.src([
        'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
        'node_modules/@popperjs/core/dist/umd/popper.min.js',
        'assets/js/dev/**/*.js'
    ])
    .pipe(uglify())
    .pipe(concat('script.js'))
    .pipe(gulp.dest('./assets/js'));
});

// Neuer Build-Task für Produktion
gulp.task('build', () => {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(gulp.dest('assets/css'));
});

// Cache Clean Task
gulp.task('clean-cache', (done) => {
    console.log('\nCleaning cache...');
    rimraf('site/cache/*')  // Nur Inhalt löschen, nicht den Ordner selbst
        .then(() => {
            // Index.html erstellen um Ordner in Git zu behalten
            if (!require('fs').existsSync('site/cache/index.html')) {
                require('fs').writeFileSync('site/cache/index.html', '');
            }
            console.log('Cache cleaned!');
            done();
        })
        .catch(error => {
            console.error('Error cleaning cache:', error);
            done(error);
        });
});

// Verbesserte Hilfsfunktion für den Dateivergleich
async function getFileHash(filePath) {
    const crypto = require('crypto');
    const fs = require('fs');
    const path = require('path');

    if (!filePath) {
        console.warn('Kein Dateipfad angegeben');
        return null;
    }

    // Stelle sicher, dass wir einen absoluten Pfad haben
    const absolutePath = path.isAbsolute(filePath) 
        ? filePath 
        : path.join(process.cwd(), filePath.startsWith('/') ? filePath.slice(1) : filePath);

    // Prüfe ob die Datei existiert
    if (!fs.existsSync(absolutePath)) {
        console.warn(`Warnung: Datei nicht gefunden: ${absolutePath}`);
        return null;
    }

    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('md5');
        const stream = fs.createReadStream(absolutePath);
        
        stream.on('error', err => reject(err));
        stream.on('data', chunk => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
    });
}

// Deploy Task
gulp.task('deploy', async (done) => {
    const path = require('path');
    const fs = require('fs');
    const ftp = require('basic-ftp');
    
    const client = new ftp.Client();
    client.ftp.verbose = false;

    try {
        console.log('\nStarting deployment...');
        console.log('----------------------------------------');

        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            secure: true,
            port: 22
        });

        // Funktion zum rekursiven Upload von Dateien
        async function uploadDirectory(localDir, remoteDir) {
            const files = fs.readdirSync(localDir);
            let uploadCount = 0;
            let totalFiles = 0;

            for (const file of files) {
                const localPath = path.join(localDir, file);
                const remotePath = path.join(remoteDir, file).replace(/\\/g, '/');
                
                // Prüfe ob der Pfad in den Ausschlüssen ist
                if (shouldExclude(localPath)) continue;

                if (fs.statSync(localPath).isDirectory()) {
                    // Erstelle Remote-Verzeichnis falls nicht vorhanden
                    try {
                        await client.ensureDir(remotePath);
                        const result = await uploadDirectory(localPath, remotePath);
                        uploadCount += result.uploaded;
                        totalFiles += result.total;
                    } catch (err) {
                        console.error(`Fehler beim Verarbeiten von Verzeichnis ${remotePath}:`, err);
                    }
                } else {
                    totalFiles++;
                    try {
                        // Prüfe ob die Datei aktualisiert werden muss
                        const needsUpdate = await shouldUploadFile(localPath, remotePath, client);
                        if (needsUpdate) {
                            console.log(`Uploading: ${remotePath}`);
                            await client.uploadFrom(localPath, remotePath);
                            uploadCount++;
                        }
                    } catch (err) {
                        console.error(`Fehler beim Upload von ${remotePath}:`, err);
                    }
                }
            }
            return { uploaded: uploadCount, total: totalFiles };
        }

        // Hilfsfunktion zur Prüfung ob eine Datei ausgeschlossen werden soll
        function shouldExclude(filePath) {
            const excludePatterns = [
                'node_modules', 'src', 'matomo', 'media', 'content',
                'site/cache', '.git', '.env', 'package.json',
                'package-lock.json', 'gulpfile.js', '.gitignore', 'README.md'
            ];
            return excludePatterns.some(pattern => filePath.includes(pattern));
        }

        // Hilfsfunktion zur Prüfung ob eine Datei aktualisiert werden muss
        async function shouldUploadFile(localPath, remotePath, client) {
            try {
                const localStat = fs.statSync(localPath);
                const remoteSize = await client.size(remotePath).catch(() => -1);
                
                // Wenn Remote-Datei nicht existiert oder Größe unterschiedlich
                if (remoteSize === -1 || remoteSize !== localStat.size) {
                    return true;
                }
                return false;
            } catch (err) {
                // Bei Fehler lieber uploaden
                return true;
            }
        }

        const result = await uploadDirectory(__dirname, '/html');
        
        console.log('----------------------------------------');
        console.log(`Deployment completed!`);
        console.log(`Geprüfte Dateien: ${result.total}`);
        console.log(`Hochgeladene Dateien: ${result.uploaded}`);

    } catch (err) {
        console.error('Deploy error:', err);
    } finally {
        client.close();
        done();
    }
});

// Deploy Dry Run
gulp.task('deploy-dry', async (done) => {
    const path = require('path');
    const fs = require('fs');
    const ftp = require('basic-ftp');
    
    const client = new ftp.Client();
    client.ftp.verbose = false;

    try {
        console.log('\nPrüfe auf zu aktualisierende Dateien...');
        console.log('----------------------------------------');

        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            secure: true,
            port: 22
        });

        // Funktion zum rekursiven Prüfen von Dateien
        async function checkDirectory(localDir, remoteDir) {
            const files = fs.readdirSync(localDir);
            let updateCount = 0;
            let totalFiles = 0;

            for (const file of files) {
                const localPath = path.join(localDir, file);
                const remotePath = path.join(remoteDir, file).replace(/\\/g, '/');
                
                // Prüfe ob der Pfad in den Ausschlüssen ist
                if (shouldExclude(localPath)) continue;

                if (fs.statSync(localPath).isDirectory()) {
                    try {
                        const result = await checkDirectory(localPath, remotePath);
                        updateCount += result.toUpdate;
                        totalFiles += result.total;
                    } catch (err) {
                        console.error(`Fehler beim Prüfen von Verzeichnis ${remotePath}:`, err);
                    }
                } else {
                    totalFiles++;
                    try {
                        // Prüfe ob die Datei aktualisiert werden müsste
                        const needsUpdate = await shouldUploadFile(localPath, remotePath, client);
                        if (needsUpdate) {
                            updateCount++;
                            console.log(`→ ${updateCount}: ${remotePath} (würde aktualisiert)`);
                        }
                    } catch (err) {
                        console.error(`Fehler beim Prüfen von ${remotePath}:`, err);
                    }
                }
            }
            return { toUpdate: updateCount, total: totalFiles };
        }

        // Hilfsfunktion zur Prüfung ob eine Datei ausgeschlossen werden soll
        function shouldExclude(filePath) {
            const excludePatterns = [
                'node_modules', 'src', 'matomo', 'media', 'content',
                'site/cache', '.git', '.env', 'package.json',
                'package-lock.json', 'gulpfile.js', '.gitignore', 'README.md'
            ];
            return excludePatterns.some(pattern => filePath.includes(pattern));
        }

        // Hilfsfunktion zur Prüfung ob eine Datei aktualisiert werden muss
        async function shouldUploadFile(localPath, remotePath, client) {
            try {
                const localStat = fs.statSync(localPath);
                const remoteSize = await client.size(remotePath).catch(() => -1);
                
                // Wenn Remote-Datei nicht existiert oder Größe unterschiedlich
                if (remoteSize === -1 || remoteSize !== localStat.size) {
                    return true;
                }
                return false;
            } catch (err) {
                // Bei Fehler lieber als Update markieren
                return true;
            }
        }

        const result = await checkDirectory(__dirname, '/html');
        
        console.log('----------------------------------------');
        if (result.toUpdate === 0) {
            console.log('Keine Dateien müssen aktualisiert werden.');
        } else {
            console.log(`${result.toUpdate} von ${result.total} Dateien würden aktualisiert werden.`);
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        client.close();
        done();
    }
});

// Production Task
gulp.task('production', gulp.series('build', (done) => {
    var FtpDeploy = require('ftp-deploy');
    var ftpDeploy = new FtpDeploy();
    
    var config = {
        host: process.env.FTP_HOST,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASSWORD,
        port: 22,
        localRoot: __dirname,
        remoteRoot: '/html',
        include: [
            'assets/**',
            'site/**'
        ],
        exclude: [
            'site/cache/**',
            'site/accounts/**',
            'site/sessions/**'
        ],
        sftp: true,
        timeout: 30000,
        parallel: 4,
        maxConnections: 2
    };

    var uploadCount = 0;

    ftpDeploy.on('uploading', function(data) {
        uploadCount++;
        console.log(`Uploading (${uploadCount}): ${data.filename}`);
    });

    console.log('\nStarting deployment...');
    console.log('----------------------------------------');

    ftpDeploy.deploy(config)
        .then(res => {
            console.log('----------------------------------------');
            console.log(`Deployment completed! Uploaded: ${uploadCount} files`);
            done();
        })
        .catch(err => {
            console.error('Fehler:', err);
            done(err);
        });
}));

// Download Content Dry Run Task
gulp.task('download-content-dry', async (done) => {
    const client = new ftp.Client(60000);
    client.ftp.verbose = false;
    const fs = require('fs');
    const path = require('path');

    try {
        console.log('\nPrüfe auf neue oder geänderte Content-Dateien...');
        console.log('----------------------------------------');

        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            secure: false,
            port: 21,
            timeout: 60000,
            retries: 3
        });

        async function checkDirectory(remotePath, localBasePath = 'content') {
            const list = await client.list(remotePath);
            let updateNeeded = 0;
            let newFiles = 0;
            
            for (const item of list) {
                const localPath = path.join(localBasePath, item.name);
                const remoteFull = `${remotePath}/${item.name}`;
                
                if (item.type === 2) { // Ordner
                    if (!fs.existsSync(localPath)) {
                        console.log(`📁 ${item.name} (Neuer Ordner)`);
                        newFiles++;
                    }
                    // Rekursiv den Ordnerinhalt prüfen
                    const subResults = await checkDirectory(remoteFull, localPath);
                    newFiles += subResults.newFiles;
                    updateNeeded += subResults.updateNeeded;
                } else { // Datei
                    if (!fs.existsSync(localPath)) {
                        console.log(`📄 ${remoteFull.replace('/html/content/', '')} (Neu)`);
                        newFiles++;
                    } else {
                        const localStat = fs.statSync(localPath);
                        if (item.size !== localStat.size || 
                            new Date(item.modifiedAt) > new Date(localStat.mtime)) {
                            console.log(`📄 ${remoteFull.replace('/html/content/', '')} (Geändert)`);
                            updateNeeded++;
                        }
                    }
                }
            }
            return { newFiles, updateNeeded };
        }

        const results = await checkDirectory('/html/content');

        console.log('----------------------------------------');
        if (results.newFiles === 0 && results.updateNeeded === 0) {
            console.log('Alle Dateien sind aktuell.');
        } else {
            console.log(`Zusammenfassung:`);
            if (results.newFiles > 0) console.log(`- ${results.newFiles} neue Dateien/Ordner`);
            if (results.updateNeeded > 0) console.log(`- ${results.updateNeeded} geänderte Dateien`);
        }

        done();
    }
    catch(err) {
        console.error('Error:', err);
        done(err);
    }
    finally {
        client.close();
    }
});

// Download Content Task
gulp.task('download-content', async (done) => {
    const client = new ftp.Client(60000);
    client.ftp.verbose = false;
    const fs = require('fs');
    const path = require('path');

    try {
        console.log('\nStarte Content-Download...');
        console.log('----------------------------------------');

        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            secure: false,
            port: 21,
            timeout: 60000,
            retries: 3
        });

        async function checkAndDownloadDirectory(remotePath, localBasePath = 'content') {
            const list = await client.list(remotePath);
            let updateNeeded = 0;
            let newFiles = 0;
            
            if (!fs.existsSync(localBasePath)) {
                fs.mkdirSync(localBasePath, { recursive: true });
            }
            
            for (const item of list) {
                const localPath = path.join(localBasePath, item.name);
                const remoteFull = `${remotePath}/${item.name}`;
                
                if (item.type === 2) { // Ordner
                    if (!fs.existsSync(localPath)) {
                        console.log(`📁 ${item.name} (Erstelle Ordner)`);
                        fs.mkdirSync(localPath, { recursive: true });
                        newFiles++;
                    }
                    const subResults = await checkAndDownloadDirectory(remoteFull, localPath);
                    newFiles += subResults.newFiles;
                    updateNeeded += subResults.updateNeeded;
                } else { // Datei
                    let needsDownload = false;
                    
                    if (!fs.existsSync(localPath)) {
                        console.log(`📄 ${remoteFull.replace('/html/content/', '')} (Neu)`);
                        needsDownload = true;
                        newFiles++;
                    } else {
                        const localStat = fs.statSync(localPath);
                        if (item.size !== localStat.size || 
                            new Date(item.modifiedAt) > new Date(localStat.mtime)) {
                            console.log(`📄 ${remoteFull.replace('/html/content/', '')} (Aktualisiere)`);
                            needsDownload = true;
                            updateNeeded++;
                        }
                    }
                    
                    if (needsDownload) {
                        await client.downloadTo(localPath, remoteFull);
                    }
                }
            }
            return { newFiles, updateNeeded };
        }

        const results = await checkAndDownloadDirectory('/html/content');

        console.log('----------------------------------------');
        if (results.newFiles === 0 && results.updateNeeded === 0) {
            console.log('Alle Dateien sind bereits aktuell.');
        } else {
            console.log('Download abgeschlossen!');
            if (results.newFiles > 0) console.log(`- ${results.newFiles} neue Dateien/Ordner`);
            if (results.updateNeeded > 0) console.log(`- ${results.updateNeeded} aktualisierte Dateien`);
        }

        done();
    }
    catch(err) {
        console.error('Download error:', err);
        done(err);
    }
    finally {
        client.close();
    }
});

// Initialisierungs-Task hinzufügen
gulp.task('init', gulp.series((done) => {
    console.log('Initialisiere Projekt-Struktur...');
    
    // Erstelle Verzeichnisstruktur
    const dirs = [
        'assets/css',
        'assets/fonts',
        'assets/images/originals',
        'assets/js/dev',
        'assets/sass',
        'content',
        'site/blueprints',
        'site/snippets',
        'site/templates'
    ];

    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Verzeichnis erstellt: ${dir}`);
        }
    });

    // Erstelle initial SASS-Dateien
    const sassFiles = {
        '_variables.scss': '$primary: #007bff;\n$enable-rounded: true;',
        '_custom.scss': '// Benutzerdefinierte Stile hier',
        'main.scss': '@import "variables";\n@import "../../node_modules/bootstrap/scss/bootstrap";\n@import "custom";'
    };

    Object.entries(sassFiles).forEach(([file, content]) => {
        const filePath = `assets/sass/${file}`;
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, content);
            console.log(`SASS-Datei erstellt: ${file}`);
        }
    });

    done();
}));

// default task
gulp.task('default', gulp.series(gulp.parallel('sass', 'browser-sync', 'watch', 'js')));


/**
 * Verfügbare Gulp Tasks
 * ====================
 * 
 * Entwicklung:
 * - gulp              : Startet den Entwicklungsmodus mit Browser-Sync und Watch
 * - gulp sass         : Kompiliert SCSS zu CSS
 * - gulp build        : Erstellt optimierte Assets für Produktion
 * 
 * Deployment:
 * - gulp production   : Baut Assets, löscht Cache und lädt Dateien auf Server
 * - gulp production-dry : Zeigt, welche Dateien hochgeladen würden
 * - gulp deploy       : Lädt Dateien auf Server (ohne Build)
 * - gulp deploy-dry   : Zeigt, welche Dateien hochgeladen würden
 * - gulp clean-cache  : Löscht den lokalen Cache
 * 
 * Content Management:
 * - gulp download-content     : Lädt Content-Ordner vom Server herunter
 * - gulp download-content-dry : Zeigt, welche Content-Dateien heruntergeladen würden
 * 
 * Verwendung:
 * 1. Entwicklung: 
 *    - `gulp` für lokale Entwicklung
 * 
 * 2. Deployment:
 *    - `gulp production-dry` zum Testen
 *    - `gulp production` für tatsächliches Deployment
 * 
 * 3. Content Sync:
 *    - `gulp download-content-dry` zum Testen
 *    - `gulp download-content` für tatsächlichen Download
 * 
 * 4. FTP-Deployment:
 *    - `gulp deploy-dry` zum Testen
 *    - `gulp deploy` für tatsächliches Deployment
 */
