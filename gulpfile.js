/*jslint node, for, this */
/*globals async */

// This gulpfile processes:
// - images, optimising them for output formats
// - Javascript, optionally, minifying scripts for performance
// - HTML, rendering MathJax as MathML.
// It takes two arguments: --book and --language, e.g.:
// gulp --book samples --language fr

// Get Node modules
var gulp = require('gulp'),
    responsive = require('gulp-responsive-images'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    newer = require('gulp-newer'),
    gm = require('gulp-gm'),
    svgmin = require('gulp-svgmin'),
    args = require('yargs').argv,
    fileExists = require('file-exists'),
    mathjax = require('gulp-mathjax-page'),
    fs = require('fs'),
    yaml = require('js-yaml'),
    debug = require('gulp-debug'),
    del = require('del'),
    cheerio = require('gulp-cheerio'),
    tap = require('gulp-tap');
    iconv = require('iconv-lite');

// A function for loading book metadata as an object
function loadMetadata() {
    'use strict';

    var paths = [];
    var filePaths = [];
    var books = [];
    var languages = [];

    if (fileExists.sync('_data/meta.yml')) {

        var metadata = yaml.load(fs.readFileSync('_data/meta.yml', 'utf8'));
        var works = metadata.works;

        var i;
        var j;
        for (i = 0; i < works.length; i += 1) {
            books.push(works[i].directory);
            paths.push('_site/' + works[i].directory + '/text/');
            filePaths.push('_site/' + works[i].directory + '/text/*.html');
            if (works[i].translations) {
                for (j = 0; j < works[i].translations.length; j += 1) {
                    languages.push(works[i].translations[j].directory);
                    paths.push('_site/' + works[i].directory + '/' + works[i].translations[j].directory + '/text/');
                    filePaths.push('_site/' + works[i].directory + '/' + works[i].translations[j].directory + '/text/*.html');
                }
            }
        }
    }

    return {
        books: books,
        languages: languages,
        paths: paths,
        filePaths: filePaths
    };
}

// Load image settings if they exist
var imageSettings = [];
if (fs.existsSync('_data/images.yml')) {
    imageSettings = yaml.load(fs.readFileSync('_data/images.yml', 'utf8'));

    // If the file is empty, imageSettings will be null.
    // So we check for that and, if null, we create an array.
    if (!imageSettings) {
        imageSettings = [];
    }
}

// Get the book we're processing
var book = 'book';
if (args.book && args.book.trim !== '') {
    book = args.book;
}

// let '--folder' be an alias for '--book',
// to make sense for gulping 'assets' and '_items'
if (args.folder && args.folder.trim !== '') {
    book = args.folder;
}

// Reminder on usage
if (book === 'book') {
    console.log('If processing images for a book that\'s not in the /book directory, use the --book argument, e.g. gulp --book potatoes');
    console.log('To process images in _items, use gulp --book _items');
}

// Get the language we're processing
var language = '';
if (args.language && args.language.trim !== '') {
    language = '/' + args.language;
}

// Reminder on usage
if (language === '') {
    console.log('If processing a translation\'s images, use the --language argument, e.g. gulp --language fr');
}

// Set up paths.
// Paths to text src must include the *.html extension.
// Add paths to any JS files to minify to the src array, e.g.
// src: ['assets/js/foo.js,assets/js/bar.js'],
var paths = {
    img: {
        source: book + language + '/images/_source/',
        printpdf: book + language + '/images/print-pdf/',
        web: book + language + '/images/web/',
        screenpdf: book + language + '/images/screen-pdf/',
        epub: book + language + '/images/epub/',
        app: book + language + '/images/app/'
    },
    text: {
        src: '_site/' + book + language + '/text/*.html',
        dest: '_site/' + book + language + '/text/'
    },
    epub: {
        src: '_site/epub' + language + '/text/*.html',
        dest: '_site/epub' + language + '/text/'
    },
    js: {
        src: [],
        dest: 'assets/js/'
    },
    yaml: {
        src: ['*.yml', '_configs/*.yml', '_data/*.yml']
    },
    // Arrays of globs to ignore from tasks
    ignore: {
        printpdf: ['**/favicon.*'],
        web: [],
        screenpdf: ['**/favicon.*'],
        epub: ['**/favicon.*'],
        app: ['**/favicon.*']
    }
};

// Set filetypes to convert, comma separated, no spaces
var filetypes = 'jpg,jpeg,gif,png,tif,tiff';

// Default color settings
var defaultColorProfile = 'sRGB_v4_ICC_preference_displayclass.icc';
var defaultColorSpace = 'rgb';
var defaultColorProfileGrayscale = 'Grey_Fogra39L.icc';
var defaultColorSpaceGrayscale = 'gray';
var defaultOutputFormat = 'web';

// Load image settings if they exist
var imageSettings = [];
if (fs.existsSync('_data/images.yml')) {
    imageSettings = yaml.load(fs.readFileSync('_data/images.yml', 'utf8'));

    // If the file is empty, imageSettings will be null.
    // So we check for that and, if null, we create an array.
    if (!imageSettings) {
        imageSettings = [];
    }
}

// Function for checking if an image should be processed
function modifyImageCheck(filename, format) {

    // Assume true
    var modifyImage = true;

    if (!format) {
        format = 'all';
    }

    if (imageSettings[book]) {
        imageSettings[book].forEach(function (image) {
            if (image.file === filename) {

                // User feedback for images not being modified
                var noModifyFeedback = filename + " not modified for " + format + " format(s), as specified in images.yml";

                // We use the same SVG for all output formats. So:
                // if this is an SVG, do *any* of the output formats
                // have 'modify' set to no? If so, do not modify it.
                if (filename.match(/[^\s]+\.svg$/gi)) {
                    var outputFormats = ['print-pdf', 'screen-pdf', 'web', 'epub', 'app', 'all'];
                    outputFormats.forEach(function (format) {
                        if (image[format] && image[format].modify && image[format].modify === 'no') {
                            console.log(noModifyFeedback);
                            modifyImage = false;
                        }
                    });
                }

                // If an image has a 'modify' setting for this or all formats...
                if (image.modify || (image[format] && image[format].modify)
                        || (image.all && image.all.modify)) {

                    // ... and it's set to no, do not modify.
                    if (image.modify === 'no' || (image[format] && image[format].modify === 'no')
                            || (image.all && image.all.modify === 'no')) {
                        console.log(noModifyFeedback);
                        modifyImage = false;
                    }
                }
            }
        });
    }

    return modifyImage;
}

// Function for getting a filename in gulp tap
function getFilenameFromPath(path) {
    'use strict';
    var filename = path.split('\/').pop(); // for unix slashes
    filename = filename.split('\\').pop(); // for windows backslashes
    return filename;
}

// Function for default gulp tap step
function getFileDetailsFromTap(file, format) {
    'use strict';

    if (!format) {
        format = 'all';
    }

    return {
        prefix: file.basename.replace('.', '').replace(' ', ''),
        filename: getFilenameFromPath(file.path),
        modifyImage: modifyImageCheck(filename, format)
    };
}

function lookupColorSettings(gmfile,
        colorProfile, colorSpace,
        colorProfileGrayscale, colorSpaceGrayscale,
        outputFormat) {
    'use strict';

    var filename = getFilenameFromPath(gmfile.source);

    // Look up image settings
    if (imageSettings[book]) {
        imageSettings[book].forEach(function (image) {
            if (image.file === filename || image.file == "all") {
                if (image[outputFormat] && image[outputFormat].colorspace === 'gray') {
                    colorProfile = colorProfileGrayscale;
                    colorSpace = colorSpaceGrayscale;
                }
            }
        });
    }

    return {
        colorSpace: colorSpace,
        colorProfile: colorProfile
    }
}

// Minify and clean SVGs and copy to destinations.
// For EpubCheck-safe SVGs, we remove data- attributes
// and don't strip defaults like <style "type=text/css">
gulp.task('images:svg', function (done) {
    'use strict';
    console.log('Processing SVG images from ' + paths.img.source);
    var prefix = '';
    gulp.src(paths.img.source + '*.svg')
        .pipe(debug({title: 'Processing SVG '}))
        .pipe(tap(function (file) {
            prefix = file.basename.replace('.', '').replace(' ', '');
        }))
        .pipe(svgmin(function getOptions() {
            return {
                plugins: [
                    {
                        // We definitely want a viewBox
                        removeViewBox: false
                    },
                    {
                        // With a viewBox, we can remove these
                        removeDimensions: true
                    },
                    {
                        // We can remove data- attributes
                        removeAttrs: {
                            attrs: 'data.*'
                        }
                    },
                    {
                        // Remove unknown elements, but not default values
                        removeUnknownsAndDefaults: {
                            defaultAttrs: false
                        }
                    },
                    {
                        // We want titles for accessibility
                        removeTitle: false
                    },
                    {
                        // We want descriptions for accessibility
                        removeDesc: false
                    },
                    {
                        // Default
                        convertStyleToAttrs: true
                    },
                    {
                        // Default
                        removeUselessStrokeAndFill: true
                    },
                    {
                        // Default
                        inlineStyles: true
                    },
                    {
                        // Default
                        cleanupAttrs: true
                    },
                    {
                        // Default
                        removeDoctype: true
                    },
                    {
                        // Default
                        removeXMLProcInst: true
                    },
                    {
                        // Default
                        removeComments: true
                    },
                    {
                        // Default
                        removeMetadata: true
                    },
                    {
                        // Default
                        removeUselessDefs: true
                    },
                    {
                        // Default
                        removeXMLNS: false
                    },
                    {
                        // Default
                        removeEditorsNSData: true
                    },
                    {
                        // Default
                        removeEmptyAttrs: true
                    },
                    {
                        // Default
                        removeHiddenElems: true
                    },
                    {
                        // Default
                        removeEmptyText: true
                    },
                    {
                        // Default
                        removeEmptyContainers: true
                    },
                    {
                        // Default
                        cleanupEnableBackground: true
                    },
                    {
                        // Default
                        minifyStyles: true
                    },
                    {
                        // Default
                        convertColors: true
                    },
                    {
                        // Default
                        convertPathData: true
                    },
                    {
                        // Default
                        convertTransform: true
                    },
                    {
                        // Default
                        removeNonInheritableGroupAttrs: true
                    },
                    {
                        // Default
                        removeUselessStrokeAndFill: true
                    },
                    {
                        // Default
                        removeUnusedNS: true
                    },
                    {
                        // Default
                        prefixIds: false
                    },
                    {
                        // Prefix and minify IDs
                        cleanupIDs: {
                            prefix: prefix + '-',
                            minify: true
                        }
                    },
                    {
                        // Default
                        cleanupNumericValues: true
                    },
                    {
                        // Default
                        cleanupListOfValues: true
                    },
                    {
                        // Default
                        moveElemsAttrsToGroup: true
                    },
                    {
                        // Default
                        collapseGroups: true
                    },
                    {
                        // Default
                        removeRasterImages: false
                    },
                    {
                        // Default
                        mergePaths: true
                    },
                    {
                        // Default
                        convertShapeToPath: false
                    },
                    {
                        // Default
                        convertEllipseToCircle: true
                    },
                    {
                        // Default
                        sortAttrs: false
                    },
                    {
                        // Default
                        sortDefsChildren: true
                    },
                    {
                        // Default
                        removeAttributesBySelector: false
                    },
                    {
                        // Default
                        removeElementsByAttr: false
                    },
                    {
                        // Default
                        addClassesToSVGElement: false
                    },
                    {
                        // Default
                        addAttributesToSVGElement: false
                    },
                    {
                        // Default
                        removeOffCanvasPaths: false
                    },
                    {
                        // Default
                        removeStyleElement: false
                    },
                    {
                        // Default
                        removeScriptElement: false
                    },
                    {
                        // Default
                        reusePaths: false
                    }
                ]
            };
        }).on('error', function (e) {
            console.log(e);
        }))
        .pipe(gulp.dest(paths.img.printpdf))
        .pipe(gulp.dest(paths.img.screenpdf))
        .pipe(gulp.dest(paths.img.web))
        .pipe(gulp.dest(paths.img.epub))
        .pipe(gulp.dest(paths.img.app));
    done();
});

// Convert source images for print-pdf
gulp.task('images:printpdf', function (done) {
    'use strict';

    // Options
    var outputFormat = 'print-pdf';
    var colorProfile = 'PSOcoated_v3.icc';
    var colorSpace = 'cmyk';
    var colorProfileGrayscale = defaultColorProfileGrayscale;
    var colorSpaceGrayscale = defaultColorSpaceGrayscale;

    console.log('Processing print-PDF images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/' + colorProfile)) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}',
                {ignore: paths.ignore.printpdf})
            .pipe(newer(paths.img.printpdf))
            .pipe(debug({title: 'Creating print-PDF version of '}))
            .pipe(gm(function (gmfile) {

                // Get file details
                var filename = getFilenameFromPath(gmfile.source);

                // Check if we should modify this image
                var modifyImage = modifyImageCheck(filename, outputFormat);

                // Reset defaults (in case previous image in stream
                // set these values to something else)
                var thisColorSpace = colorSpace;
                var thisColorProfile = colorProfile;

                // Override
                var colorSettings = lookupColorSettings(gmfile, colorProfile, colorSpace,
                        colorProfileGrayscale, colorSpaceGrayscale, outputFormat);
                thisColorSpace = colorSettings.colorSpace;
                thisColorProfile = colorSettings.colorProfile;

                if (modifyImage) {
                    return gmfile
                    .profile('_tools/profiles/' + thisColorProfile)
                    .colorspace(thisColorSpace);
                } else {
                    return gmfile
                    .define('jpeg:preserve-settings')
                    .compress('None')
                    .quality(100);
                }
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gulp.dest(paths.img.printpdf));
    } else {
        console.log('Colour profile _tools/profiles/' + colorProfile + ' not found. Exiting.');
        return;
    }
    done();
});

