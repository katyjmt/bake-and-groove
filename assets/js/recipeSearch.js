// Select HTML elements for DOM Manipulation
const $recipeAreas = $('#recipe-areas'); // Select page 2 datalist dropdown with area options


// const recipeData = []; // variable to store pages of data (Edamam API returns 20 recipes at a time)
const areaList = [];
const chosenRecipes = [];

// Asynchronous function to fetch area data from the Edamam API and add to areaList variable
async function sendAreaAPIRequest () {
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    console.log(response);
    let data = await response.json();
    console.log(data);
    for (i = 0; i < data.meals.length; i++) {
        areaList.push(data.meals[i].strArea);
    };
    console.log(areaList);
    // Populate area list dropdown with areaList items
    for (i = 0; i < areaList.length; i++) {
        let $areaDropdownEl = $('option').val(areaList[i]);
        $recipeAreas.append($areaDropdownEl);
    }
}
sendAreaAPIRequest();




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