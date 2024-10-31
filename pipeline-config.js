module.exports = {
    sftpConfigFile: "../sftp-config.js",
    productionPath: "housebird_games/creations-manager",
    stagingPath: "housebird_games/creations-manager-staging",
    distPath: "Birdhouse/dist",
    htaccessFile: "UPLOAD-THIS.htaccess",
    basePath: "creations-manager",
    databaseDir: "database",
    uncompressedDir: "img/uploads-uncompressed",
    compressedDir: "uploads",
    faviconPath: "img/logos-originals/Creations Manager 512x512 2.png",
    faviconsOutputDir: "img/favicons",
    faviconsFileName: "Favicon",
    faviconSizes: [

    ],
    manifestIconPath: "img/logos-originals/Creations Manager 512x512 2.png",
    manifestIconOutputDir: "img/icons",
    manifestIconFileName: "Icon",
    manifestIconSizes: [

    ],
    statisticsFile: "pipeline-log.txt",
    ignoredFileTypes: [
        ".zip",
        ".rar",
        ".md",
        ".psd",
        ".htaccess"
    ],
    directoriesToInclude: [
        "src",
        "fonts",
        "img/favicons",
        "img/icons",
        "img/app-icons",
        "img/screenshots",
        "img/logos",
        "uploads",
        "data"
    ],
    directoriesToExcludeFromCache: [
        "img/screenshots",
        "uploads"
    ],
    preReleaseScripts: [

    ],
    postReleaseScripts: [

    ],
    appIconSourcePath: "img/logos-originals/Creations Manager 512x512 2.png",
    appIconOutputDir: "img/app-icons"
};