// Convert and optimise source images
// for screen-pdf, web, epub, and app
gulp.task('images:screenpdf', function (done) {
    'use strict';

    // Options
    var imagesOptimiseColorProfile = 'sRGB_v4_ICC_preference_displayclass.icc';
    var imagesOptimiseColorSpace = 'rgb';

    console.log('Processing screen-PDF images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/' + imagesOptimiseColorProfile)) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}',
                {ignore: paths.ignore.screenpdf})
            .pipe(newer(paths.img.screenpdf))
            .pipe(debug({title: 'Processing '}))
            .pipe(responsive({
                '*': [{
                    width: 810,
                    quality: 90,
                    upscale: false
                }]
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gm(function (gmfile) {
                return gmfile.profile('_tools/profiles/' + imagesOptimiseColorProfile).colorspace(imagesOptimiseColorSpace);
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gulp.dest(paths.img.screenpdf));
    } else {
        console.log('Colour profile _tools/profiles/' + imagesOptimiseColorProfile + ' not found. Exiting.');
        return;
    }
    done();
});

// Convert and optimise source images
// for screen-pdf, web, epub, and app
gulp.task('images:epub', function (done) {
    'use strict';

    // Options
    var imagesOptimiseColorProfile = 'sRGB_v4_ICC_preference_displayclass.icc';
    var imagesOptimiseColorSpace = 'rgb';

    console.log('Processing epub images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/' + imagesOptimiseColorProfile)) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}',
                {ignore: paths.ignore.epub})
            .pipe(newer(paths.img.epub))
            .pipe(debug({title: 'Processing '}))
            .pipe(responsive({
                '*': [{
                    width: 810,
                    quality: 90,
                    upscale: false
                }]
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gm(function (gmfile) {
                return gmfile.profile('_tools/profiles/' + imagesOptimiseColorProfile).colorspace(imagesOptimiseColorSpace);
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gulp.dest(paths.img.epub));
    } else {
        console.log('Colour profile _tools/profiles/' + imagesOptimiseColorProfile + ' not found. Exiting.');
        return;
    }
    done();
});

// Convert and optimise source images
// for screen-pdf, web, epub, and app
gulp.task('images:app', function (done) {
    'use strict';

    // Options
    var imagesOptimiseColorProfile = 'sRGB_v4_ICC_preference_displayclass.icc';
    var imagesOptimiseColorSpace = 'rgb';

    console.log('Processing app images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/' + imagesOptimiseColorProfile)) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}',
                {ignore: paths.ignore.app})
            .pipe(newer(paths.img.app))
            .pipe(debug({title: 'Processing '}))
            .pipe(responsive({
                '*': [{
                    width: 810,
                    quality: 90,
                    upscale: false
                }]
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gm(function (gmfile) {
                return gmfile.profile('_tools/profiles/' + imagesOptimiseColorProfile).colorspace(imagesOptimiseColorSpace);
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gulp.dest(paths.img.app));
    } else {
        console.log('Colour profile _tools/profiles/' + imagesOptimiseColorProfile + ' not found. Exiting.');
        return;
    }
    done();
});

// Convert and optimise source images
// for screen-pdf, web, epub, and app
gulp.task('images:web', function (done) {
    'use strict';

    // Options
    var imagesOptimiseColorProfile = 'sRGB_v4_ICC_preference_displayclass.icc';
    var imagesOptimiseColorSpace = 'rgb';

    console.log('Processing web images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/' + imagesOptimiseColorProfile)) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}',
                {ignore: paths.ignore.web})
            .pipe(newer(paths.img.web))
            .pipe(debug({title: 'Processing '}))
            .pipe(responsive({
                '*': [{
                    width: 810,
                    quality: 90,
                    upscale: false
                }]
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gm(function (gmfile) {
                return gmfile.profile('_tools/profiles/' + imagesOptimiseColorProfile).colorspace(imagesOptimiseColorSpace);
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gulp.dest(paths.img.web));
    } else {
        console.log('Colour profile _tools/profiles/' + imagesOptimiseColorProfile + ' not found. Exiting.');
        return;
    }
    done();
});

// Make small images for web use in srcset
gulp.task('images:small', function (done) {
    'use strict';

    // Options
    var imagesSmallColorProfile = 'sRGB_v4_ICC_preference_displayclass.icc';
    var imagesSmallColorSpace = 'rgb';

    console.log('Creating small web images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/' + imagesSmallColorProfile)) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}',
                {ignore: paths.ignore.web})
            .pipe(newer(paths.img.web))
            .pipe(debug({title: 'Creating small '}))
            .pipe(responsive({
                '*': [{
                    width: 320,
                    quality: 90,
                    upscale: false,
                    suffix: '-320'
                }]
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gm(function (gmfile) {
                return gmfile.profile('_tools/profiles/' + imagesSmallColorProfile).colorspace(imagesSmallColorSpace);
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gulp.dest(paths.img.web));
    } else {
        console.log('Colour profile _tools/profiles/' + imagesSmallColorProfile + ' not found. Exiting.');
        return;
    }
    done();
});

// Make medium images for web use in srcset
gulp.task('images:medium', function (done) {
    'use strict';

    // Options
    var imagesMediumColorProfile = 'sRGB_v4_ICC_preference_displayclass.icc';
    var imagesMediumColorSpace = 'rgb';

    console.log('Creating medium web images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/' + imagesMediumColorProfile)) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}',
                {ignore: paths.ignore.web})
            .pipe(newer(paths.img.web))
            .pipe(debug({title: 'Creating medium '}))
            .pipe(responsive({
                '*': [{
                    width: 640,
                    quality: 90,
                    upscale: false,
                    suffix: '-640'
                }]
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gm(function (gmfile) {
                return gmfile.profile('_tools/profiles/' + imagesMediumColorProfile).colorspace(imagesMediumColorSpace);
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gulp.dest(paths.img.web));
    } else {
        console.log('Colour profile _tools/profiles/' + imagesMediumColorProfile + ' not found. Exiting.');
        return;
    }
    done();
});

// Make large images for web use in srcset
gulp.task('images:large', function (done) {
    'use strict';

    // Options
    var imagesLargeColorProfile = 'sRGB_v4_ICC_preference_displayclass.icc';
    var imagesLargeColorSpace = 'rgb';

    console.log('Creating large web images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/' + imagesLargeColorProfile)) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}',
                {ignore: paths.ignore.web})
            .pipe(newer(paths.img.web))
            .pipe(debug({title: 'Creating large '}))
            .pipe(responsive({
                '*': [{
                    width: 1024,
                    quality: 90,
                    upscale: false,
                    suffix: '-1024'
                }]
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gm(function (gmfile) {
                return gmfile.profile('_tools/profiles/' + imagesLargeColorProfile).colorspace(imagesLargeColorSpace);
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gulp.dest(paths.img.web));
    } else {
        console.log('Colour profile _tools/profiles/' + imagesLargeColorProfile + ' not found. Exiting.');
        return;
    }
    done();
});

// Make extra-large images for web use in srcset
gulp.task('images:xlarge', function (done) {
    'use strict';

    // Options
    var imagesXLargeColorProfile = 'sRGB_v4_ICC_preference_displayclass.icc';
    var imagesXLargeColorSpace = 'rgb';

    console.log('Creating extra-large web images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/' + imagesXLargeColorProfile)) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}',
                {ignore: paths.ignore.web})
            .pipe(newer(paths.img.web))
            .pipe(debug({title: 'Creating extra-large '}))
            .pipe(responsive({
                '*': [{
                    width: 2048,
                    quality: 90,
                    upscale: false,
                    suffix: '-2048'
                }]
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gm(function (gmfile) {
                return gmfile.profile('_tools/profiles/' + imagesXLargeColorProfile).colorspace(imagesXLargeColorSpace);
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gulp.dest(paths.img.web));
    } else {
        console.log('Colour profile _tools/profiles/' + imagesXLargeColorProfile + ' not found. Exiting.');
        return;
    }
    done();
});

// Make full-quality images in RGB
gulp.task('images:max', function (done) {
    'use strict';

    // Options
    var imagesMaxColorProfile = 'sRGB_v4_ICC_preference_displayclass.icc';
    var imagesMaxColorSpace = 'rgb';

    console.log('Creating max-quality web images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/' + imagesMaxColorProfile)) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}',
                {ignore: paths.ignore.web})
            .pipe(newer(paths.img.web))
            .pipe(debug({title: 'Creating max-quality '}))
            .pipe(gm(function (gmfile) {
                return gmfile.quality(100).profile('_tools/profiles/' + imagesMaxColorProfile).colorspace(imagesMaxColorSpace);
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(rename({suffix: "-max"}))
            .pipe(gulp.dest(paths.img.web));
    } else {
        console.log('Colour profile _tools/profiles/' + imagesMaxColorProfile + ' not found. Exiting.');
        return;
    }
    done();
});

