import * as model from './model.js';
console.log(model.state);
import { CLOSE_MODAL_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import searchView from './views/searchView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

//Static Assets (Parcel 2 Syntax) that are not programming files
// import icons from '../img/icons.svg'; //Parcel 1
import icons from 'url:../img/icons.svg'; //Parcel 2
import 'core-js/stable'; //Polyfilling anything else (EX : Array Methods)
import 'regenerator-runtime/runtime'; //Polyfilling Async Await Functions
import addRecipeView from './views/addRecipeView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////
// if (module.hot) {
//   module.hot.accept();
// }

console.log('TEST');

const controlRecipes = async function () {
  try {
    //Getting the hash (window.location gets the entire URL Object)
    const id = window.location.hash.slice(1);
    console.log(id);

    //Guard Clause
    if (!id) return;
    // Loading Spinner while Loading Recipe Asynchrounosly
    recipeView.renderSpinner();

    // 0) Updating the Search results View to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 2) Updating the bookmark View to mark selected bookmark
    //when we get data from local storage the  recipe is not yet loaded so we will get an error (curEl.textContent = newEl.textContent in the update function View.js)
    // wo we need to call the update func after loading Recipe
    // bookmarksView.update(model.state.bookmarks);
    bookmarksView.update(model.state.bookmarks);

    /////////////
    // 1) Loading a Recipe from The Forkify API
    // (Busniss Logic) controller calls loadRecipe from the model
    //loadRecipe is an async func so it will return a Promise that we need to await
    await model.loadRecipe(id);

    /////////////
    // 2) Rendering The Recipe

    //Controller sends data to View
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

//Implementing Search Results

const controlSearchResults = async function (e) {
  try {
    e.preventDefault();
    // 1) Rendering spinner while Loading Recipes
    resultsView.renderSpinner();

    // 2) Get search query
    const query = searchView.getQuery();
    //Guard clause
    // if (!query) return;

    // 3) Loading search results
    // (Busniss Logic) controller calls loadSearchResults from the model
    await model.loadSearchResults(query);

    // 4) Rendering Results in the Left Side of the user Interface

    //Initializing the state page whenever we search for new query
    // model.state.search.page = 1; //Same thing
    resultsView.render(model.getSearchResultsPage(1));
    // resultsView.render(model.state.search.results);

    // 5) Render INITIAL Pagination Buttons
    paginationView.render(model.state.search);
  } catch (err) {
    // 5) Rendering Error to the User Interface
    resultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW Pagination Buttons
  paginationView.render(model.state.search);
};

const controlServings = function (updateToNewServings) {
  // 1) Update the recipe servings (in the state)
  model.updateServings(updateToNewServings);
  // 2) Update the View
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //model.state.recipe is the current recipe
  // 1) Add / Delete bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe View
  recipeView.update(model.state.recipe);

  // console.log(model.state.recipe?.bookmarked);
  // console.log(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

//Getting bookmarks array from LocalStorage and then render it as soon as the page Loads (windwo load EVENT )
const controlBookmarks = function () {
  // 1) getting bookmarks array from LocalStorage
  model.getLocalStorage();

  // 2) rendering the bookmarks as soon as the Page Loads
  bookmarksView.render(model.state.bookmarks);
};

const controlDeleteBookmarkFromStorage = function (parentOfClickedBtnX) {
  //to get the parent element of the X button clicked so then we can remove it from local storage and render the new bookmark View
  console.log(parentOfClickedBtnX);

  //this id is the id of the clicked button X (id of recipe in the bookmark)
  // 1) getting the id of the Bookmark to Delete
  const id = parentOfClickedBtnX
    .querySelector('.preview__link')
    .getAttribute('href')
    .slice(1);
  console.log(id);
  // parentOfClickedBtnX.bookmarked

  // 2) deleting the bookmark from Local Storage
  model.deleteBookmarkFromStorage(id);

  // 3) getting bookmarks array from LocalStorage
  model.getLocalStorage();

  // 4) Update recipe View
  recipeView.update(model.state.recipe);

  // 5) rendering the bookmarks as soon as the Page Loads
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    console.log(newRecipe);

    //1) show Loading Spinner
    addRecipeView.renderSpinner();

    //2) Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //3) render Recipe uploaded
    recipeView.render(model.state.recipe);

    //4) rendering a success message
    addRecipeView.renderMessage();

    //5) rendering the bookmarks as soon as the Page Loads
    bookmarksView.render(model.state.bookmarks);

    //6) Change ID in the URL
    // changing the URL without reloading the page
    //holds 3 arguments 1/ state (doesn't matter), 2/ title (not relevant), /3 the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //7) close Form Window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, CLOSE_MODAL_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
    console.error('*********', err);
  }
};
///////////////////////
//Event Handlers in MVC __ Publisher Subscriber Pattern

//Events should be handled in the controller ( => Subscriber : controlRecipes) (otherwise we would have application logic in the view)
//Events should be listened for in the view ( => Publisher : addHandlerRender) (otherwise we would need DOM elements in the controller)

//addHandlerRender() => code that knows when to react : Publisher
//controlRecipes() => code that want to react : Subscriber
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);

  //when the Publisher (addHandlerRender()) Publishes an event the Subscriber (controlRecipes) is executed
  //Subscribing to Publisher by Passing the Subscriber function (controlRecipes)
  //controlRecipes will be passed into addHandlerRender when Program starts
  //addHandlerRender Listens for events (addEventListner) and uses controlRecipes as callback
  recipeView.addHandlerRender(controlRecipes);

  recipeView.addHandlerUpdateServings(controlServings);
  //The Publisher is addHandlerSearch and The Subscriber is controlSearchResults
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);

  paginationView.addHandlerPagination(controlPagination);

  bookmarksView.addHandlerDeleteBookmark(controlDeleteBookmarkFromStorage);

  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();

// const arr = [1, 2, 3, 4, 5];
// const index = arr.indexOf(4);
// console.log(arr);
// if (index > -1) arr.splice(index, 1);
// console.log('array is : ', arr);
