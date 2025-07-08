import View from './view';

class SimilarMoviesView extends View {
  _parentElement = document.getElementById('similar-movies-container');
  _message = '✅ Added to your Watchlist';
  _type = 'success';

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
        return `<div
  class="movie-card bg-white/10 rounded-lg p-3 sm:p-4 flex flex-col items-center text-center shadow-md hover:shadow-lg transition w-full"
  data-id="${movie.id}"
  data-type="tmdb"
  data-aos="fade-up"
>
  <img
    src="https://image.tmdb.org/t/p/w500/${movie.poster}"
    alt="${movie.title} Poster"
    class="w-full aspect-[2/3] object-cover object-top mb-4"
  />
  <h3 class="text-base sm:text-lg font-semibold mb-3 text-white">
    ${movie.title}
  </h3>
  <div class="flex flex-col gap-2 w-full">
    <button
      class="bg-red-600 hover:bg-red-700 text-white py-2 text-sm rounded-md transition w-full watch-btn"
    >
      <i class="fa-solid fa-circle-play mr-1"></i>
      Watch
    </button>
    <button
      class="bg-gray-700 hover:bg-gray-800 text-white py-2 text-sm rounded-md transition w-full add-to-watchlist-btn"
      data-movie="${encodeURIComponent(JSON.stringify(movie))}"
    >
      <i class="fa-solid fa-circle-plus mr-1"></i>
      <span class="hidden sm:inline">Add to Watchlist</span>
    <span class="sm:hidden">Add To List</span>
    </button>
  </div>
</div>`;
      })
      .join('');
  }
}

export default new SimilarMoviesView();