// Minify JS files to make them smaller,
// using the drop_console option to remove console logging
gulp.task('js', function (done) {
    'use strict';

    if (paths.js.src.length > 0) {
        console.log('Minifying Javascript');
        gulp.src(paths.js.src)
            .pipe(debug({title: 'Minifying '}))
            .pipe(uglify({compress: {drop_console: true}}).on('error', function (e) {
                console.log(e);
            }))
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(paths.js.dest));
        done();
    } else {
        console.log('No scripts in source list to minify.');
        done();
    }
});

// Process MathJax in output HTML

// Settings for mathjax-node-page. leave empty for defaults.
// https://www.npmjs.com/package/gulp-mathjax-page
var mjpageOptions = {
    mjpageConfig: {
        format: ["TeX"], // determines type of pre-processors to run
        output: 'svg', // global override for output option; 'svg', 'html' or 'mml'
        tex: {}, // configuration options for tex pre-processor, cf. lib/tex.js
        ascii: {}, // configuration options for ascii pre-processor, cf. lib/ascii.js
        singleDollars: false, // allow single-dollar delimiter for inline TeX
        fragment: false, // return body.innerHTML instead of full document
        cssInline: true,  // determines whether inline css should be added
        jsdom: {}, // jsdom-related options
        displayMessages: false, // determines whether Message.Set() calls are logged
        displayErrors: true, // determines whether error messages are shown on the console
        undefinedCharError: false, // determines whether unknown characters are saved in the error array
        extensions: '', // a convenience option to add MathJax extensions
        fontURL: '', // for webfont urls in the CSS for HTML output
        MathJax: {
            messageStyle: "none",
            SVG: {
                font: "Gyre-Pagella",
                matchFontHeight: false,
                blacker: 0,
                styles: {
                    ".MathJax [style*=border-top-width]": {
                        "border-top-width": "0.5pt ! important"
                    }
                }
            }
        } // options MathJax configuration, see https://docs.mathjax.org
    },
    mjnodeConfig: {
        ex: 6, // ex-size in pixels (ex is an x-height unit)
        width: 100, // width of math container (in ex) for linebreaking and tags
        useFontCache: true, // use <defs> and <use> in svg output?
        useGlobalCache: false, // use common <defs> for all equations?
        // state: mjstate, // track global state
        linebreaks: true, // do linebreaking?
        equationNumbers: "none", // or "AMS" or "all"
        math: "", // the math to typeset
        html: false, // generate HTML output?
        css: false, // generate CSS for HTML output?
        mml: false, // generate mml output?
        svg: true, // generate svg output?
        speakText: false, // add spoken annotations to output?
        timeout: 10 * 1000 // 10 second timeout before restarting MathJax
    }
};

