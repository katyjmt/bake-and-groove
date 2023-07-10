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

    //make the navbar appear
    s_navbar.style.opacity = 1;

    //remove page 01 from document after 3 seconds
    // setTimeout(function () {

    //     s_page01.remove();

    // }, 3000);

    //fade in page-02 content
    const s_p2Content = document.querySelector("#page-02-content");

    setTimeout(function () {

        s_p2Content.style.opacity = 1;
        s_p2Content.style.paddingTop = 60 + "px";
        s_p2Content.style.paddingBottom = 60 + "px";

    }, 600);

});

//RECIPE BOOK

const s_recipeBookIcon = document.querySelector("#recipe-book-icon");
const s_recipeBookContainer = document.querySelector("#recipe-book-container");

s_recipeBookIcon.addEventListener("click", function () {

    console.log("lol");
    s_recipeBookContainer.style.display = "flex";

    //Fade in effect
    setTimeout(function () {

        s_recipeBookContainer.style.opacity = 1;

    }, 100);


});

s_recipeBookIcon.addEventListener("mouseover", function () {

    s_recipeBookIcon.setAttribute("class", "fa-solid fa-book-open");

});

s_recipeBookIcon.addEventListener("mouseleave", function () {

    s_recipeBookIcon.setAttribute("class", "fa-solid fa-book");

});

