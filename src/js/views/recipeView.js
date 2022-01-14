import View from './View.js';
// import icons from '../../img/icons.svg'; //Parcel 1
import icons from 'url:../../img/icons.svg'; //Parcel 2
//var Fraction = require('fractional').Fraction (exports Fraction Using the Old CommonJs )
//using destructuring because Fraction function is inside another Fraction Object (have same name)
import { Fraction } from 'fractional';
console.dir(Fraction);

//we used a class in view because we will write a parent class that all other classes should inherit methods from it (Parent class is => View)
class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'We could not find that recipe. Please try another one!';
  _message = '';

  //////////////
  //Event Handlers in MVC __ Publisher Subscriber Pattern
  //Subscribing to Publisher by Passing the Subscriber function (controlRecipes)
  addHandlerRender(handler) {
    // Showing The Recipe
    //Listning for HashCHange (url/hash starts with #)

    //Running Multiple Events that happen to the same Target in a Nice Way Using (forEach)
    //We used Load to show a Recipe by opening the Url with the hash ia new Tab

    // handler is the subscriber (controlRecipes)
    ['hashchange', 'load'].forEach(event =>
      window.addEventListener(event, handler)
    );
    // window.addEventListener('hashchange', controlRecipes);
    // window.addEventListener('load', controlRecipes);
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const clickedBtn = e.target.closest('.btn--update-servings');
      // console.log('clicked Button is : ', clickedBtn);
      if (!clickedBtn) return;

      //Data attributes makes life easier
      //(Note about data attributes) =>
      //data-update-to should be called in javascript dataset.updateTo
      // the (-) sign turns into UpperCase (CamelCase updateTo)
      //and data-updateTo should be called in javascript dataset.updateto (or you get an error)
      const updateToNewServings = +clickedBtn.dataset.updateToNewServings;

      // console.log('newServings is : ', updateToNewServings);

      //Passing newServing Variable to controlServings function in the controller module
      if (updateToNewServings > 0 && updateToNewServings <= 10)
        handler(updateToNewServings);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const clickedBtn = e.target.closest('.btn--bookmark');
      console.log('clickedBtn is : ', clickedBtn);
      if (!clickedBtn) return;

      // console.log('view : ', this._data);
      handler();
      // this._data.bookmarked = !this._data.bookmarked;
    });
    // .querySelector('.btn--round')
  }

  _generateMarkup() {
    return `
      <figure class="recipe__fig">
        <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${this._data.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${
            this._data.cookingTime
          }</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${
            this._data.servings
          }</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button data-update-to-new-servings="${
              this._data.servings - 1
            }" class="btn--tiny btn--update-servings">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button data-update-to-new-servings="${
              this._data.servings + 1
            }" class="btn--tiny btn--update-servings">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
        <button class="btn--round btn--bookmark">
          <svg class="">
            <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
        ${this._data.ingredients.map(this._generateMarkupIngredient).join('\n')}
        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${
            this._data.publisher
          }</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${this._data.sourceUrl}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
    `;
  }

  //Private Methods Work because of babel
  _generateMarkupIngredient(ing) {
    return `
      <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${
          ing.quantity ? new Fraction(ing.quantity).toString() : ''
        }</div>
        <div class="recipe__description">
          <span class="recipe__unit">${ing.unit}</span>
          ${ing.description}
        </div>
      </li>`;
  }
}

//Creating an Object from RecipeView Class and export it

//and that Object created have access to all methods and propreties of RecipeView class (from its Prototype === RecipeView.prototype)
export default new RecipeView();
