// Select HTML elements for DOM Manipulation
const $recipeAreas = $('#recipe-areas'); // Select page 2 datalist dropdown with area options
const $recipeAreaInput = $('#area-input'); // Select input field for area
const $generateRecipeButton = $('#generate-recipe');
const $recipeContainer = $('#recipe-container'); // Select recipe container div within modal

// Set up variables to add data to
const areaList = []; // List of available areas from API
// const chosenRecipes = [];
let $areaSelected = ''; // User-selected area from dropdown
let mealOptions = [];

// Asynchronous function to fetch area data from the Edamam API and add to areaList variable
async function sendAreaAPIRequest () {
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    console.log(response);
    let data = await response.json();
    console.log(data);
    for (let i = 0; i < data.meals.length; i++) {
        areaList.push(data.meals[i].strArea);
    };
    console.log(areaList);
    // Populate area list dropdown with areaList items
    for (let i = 0; i < areaList.length; i++) {
        let $areaDropdownEl = $('<option>').val(areaList[i]).addClass('area-options');
        $recipeAreas.append($areaDropdownEl);
    }
}
sendAreaAPIRequest();
// {
//     "idMeal": "52946",
//     "strMeal": "Kung Po Prawns",
//     "strDrinkAlternate": null,
//     "strCategory": "Seafood",
//     "strArea": "Chinese",
//     "strInstructions": "Mix the cornflour and 1 tbsp soy sauce, toss in the prawns and set aside for 10 mins. Stir the vinegar, remaining soy sauce, tomato purée, sugar and 2 tbsp water together to make a sauce.\r\n\r\nWhen you’re ready to cook, heat a large frying pan or wok until very hot, then add 1 tbsp oil. Fry the prawns until they are golden in places and have opened out– then tip them out of the pan.\r\n\r\nHeat the remaining oil and add the peanuts, chillies and water chestnuts. Stir-fry for 2 mins or until the peanuts start to colour, then add the ginger and garlic and fry for 1 more min. Tip in the prawns and sauce and simmer for 2 mins until thickened slightly. Serve with rice.",
//     "strMealThumb": "https://www.themealdb.com/images/media/meals/1525873040.jpg",
//     "strTags": "BBQ",
//     "strYoutube": "https://www.youtube.com/watch?v=ysiuZm9FIxs",
//     "strIngredient1": "Prawns",
//     "strIngredient2": "Soy Sauce",
//     "strIngredient3": "Tomato Puree",
//     "strIngredient4": "Corn Flour",
//     "strIngredient5": "Caster Sugar",
//     "strIngredient6": "Sunflower Oil",
//     "strIngredient7": "Peanuts",
//     "strIngredient8": "Chilli",
//     "strIngredient9": "Brown Sugar",
//     "strIngredient10": "Garlic Clove",
//     "strIngredient11": "Water Chestnut",
//     "strIngredient12": "Ginger",
//     "strIngredient13": "",
//     "strIngredient14": "",
//     "strIngredient15": "",
//     "strIngredient16": "",
//     "strIngredient17": "",
//     "strIngredient18": "",
//     "strIngredient19": "",
//     "strIngredient20": "",
//     "strMeasure1": "400g",
//     "strMeasure2": "2 tbs",
//     "strMeasure3": "1 tsp ",
//     "strMeasure4": "1 tsp ",
//     "strMeasure5": "1 tsp ",
//     "strMeasure6": "1 tsp ",
//     "strMeasure7": "85g",
//     "strMeasure8": "3 Large",
//     "strMeasure9": "1 tbs",
//     "strMeasure10": "6 cloves",
//     "strMeasure11": "450g",
//     "strMeasure12": "to taste",
//     "strMeasure13": "",
//     "strMeasure14": "",
//     "strMeasure15": "",
//     "strMeasure16": "",
//     "strMeasure17": "",
//     "strMeasure18": "",
//     "strMeasure19": "",
//     "strMeasure20": "",
//     "strSource": "https://www.bbcgoodfood.com/recipes/1415664/kung-po-prawns",
//     "strImageSource": null,
//     "strCreativeCommonsConfirmed": null,
//     "dateModified": null
// }

// Function to add ingredient data to an array
const getIngredientAndQuantityOfMeal = (meal) => {
    const ingredient = [];
    for (const entry of Object.entries(meal)) {
        const key = entry[0];
        const value = entry[1];
        if (key.includes("strIngredient")) {
            const index = key.match(/\d+/);
            if (index === null) continue;

            const number = parseInt(index[0]);
            if (ingredient[index] === undefined) {
                ingredient[index] = {
                    name: undefined,
                    quantity: undefined,
                }
            }

            ingredient[number].name = value;
        }

        if (key.includes("strMeasure")) {
            const index = key.match(/\d+/);
            if (index === null) continue;

            const number = parseInt(index[0]);
            if (ingredient[index] === undefined) {
                ingredient[index] = {
                    name: undefined,
                    quantity: undefined,
                }
            }

            ingredient[number].quantity = value;
        }
    }
    console.log(ingredient);
    return ingredient;
    
}

