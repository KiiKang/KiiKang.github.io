// https://github.com/katspaugh/wavesurfer.js/tree/master/example


var wavesurfer;

document.addEventListener('DOMContentLoaded', function() {
    wavesurfer = WaveSurfer.create({
        // your options here
        container: document.querySelector('#waveform'),
        waveColor: 'grey',
        vertical: true,
        minPxPerSec: 30,
    });

    wavesurfer.on('error', function(e) {
        console.warn(e);
    })

    wavesurfer.load('media/birds.mp3');

    document
        .querySelector('[data-action="play"]')
        .addEventListener('click', wavesurfer.playPause.bind(wavesurfer));

})


// const colormap = require('colormap');
// const colors = colormap({
//     colormap: 'hot',
//     nshades: 256,
//     format: 'float'
// });
//
// const fs = require('fs');
// fs.writeFile('hot-colormap.json', JSON.stringify(colors));
