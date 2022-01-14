import View from './View.js';
import icons from 'url:../../img/icons.svg'; //Parcel 2

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'your recipe were successfully uploaded 😊';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');

  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }
  _addHandlerShowWindow() {
    ////Open AddRecipe Window
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    //Close AddRecipe Window
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));

    // //clicking outside the Add Recipe Form to close the window
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));

    //pressing the Escape Key to Close the Window
    document.querySelector('body').addEventListener('keydown', function (e) {
      if (
        e.key === 'Escape' &&
        !document
          .querySelector('.add-recipe-window')
          .classList.contains('hidden')
      ) {
        ['.add-recipe-window', '.overlay'].forEach(Element => {
          if (!document.querySelector(Element).classList.contains('hidden'))
            document.querySelector(Element).classList.add('hidden');
        });
      }
    });
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      //to select and get all the Form element (values) we use a modern browser API
      //and into the FromData constructor we have to passe in an element which is the form
      //this KEYWORD is the element which the listener is attached to
      const dataArr = [...new FormData(this)]; // this === this._parentElement
      console.log(dataArr);
      //converting Entries to Object (ES 2019 Method)
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
