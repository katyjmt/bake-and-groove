//BOX EFFECT TODO:
//make the div absolute so it won't affect the page layout
//code refactor and

const vpHeight = window.innerHeight;
const vpWidth = window.innerWidth;
const boxWidth = 75;
const boxHeight = 75;
const fadeInitialLevel = 0.5;
const s_boxEffect = document.querySelector("#boxEffect");

console.log(vpWidth + " x " + vpHeight);

for (i = 0; i < vpWidth * vpHeight; i += boxWidth * boxHeight) {

    let boxEl = document.createElement("div");
    boxEl.setAttribute("style", `height: ${boxHeight}px; width: ${boxWidth}px; background-color: black; opacity: 0;`);
    boxEl.setAttribute("class", "boxybox");

    s_boxEffect.append(boxEl);

    console.log(i, vpWidth * vpHeight);

}

const sArray_boxyBox = document.querySelectorAll(".boxybox");

for (i = 0; i < sArray_boxyBox.length; i++) {

    sArray_boxyBox[i].addEventListener("mouseover", function (e) {

        let fadeLevel = fadeInitialLevel;
        e.target.setAttribute("style", `height: ${boxHeight}px; width: ${boxWidth}px; background-color: black; opacity: ${fadeLevel};`);

        let effectFadeDown = setInterval(function () {

            if (fadeLevel <= 0) {

                clearInterval(effectFadeDown);

            } else if (fadeLevel > 0) {

                fadeLevel = fadeLevel - 0.05;
                e.target.setAttribute("style", `height: ${boxHeight}px; width: ${boxWidth}px; background-color: black; opacity: ${fadeLevel};`);
                console.log(fadeLevel);

            }

        }, 50);

    });

}
