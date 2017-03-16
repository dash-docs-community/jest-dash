var cheerio = require('cheerio');
var fs = require('fs');
var config = require('./config');
var indexedFiles = require('./indexedFiles');

// remove the left column and the nav bar so that it fits dash's usually small
// browser screen
indexedFiles.forEach(function(array, index) {
    //console.log(array);
    var path = __dirname + '/../Contents/Resources/Documents/' + config.name + '/docs/' + array.name + '.html';
    var src = fs.readFileSync(path, 'utf8');
    var $ = cheerio.load(src);

    var headerClasses = config.pageSubHeaders.toString();
    var $headers = $(headerClasses);

    $headers.each(function(index, elem) {
        // Remove "Edit this Page" Button
        $('.edit-page-link').remove();

        var name = $($(elem).contents().get(1)).text();

        // TODO: Change "array.toc to somehting more relevant on a page-by-page basis in indexedFiles.js"
        $(elem).prepend('<a name="//apple_ref/cpp/' + array.toc + '/' + encodeURIComponent(name) + '" class="dashAnchor"></a>');
        $.html();
    });

    // Remove Header
    $('.fixedHeaderContainer').remove();
    // Remove Side Navigation
    $('.docsNavContainer').remove();
    // Remove Footer
    $('.nav-footer').remove();
    // Clean up size of page
    $('.sideNavVisible').attr('style', 'min-width:inherit;padding-top:0');
    $('.docMainWrapper').attr('style', 'width:inherit;');
    $('.post').attr('style', 'float:none;margin:auto;');

    fs.writeFileSync(path, $.html(), 'utf8');
});
