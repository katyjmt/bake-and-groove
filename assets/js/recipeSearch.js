// Select HTML elements for DOM Manipulation
const $recipeAreas = $('#recipe-areas'); // Select page 2 datalist dropdown with area options
const $recipeAreaInput = $('#area-input'); // Select input field for area
const $generateRecipeButton = $('#generate-recipe');
const $recipeContainer = $('#recipe-container'); // Select recipe container div within modal
const $ingredientsEl = $('#ingredients-list'); // Select ingredients <ul> on page 3
const $methodEl = $('#method'); // Select method container div on page 3
const $exitModal = $('#exit-modal');
const $recipeModal = $('#recipe-options-modal'); // Select recipe modal

// Set up variables to add data to
const areaList = []; // List of available areas from API
let $areaSelected = ''; // User-selected area from dropdown
let mealData = []; // Array to hold different options available to user based on cuisine type selection
let cuisineRecipesIngredientsList = []; // Empty array to populate with ingredients lists from recipes from selected cuisine type
let ingredientsData = []; // Empty array to hold ingredient items

// Get history object from local storage if it exists
if (localStorage.getItem("history") !== null) {
    history = JSON.parse(localStorage.getItem("history"));
};


// Asynchronous function to fetch area data from the Recipes API and add to areaList variable
async function sendAreaAPIRequest() {
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
    return ingredient;

}

// Event listener to trigger asynchronous function to fetch recipes using user-selected Area
$generateRecipeButton.on('click', async function (event) {
    event.preventDefault();
    // Update modal class to display:block
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

    mealData = await Promise.all(mealDataArr);
    console.log(mealData)

    // Populate recipe cards in modal

    for (let i = 0; i < mealData.length; i++) {
        const recipeTitle = mealData[i].meals[0].strMeal;
        const recipeImageURL = mealData[i].meals[0].strMealThumb;
        const recipeIngredients = getIngredientAndQuantityOfMeal(mealData[i].meals[0]);
        cuisineRecipesIngredientsList.push(recipeIngredients);
        // console.log(recipeIngredients);
        const $recipeCardDivEl = $('<div>').addClass('w-1/3 recipe-card p-3 m-3 bg-white').attr({ title: recipeTitle, id: i });
        const $recipeTitleEl = $('<h3>').addClass('text-3xl text-center').append(recipeTitle);
        const $recipeImageEl = $('<img>').attr({
            src: recipeImageURL,
        });
        // const $recipeButtonEl = $('<button>').addClass('select-recipe m-auto w-1/6 bg-purple-800').text('Select');
        $recipeCardDivEl.append($recipeTitleEl).append($recipeImageEl);
        $recipeContainer.append($recipeCardDivEl);
    }
})

// On-click event listener for when user clicks on a recipe button
$recipeContainer.on('click', '.recipe-card', function (e) {
    // Push recipe title and dayJS timestamp to history object
    history.search.push(this.title);
    let timestampNow = dayjs().format('h:mA, dddd D MMMM YYYY');
    console.log(timestampNow);
    history.timestamp.push(timestampNow);
    // Save recipe info from that button to storage (recipe title and timestamp)
    localStorage.setItem("history", JSON.stringify(history));
    // Populate ingredientsData array with qty and ingredients
    let currentRecipeId = this.id;
    cuisineRecipesIngredientsList[currentRecipeId].forEach(element => {
        if (element.name && element.name !== '') {
            const formattedIngredient = `${element.quantity} ${element.name}`;
            ingredientsData.push(formattedIngredient);
        }
    });
    // Loop through ingredientsData array and populate bullet points on Ingredients section on page 3
    for (let i = 0; i < ingredientsData.length; i++) {
        const $ingredientLi = $('<li>');
        $ingredientLi.text(ingredientsData[i]);
        $ingredientsEl.append($ingredientLi);
    }

    // Popuate method data on page 3
    const $methodDetailsEl = $('<p>');
    const $methodData = mealData[currentRecipeId].meals[0].strInstructions;
    $methodDetailsEl.text($methodData);
    $methodEl.append($methodDetailsEl);

    // Move location to page 3
    window.location = "#page-03";
})

$exitModal.on('click', function () {

    $recipeModal.removeClass('block').addClass('hidden');

});