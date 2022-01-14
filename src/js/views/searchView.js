class SearchView {
  _parentElement = document.querySelector('.search');

  getQuery() {
    //Storing the query entered by the user in the query variable
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }
  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';

    //clear Field and removing the curson ( | ) when submiting the form using the blur() Method
    // this._parentElement.querySelector('.search__field').blur();
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', handler);
  }
}

export default new SearchView();
