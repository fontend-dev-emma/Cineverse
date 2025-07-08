import View from './view';

class CastView extends View {
  _parentElement = document.getElementById('cast-container');

  /**
   * Generates the HTML markup for rendering the view's specific content.
   * This method is used internally by the parent `render()` method to inject
   * dynamic content into the DOM.
   *
   * @returns {string} - HTML string to be rendered in the view.
   */
  _generateMarkup() {
    return this._data
      .map(
        actor => `<div class="text-center text-white"  data-aos="zoom-out">
      <div class="w-24 h-24 md:w-28 md:h-28 mx-auto overflow-hidden rounded-full shadow-md border-2 border-white/20">
        <img
          src="https://image.tmdb.org/t/p/w185${actor.profile_path}"
          alt="${actor.original_name} profile"
          class="w-full h-full object-cover"
        />
      </div>
      <h3 class="mt-2 text-sm font-semibold truncate">${actor.original_name}</h3>
      <p class="text-xs text-gray-400 truncate">As ${actor.character}</p>
    </div>`
      )
      .join('');
  }
}

export default new CastView();
