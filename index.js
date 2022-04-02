let divWorks = document.getElementById("works");
let divBio = document.getElementById("bio");
let divLeft = document.getElementById("left");
let divRight = document.getElementById('right');
let mediaContainers = document.getElementsByClassName('media-container');
let mediaOverlays = document.getElementsByClassName('media-overlay');
let detailed = document.getElementsByClassName('detailed');

function showDiv(divID) {
    divWorks.style.display = "none";
    divBio.style.display = "none";
    document.getElementById(divID).style.display = "block";
}

let descriptions = document.getElementsByClassName("description");

function goHome(){
    divRight.style.backgroundColor = "transparent";
    Array.from(detailed).forEach(d => d.style.display='none');
    Array.from(mediaContainers).forEach(d => d.style.display='block');
    Array.from(mediaOverlays).forEach(d => d.style.display='block');

    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

}

function showDesc(N){
    for (const div of descriptions){
        div.style.display = "none";
    }
    descriptions[N-1].style.display = "block";
    Array.from(detailed).forEach(d =>{
        if (d.style.display !== 'none'){
            d.style.display = 'none';
            divRight.style.backgroundColor = "transparent";
            Array.from(mediaContainers).forEach(d => d.style.display='block');
            Array.from(mediaOverlays).forEach(d => d.style.display='block');
        }
    })
}


window.addEventListener('resize', reArrange);

function reArrange(){
    let wrapper = document.getElementById("container");
    let overlays = document.querySelectorAll(".media-overlays");
    if (window.innerHeight > window.innerWidth) {
        wrapper.style.flexDirection = 'column';
        divLeft.style.width = '100vw';
        divRight.style.width = '100vw';
        for (const div in overlays){
            div.style.fontSize = '50px';
        }
    } else {
        wrapper.style.flexDirection = 'row';
        divLeft.style.width = '28vw';
        divRight.style.width = '72vw';
    }
}

function readMore(N){
    divRight.style.backgroundColor = "white";
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    Array.from(mediaContainers).forEach(d => d.style.display='none');
    Array.from(mediaOverlays).forEach(d => d.style.display='none');
    Array.from(detailed).forEach(d => d.style.display='none');


    document.getElementById(String(N)).style.display='block';
    document.getElementById("dd" + String(N)).style.display="block";

}
