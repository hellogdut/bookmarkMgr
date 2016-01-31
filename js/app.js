(function ($) {

    "use strict";

    var animationDelay = 300,
        searchFld = $('input#search');

    // IE support for form field placeholder text
    $('input, textarea').placeholder();

    // Submit search form
    $('#gglsub').click(function () {
        $('#gglFrm').submit();
    });

    // Expand search field on focus
//    searchFld.focus(function () {
//        $(this).animate({width: 300}, animationDelay, "swing");
//    });

    // Clear Search field - Not needed in Chrome, Safari doesn't work anyway, Firefox???
//    searchFld.load(function () {
//        resetSearch($(this));
//    });
//
//    searchFld.blur(function () {
//        searchFld.submit();
//        setTimeout(function () {
//            resetSearch(searchFld);
//        }, 500);
//    });
//
//    function resetSearch(searchField) {
//        searchField.animate({width: 70}, animationDelay, "swing").val('');
//    }

}(jQuery));
