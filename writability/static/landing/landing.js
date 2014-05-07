/* global $ */
/**
 * Landing.js is a standalone module for the landing page. It's not part of the
 * main application.
 */
window.Landing = (function ($) {
    $(function () {
        $('#modal-container').hide().css('visibility', 'visible');

        $('.modal-toggle').click(function (ev) {
            $('#modal-container').fadeIn();

            //$('#modal-container').animate({'visibility': 'visible'});
        });
        $('.close-button').click(function (ev) {
            $('#modal-container').fadeOut(300);
            //$('#modal-container').animate({'visibility': 'hidden'});
        });
    });
})($);