// Process MathJax in HTML files
gulp.task('mathjax', function (done) {
    'use strict';

    console.log('Processing MathJax in ' + paths.text.src);
    gulp.src(paths.text.src)
        .pipe(mathjax(mjpageOptions))
        .pipe(debug({title: 'Processing MathJax in '}))
        .pipe(gulp.dest(paths.text.dest));
    done();
});

// Process MathJax in all HTML files
gulp.task('mathjax:all', function (done) {
    'use strict';
    var k;
    var mathJaxFilePaths = loadMetadata().paths;
    for (k = 0; k < mathJaxFilePaths.length; k += 1) {
        console.log('Processing MathJax in ' + mathJaxFilePaths[k]);
        gulp.src(mathJaxFilePaths[k] + '*.html')
            .pipe(mathjax(mjpageOptions))
            .pipe(debug({title: 'Processing MathJax in '}))
            .pipe(gulp.dest(mathJaxFilePaths[k]));
        done();
    }
});

// Convert all file names in internal links from .html to .xhtml.
// This is required for epub output to avoid EPUBCheck warnings.
gulp.task('epub:xhtmlLinks', function (done) {
    'use strict';

    gulp.src([paths.epub.src, '_site/epub/package.opf', '_site/epub/toc.ncx'], {base: './'})
        .pipe(cheerio({
            run: function ($) {
                var target, asciiTarget, newTarget;
                $('[href*=".html"], [src*=".html"], [id], [href^="#"]').each(function () {
                    if ($(this).attr('href')) {
                        target = $(this).attr('href');
                    } else if ($(this).attr('src')) {
                        target = $(this).attr('src');
                    } else if  ($(this).attr('id')) {
                        target = $(this).attr('id')
                    } else {
                        return;
                    }

                    // remove all non-ascii characters using iconv-lite
                    // by converting the target from utf-8 to ascii.
                    var iconvLiteBuffer = iconv.encode(target, 'utf-8');
                    var asciiTarget = iconv.decode(iconvLiteBuffer, 'ascii');
                    // Note that this doesn't remove illegal characters,
                    // which must then be replaced.
                    // (See https://github.com/ashtuchkin/iconv-lite/issues/81)
                    var asciiTarget = asciiTarget.replace(/[�?]/g, '');

                    if (!asciiTarget.includes('http')) {
                        newTarget = asciiTarget.replace('.html', '.xhtml');
                        if ($(this).attr('href')) {
                            $(this).attr('href', newTarget);
                        } else if ($(this).attr('src')) {
                            $(this).attr('src', newTarget);
                        } else if ($(this).attr('id')) {
                            $(this).attr('id', newTarget);
                        }
                    }
                });
            },
            parserOptions: {
                xmlMode: true
            }
        }))
        .pipe(debug({title: 'Converting internal links to .xhtml in '}))
        .pipe(gulp.dest('./'));
    done();
});

