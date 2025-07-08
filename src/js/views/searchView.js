class SearchView {
  _parentElement = document.getElementById('search-form');
  _parentElements = document.querySelectorAll('.search-form');
  _forms = document.querySelectorAll('.search-form');
  _inputElement = document.getElementById('search-input');
  _searchSection = document.getElementById('search-results-section');

  _getQuery(form) {
    return form.querySelector('input').value;
  }

  clearInput() {
    this._parentElements.forEach(form => {
      const input = form.querySelector('input');
      if (input) input.value = '';
    });
  }

  addHandlerSearch(handler) {
    this._parentElements.forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const query = this._getQuery(form).trim();
        if (!query) return;
        handler(query);
        this.clearInput();

        this._searchSection?.classList.remove('hidden');
        this._searchSection?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    });
  }
}

export default new SearchView();
