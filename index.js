let divWorks = document.getElementById("works");
let divBio = document.getElementById("bio");
console.log(divWorks);
function showDiv(divID) {
    divWorks.style.display = "none";
    divBio.style.display = "none";
    document.getElementById(divID).style.display = "block";
};
