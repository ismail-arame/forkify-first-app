//We are using View class as a parent class of child views
//so we are exporting the class itself (not an instance of the View class)
import icons from 'url:../../img/icons.svg';
export default class View {
  _data;

  /**
   *Render the recieved object to the dom
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the Dom
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View Instance
   * @author Ismail Arame
   * @todo Finish react and become better developer
   */
  ///////////////////////`
  //Rendering Recipe from Forkify API
  render(data, render = true) {
    //if data is null or data is an array and it is empty then renderError
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    // console.log('this._data : ', this._data);
    const markup = this._generateMarkup();

    // for the bookmarksView and resultsView that are using PreviewView to generate the same markup for both of them (refactoring | dry code)
    //like for bookmarks array this will make the PreviewView generate markup for Each bookmark in the array (model.state.bookmarks) so returning that markup using the second parameter (render = false) will make the previewView generate a big string (for Each bookmark its markup)
    if (!render) return markup;

    //when we exit the map method (bookmarksView and resultsView) this part will be executed and the final markup is the one we joined by (join() Method)
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //Developing an algorithm which will update the DOM only in places where it actually changed
  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();

    this._data = data;

    //Getting the entire Markup and then compare it with the old Markup (not rendering it)
    //and then change text and attributes that have changed from the old version to the new version
    const newMarkup = this._generateMarkup();

    //now we have markup but it's just a string so it is hard to compare it to the DOM elements that we currently have in our page
    //so we can convert this markup string to a DOM Node Object (virtual DOM) that is living in the memory and that we can then use to compare with the actual DOM that's on the page
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    //we can use that DOM as it was the real DOM on our page

    //selecting all the elements that are in the newDOM
    //it will give us a NodeList and we use the (from) Method to convert it into an array
    const newELements = Array.from(newDOM.querySelectorAll('*'));
    // console.log('newDOM elements', newELements);

    //in order to do a comparaison between the newDom and the actualDOM we need to get the current Elements that are on the page (on the actual DOM)
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log('actual DOM elements', curElements);

    //Looping over the Two arrays at the same Time to compare them
    newELements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl, newEl.isEqualNode(curEl));

      //checking for Elements that are only text (Update changed TEXT)
      //we need to select the child because the child Node is what contains the text (look at the Theory PDF BY JONAS (Advanced DOM and EVENTS))
      //newEL is just an ELement Node and not a Text Node but its firstChild Node is what contains the Text

      //EXAMPLE :
      //           newEL => <span class="recipe__info-data recipe__info-data--people">5</span>
      //newEl.firstChild =>  "5"
      //nodeValue is a Method that returns tha value of the current Node "5" => 5
      //trim() Method that removes spaces
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(
        //   '****',
        //   newEl,
        //   newEl.firstChild,
        //   newEl.firstChild?.nodeValue
        // );
        //then we want to change the text content of the current DOM to the text content of the new DOM
        //and this is essentially is updating the DOM only in places where it has changed
        curEl.textContent = newEl.textContent;
      }

      //Update Changed ATTRIBUTES (we changed only TEXT and now we are going to change ATTRIBUTES)
      if (!newEl.isEqualNode(curEl)) {
        // (newEl.attributes) Return an Object of all Attributs that have changed
        //so we will convert it to an array and loop over it and copy attributes from newEl to curEL
        Array.from(newEl.attributes).forEach(attribute => {
          curEl.setAttribute(attribute.name, attribute.value);
        });
        // console.log(Array.from(curEl.attributes), Array.from(newEl.attributes));
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner = function () {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div> 
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  //////////////
  //Implementing Error Messages
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //////////////
  //Implementing Success Messages
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
