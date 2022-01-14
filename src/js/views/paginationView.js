import View from './View.js';
import icons from 'url:../../img/icons.svg'; //Parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerPagination(handler) {
    //Event Delegation because we have two buttons
    this._parentElement.addEventListener('click', function (e) {
      const clickedBtn = e.target.closest('.btn--inline');
      console.log(clickedBtn);
      if (!clickedBtn) return;

      const goToPage = +clickedBtn.dataset.gotopage;
      console.log(goToPage, typeof goToPage);
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log('Number of Pages is : ', numPages);

    //Current Page
    const curPage = this._data.page;

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `
        <button data-gotopage="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }

    //Last page
    if (curPage === numPages && numPages > 1) {
      return `
        <button  data-gotopage="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
          <span>Page ${curPage - 1}</span>
          </button>
          `;
    }

    //Other page
    if (curPage > 1 && curPage < numPages) {
      return `
          <button  data-gotopage="${
            curPage - 1
          }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
          <button  data-gotopage="${
            curPage + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
          `;
    }

    //Page 1, and there are No other pages
    return ``;
  }
}

export default new PaginationView();
