/* global $ */
/**
 * Landing.js is a standalone module for the landing page. It's not part of the
 * main application.
 */
window.Landing = (function ($) {
    $(function () {
        var $reg_modal = $('#register-modal');
        var $login_modal = $('#login-modal');
        $reg_modal.hide().css('visibility', 'visible');
        $login_modal.hide().css('visibility', 'visible');

        $('.sign-up-modal-toggle').click(function (ev) {
            $reg_modal.fadeIn();
            //$('#modal-container').animate({'visibility': 'visible'}); // or 'hidden'
        });
        $('.login-modal-toggle').click(function (ev) {
            $login_modal.fadeIn();
        });
        $('.close-button').click(function (ev) {
            $reg_modal.fadeOut(300);
            $login_modal.fadeOut(300);
        });
    });
})($);
