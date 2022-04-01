let divWorks = document.getElementById("works");
let divBio = document.getElementById("bio");
let divRight = document.getElementById('right');
let mediaContainers = document.getElementsByClassName('media-container');
let mediaOverlays = document.getElementsByClassName('media-overlay');

function showDiv(divID) {
    divWorks.style.display = "none";
    divBio.style.display = "none";
    document.getElementById(divID).style.display = "block";
}

let works = document.getElementsByClassName("work");
let descriptions = document.getElementsByClassName("description");
for (let i=0; i<works.length; i++){
    works[i].addEventListener("click", function(){
        for (const div of descriptions){
            div.style.display = "none";
        }
        descriptions[i].style.display = "block";
    })
}

window.addEventListener('resize', reArrange);

function reArrange(){
    let wrapper = document.getElementById("container");
    let divLeft = document.getElementById("left");
    let divRight = document.getElementById("right");
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

function seeMore(N){
    divRight.style.backgroundColor = "white";
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    Array.from(mediaContainers).forEach(d => d.style.display='none');
    Array.from(mediaOverlays).forEach(d => d.style.display='none');

    document.getElementById(String(N)).style.display='block';
    document.getElementById("dd" + String(N)).style.display="block";

}