// Rename epub .html files to .xhtml.
// Creates a copy of the file that must then be cleaned out
// with the subsequent gulp task `epub:cleanHtmlFiles``
gulp.task('epub:xhtmlFiles', function (done) {
    'use strict';

    console.log('Renaming *.html to *.xhtml in ' + paths.epub.src);
    gulp.src(paths.epub.src)
        .pipe(debug({title: 'Renaming '}))
        .pipe(rename({
            extname: '.xhtml'
        }))
        .pipe(gulp.dest(paths.epub.dest));
    done();
});

// Clean out renamed .html files
gulp.task('epub:cleanHtmlFiles', function () {
    'use strict';
    console.log('Removing old *.html files in ' + paths.epub.src);
    return del(paths.epub.src);
});

// Validate yaml files
gulp.task('yaml', function (done) {
    'use strict';

    console.log('Checking YAML files...');

    gulp.src(paths.yaml.src)
        .pipe(tap(function (file) {
            try {
                yaml.safeLoad(fs.readFileSync(file.path, 'utf8'));
                console.log(file.basename + ' ✓');
            } catch (e) {
                console.log(''); // empty line space
                console.log('\x1b[35m%s\x1b[0m', 'YAML error in ' + file.path + ':');
                console.log('\x1b[36m%s\x1b[0m', e.message);
                console.log(''); // empty line space
            }
        }));
    done();
});

// when running `gulp`, do the image tasks
gulp.task('default', gulp.series(
    'images:svg',
    'images:printpdf',
    'images:screenpdf',
    'images:epub',
    'images:app',
    'images:web',
    'images:small',
    'images:medium',
    'images:large',
    'images:xlarge',
    'images:max'
));
