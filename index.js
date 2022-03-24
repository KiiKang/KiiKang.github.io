let divWorks = document.getElementById("works");
let divBio = document.getElementById("bio");

function showDiv(divID) {
    divWorks.style.display = "none";
    divBio.style.display = "none";
    document.getElementById(divID).style.display = "block";
};

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
