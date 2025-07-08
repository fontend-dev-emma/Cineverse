import View from './view';

class UpcomingMoviesView extends View {
  _parentElement = document.getElementById('upcoming-movies-container');

  /**
   * Generates the HTML markup for rendering the view's specific content.
   * This method is used internally by the parent `render()` method to inject
   * dynamic content into the DOM.
   *
   * @returns {string} - HTML string to be rendered in the view.
   */
  _generateMarkup() {
    return this._data
      .map(movie => {
        return `
        <div class="flex-shrink-0 w-[90%] max-w-[220px] sm:w-60 md:w-56 lg:w-64 xl:w-82 movie-card " data-id="${movie.id}" data-type="tmdb"  data-aos="fade-up">
                <div
                  class="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                >
                  <img
                    src="https://image.tmdb.org/t/p/w1280/${movie.poster}"
                    alt="${movie.title} Poster"
                    class="w-full aspect-[2/3] object-cover object-top"
                  />
                  <div class="p-3 text-white">
                    <h3 class="text-lg font-semibold truncate">
                      ${movie.title}
                    </h3>
                    <p class="text-sm text-gray-400">Releases: ${movie.date}</p>
                  </div>
                </div>
              </div>`;
      })
      .join('');
  }
}

export default new UpcomingMoviesView();
