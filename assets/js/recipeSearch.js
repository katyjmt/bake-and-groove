// Select HTML elements for DOM Manipulation
const $recipeAreas = $('#recipe-areas'); // Select page 2 datalist dropdown with area options
const $recipeAreaInput = $('#area-input'); // Select input field for area
const $generateRecipeButton = $('#generate-recipe');

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
    const $recipeContainer = $('#recipe-container'); // Select recipe container div within modal

    for (let i = 0; i < mealData.length; i++) {
        const recipeTitle = mealData[i].meals[0].strMeal;
        const recipeImageURL = mealData[i].meals[0].strMealThumb;
        const $recipeCardDivEl = $('<div>').addClass('w-1/3 bg-gray-400');
        const $recipeTitleEl = $('<h3>').addClass('text-3xl text-center').append(recipeTitle);
        const $recipeImageEl = $('<img>').attr({
            src: recipeImageURL,
          });
        $recipeCardDivEl.append($recipeTitleEl).append($recipeImageEl);
        $recipeContainer.append($recipeCardDivEl);
        

    }
})




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