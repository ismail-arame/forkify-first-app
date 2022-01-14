import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; //Parcel 2

// class BookmarksView extends View {
//   _parentElement = document.querySelector('.bookmarks__list');
//   _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
//   _message = '';

//   //Rendering the markup from PrevieView for Each of the bookmarks and we use the false parameter (render = false  : in View render Method) to create one big string (using join() Method ) containing all the markup of the bookmarks array and then when we exit the map method this big string will be inserted in the DOM by bookmarksView.render() in the controlAddBookmark function

//   //when loading the page
//   addHandlerRender(handler) {
//     window.addEventListener('load', handler);
//   }

//   _generateMarkup() {
//     return this._data
//       .map(bookmark => previewView.render(bookmark, false))
//       .join('\n');
//   }
// }

// export default new BookmarksView();

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  addHandlerDeleteBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const clickedBtn = e.target.closest('.preview__btn--close');
      console.log('clickedBtn is : ', clickedBtn);

      //to get the parent element of the X button clicked so then we can remove it from local storage and render the new bookmark View
      if (!clickedBtn) return;
      const parentOfClickedBtnX = clickedBtn.closest('.preview');

      handler(parentOfClickedBtnX);
    });
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join('\n');
  }

  _generateMarkupPreview(result) {
    const id = window.location.hash.slice(1);

    return `
        <li class="preview">
          <a class="preview__link ${
            result.id === id ? 'preview__link--active' : ''
          }" href="#${result.id}">
            <button class="preview__btn--close">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <figure class="preview__fig">
              <img src="${result.image}" alt="${result.title}" />
            </figure>
            <div class="preview__data">
              <h4 class="preview__title">${result.title}</h4>
              <p class="preview__publisher">${result.publisher}</p>
              <div class="preview__user-generated ${
                result.key ? '' : 'hidden'
              }">
                <svg>
                  <use href="${icons}#icon-user"></use>
                </svg>
              </div>
            </div>
          </a>
        </li>
    `;
  }
}

export default new BookmarksView();
