var Typed = require('typed.js')

const startTypedAnimation = () => {
    window.addEventListener('load', (event) => {
        var first_row = new Typed('.typed-row', {
            strings: [
                'Budi izvrstan u onom što vidiš!',
                'Budi izvrstan u onom što voliš.',
                'Budi izvrstan u onom što voliš.<br><strong style="color: darkred">ZAISKRI</strong>.'
            ],
            startDelay: 100,
            typeSpeed: 80,
            contentType: 'html'
        });
    });
}

exports.startTypedAnimation = startTypedAnimation;