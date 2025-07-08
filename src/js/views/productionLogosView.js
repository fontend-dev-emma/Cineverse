import View from './view';

class ProductionLogosView extends View {
  _parentElement = document.getElementById('production-logos-container');

  /**
   * Generates the HTML markup for rendering the view's specific content.
   * This method is used internally by the parent `render()` method to inject
   * dynamic content into the DOM.
   *
   * @returns {string} - HTML string to be rendered in the view.
   */
  _generateMarkup() {
    return this._data
      .map(logo => {
        return `<img
                src="https://image.tmdb.org/t/p/w200${logo.logo_path}"
                alt="${logo.name}"
                class="h-6 xsm:h-6 sm:h-7 md:h-8 lg:h-10 "
              />
              `;
      })
      .join('');
  }
}

export default new ProductionLogosView();