// Event listener to trigger asynchronous function to fetch recipes using user-selected Area
$generateRecipeButton.on('click', async function(event) {
    event.preventDefault();
    // Update modal class to display:block
    const $recipeModal = $('#recipe-options-modal'); // Select recipe modal
    $recipeModal.removeClass('hidden').addClass('block');

    $areaSelected = $recipeAreaInput.val();
     
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${$areaSelected}`)
    console.log(response);
    const data = await response.json();
    console.log(data);
    // Loop through recipe data to get IDs of each, then trigger async function to fetch specifics of each recipe

    const promiseArr = [];
    for (const meal of data.meals) {
        let recipeId = meal.idMeal;
        promiseArr.push(fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`));
    }
    const mealRequests = await Promise.all(promiseArr);
    console.log(mealRequests);

    const mealDataArr = [];
    for (const request of mealRequests) {
        mealDataArr.push(request.json());
    }

    const mealData = await Promise.all(mealDataArr);
    console.log(mealData)

    // Populate recipe cards in modal

    for (let i = 0; i < mealData.length; i++) {
        const recipeTitle = mealData[i].meals[0].strMeal;
        const recipeImageURL = mealData[i].meals[0].strMealThumb;
        const recipeIngredients = getIngredientAndQuantityOfMeal(mealData[i].meals[0]);
        const $recipeCardDivEl = $('<div>').addClass('w-1/3 recipe-card');
        const $recipeTitleEl = $('<h3>').addClass('text-3xl text-center').append(recipeTitle);
        const $recipeImageEl = $('<img>').attr({
            src: recipeImageURL,
          });
        const $recipeButtonEl = $('<button>').addClass('select-recipe m-auto w-1/6 bg-purple-800').text('Select');
        $recipeCardDivEl.append($recipeTitleEl).append($recipeImageEl).append($recipeButtonEl);
        $recipeContainer.append($recipeCardDivEl); 
        
    }
})

// On-click event listener for when user clicks on a recipe button
// $recipeContainer.on('click', async function(event) {
//     // Save recipe info from that button to storage (recipe title and timestamp)

// })


//LOGO EVENT LISTENER

// const s_logo = document.querySelector("#logo-container");
// const s_navbar = document.querySelector("nav");

// s_logo.addEventListener("click", function () {

//     window.location = "#page-02"; //go to page 02

//     //make the navbar appear
//     s_navbar.style.opacity = 1;

//     //remove page 01 from document after 5 seconds
//     setTimeout(function () {

//         s_page01.remove();

//     }, 5000);

//     //fade in page-02 content
//     const s_p2Content = document.querySelector("#page-02-content");

//     setTimeout(function () {

//         s_p2Content.style.opacity = 1;
//         s_p2Content.style.paddingTop = 60 + "px";
//         s_p2Content.style.paddingBottom = 60 + "px";

//     }, 600);

// });


// // Asynchronous function to fetch data from the Edamam API
// async function sendMealAPIRequest() {
//     const API_URL = "https://api.edamam.com/api/recipes/v2";
//     let query = "pizza";
//     let dataType = "public";
    
//     let response = await fetch(`${API_URL}?app_id=${APP_ID}&app_key=${API_KEY}&q=${query}&type=${dataType}`);
//     console.log(response);
//     let data = await response.json();
//     console.log(data);
//     recipeData.push(data);
//     // Use data[i]._links.next.href to obtain URL for next page and push data from each to recipeData variable
//     for (i = 0; i < 49; i++) { // first 20 results already generated, so only need 49 more iterations
//         let nextResponse = await fetch(recipeData[i]._links.next.href);
//         console.log(response);
//         let nextData = await nextResponse.json();
//         console.log(nextData);
//         recipeData.push(nextData);
//     }
//     // Generate three random numbers between 1 and 1000 (# results) as recipes to display on page
//     for (i = 0; i < 3; i++) {
//         let randomIndex = Math.floor(Math.random() * 1000);
//         console.log(randomIndex);
//     }
// }

// sendEdamamRequest();


// Return first set of data
// Add to object
// Use data[i]._links.next.href to obtain URL for next page
// Use that URL in another request
// Do this n times