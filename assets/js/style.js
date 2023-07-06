const s_page01 = document.querySelector("#page-01");

//SPLASH PAGE BOX EFFECT

const s_boxEffect = document.querySelector("#boxEffect");

const vpHeight = window.innerHeight;
const vpWidth = window.innerWidth;
const boxWidth = 75; //set box height
const boxHeight = 75; //set box width
const fadeInitialLevel = 0.2; //set initial hover opacity level of the box

//create boxes based on the dimensions of the viewport
for (i = 0; i < vpWidth * vpHeight; i += boxWidth * boxHeight) {

    let boxEl = document.createElement("div");
    boxEl.setAttribute("style", `
    height: ${boxHeight}px;
    width: ${boxWidth}px;
    background-color: black;
    opacity: 0;
    `);
    boxEl.setAttribute("class", "boxybox");

    s_boxEffect.append(boxEl);

}

const sArray_boxyBox = document.querySelectorAll(".boxybox");
let fadeInDelay = 100;

//selects array for boxes that were created,
//FOR EACH BOX: adds event listener to set to the initial opacity level, then fade out via the setInterval.
//the setTimeout creates a delayed effect, can be removed by setting fadeInDelay to 0 or removing the setTimeout function.
for (i = 0; i < sArray_boxyBox.length; i++) {

    sArray_boxyBox[i].addEventListener("mouseover", function (e) {

        let fadeLevel = fadeInitialLevel;

        setTimeout(function () {

            e.target.style.opacity = fadeLevel;

            let effectFadeDown = setInterval(function () {

                if (fadeLevel <= 0) {

                    clearInterval(effectFadeDown);

                } else if (fadeLevel > 0) {

                    fadeLevel = fadeLevel - 0.05;
                    e.target.style.opacity = fadeLevel;

                }

            }, 100);

        }, fadeInDelay, fadeLevel);



    });

}

//LOGO EVENT LISTENER

const s_logo = document.querySelector("#logo-container");
const s_navbar = document.querySelector("nav");

s_logo.addEventListener("click", function () {

    window.location = "#page-02"; //go to page 02

    //make the navbar appear after 1 second
    setTimeout(function () {

        s_navbar.style.display = "flex";

    }, 1000);

    //remove page 01 from document after 5 seconds
    setTimeout(function () {

        s_page01.remove();

    }, 5000);

});

//RECIPE BOOK

const s_recipeBook = document.querySelector("#recipe-book");

s_recipeBook.addEventListener("mouseover", function () {

    s_recipeBook.setAttribute("class", "fa-solid fa-book-open");

});

s_recipeBook.addEventListener("mouseleave", function () {

    s_recipeBook.setAttribute("class", "fa-solid fa-book");

});