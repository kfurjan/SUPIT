const Typed = require('typed.js');

$(document).ready(() => {
    new Typed('.typed-row', {
        strings: [
            'Budi izvrstan u onom što vidiš!',
            'Budi izvrstan u onom što voliš.',
            'Budi izvrstan u onom što voliš.<br><strong style="color: darkred">ZAISKRI</strong>.'
        ],
        startDelay: 100,
        typeSpeed: 100,
        backDelay: 1000,
        contentType: 'html'
    });
});