console.log('Exporting Model JS');
// import { async } from 'regenerator-runtime';
import icons from 'url:../img/icons.svg';
import { API_KEY, API_URL, RES_PER_PAGE } from './config.js';
import { getJSON, sendJSON } from './helpers.js';

//Contains all the data that we need in order to build our Application
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

//refactoring
const createRecipeOject = function (data) {
  // const recipe = data.data.recipe;
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
//We passed in the id as a parameter because the controller is the one that will tell the model which id to look for
export const loadRecipe = async function (id) {
  /////////////
  // 1) Loading a Recipe from The Forkify API
  try {
    //Using helper function from helpers.js Module to fetch the Forkify Url (res = await fetch()) and convert it to JSON (data = await res.json())
    const data = await getJSON(`${API_URL}${id}?key=${API_KEY}`);

    // console.log('response: ', res);
    // console.log('data: ', data);

    //to remove underscore and respect the camelCase convention Followed in JS community

    state.recipe = createRecipeOject(data);
    console.log(state.recipe); //Newly created Object (Forkify API Object Modified)

    //Checking if there is already a recipe with the same id in the bookmarks state
    if (state.bookmarks.some(bookmarkRecipe => bookmarkRecipe.id === id)) {
      //Mark current Recipe as bookmark
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    //(Important Note) : => Propagating Error from model.js to controller.js
    //the module that will export that loadRecipe func is the one that will handle that error (Controller Module)
    throw err;
  }
};

//We passed in the query as a parameter because the controller is the one that will tell the model which query to look for
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`);
    console.log('Search Data : ', data);

    // state.search = data;
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    console.log(state.search);

    // state.search.page = 1; // for Fixing the Pagination bug
    // return data; //will be the fulfilled value of the returned Promise
  } catch (err) {
    console.error(err);
    throw err;
  }
};

//this function will help us reach the state and get the data that we requested
//which is 10 results per page
export const getSearchResultsPage = function (page = state.search.page) {
  //To store in the state what page we are actually in (Pagination)
  state.search.page = page;
  // console.log(state.search.page);

  //RES_PER_PAGE = 10 = state.search.resultsPerPage
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  //updating the quantity for the new servings
  state.recipe.ingredients.forEach(ing => {
    //newQt = oldQt * newServings / oldServings;
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  //updating the servings in the state (recipe Object)
  state.recipe.servings = newServings;
  console.log('state  New Serving : ', state.recipe);
};

//Storing the bookmarks in the Local Storage
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

//getting the bookmarks from the Local Storage and put it in the bookmarks array
export const getLocalStorage = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

export const addBookmark = function (recipe) {
  //Add bookmark
  state.bookmarks.push(recipe);

  //Mark current Recipe as bookmarked
  // if(recipe.id === window.location.hash.slice(1))
  //state.recipe.id => the one curently loaded in our application
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // 4) storing bookmarks to local storage
  persistBookmarks();
};

//Common Pattern in Programming World is when we Add somthing we get the entire DATA (recipe) and when we Delete Something we only get the id (id)
export const deleteBookmark = function (id) {
  //Delete bookmark
  const index = state.bookmarks.findIndex(
    bookmarkRecipe => bookmarkRecipe.id === id
  );

  state.bookmarks.splice(index, 1);

  //Mark current Recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  // 4) storing bookmarks to local storage
  persistBookmarks();
};

// const init = function () {
//   getLocalStorage();
// };

// init();
// console.log(state.bookmarks);

//removing a bookmark
export const deleteBookmarkFromStorage = function (id) {
  const data = JSON.parse(localStorage.getItem('bookmarks'));

  const index = data.findIndex(bookmark => bookmark.id === id);

  if (index > -1) {
    //we used destructuring because local Storage return an array of Objects
    const [removedRecipe] = data.splice(index, 1);
    removedRecipe.bookmarked = false;
    console.log(removedRecipe);

    if (state.recipe.id === removedRecipe.id) state.recipe.bookmarked = false;
    localStorage.setItem('bookmarks', JSON.stringify(data));
  }
};

//Clearing bookmarks from localStorage
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

//Upload Recipe
export const uploadRecipe = async function (newRecipe) {
  try {
    // console.log(Object.entries(newRecipe));
    //converting Object back to an array
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ingredient => {
        const ingredientArr = ingredient[1].split(',').map(el => el.trim());
        if (ingredientArr.length !== 3) {
          throw new Error(
            'wrong ingredient format ! please use the correct format 😞'
          );
        }

        const [quantity, unit, description] = ingredientArr;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });
    console.log(ingredients);
    // newRecipe.ingredients = ingredients;
    console.log(newRecipe);
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };
    console.log(recipe);

    const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);
    console.log(data);
    state.recipe = createRecipeOject(data);
    console.log(state.recipe);
    // state.recipe.key = `${API_KEY}`; //manualy
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
