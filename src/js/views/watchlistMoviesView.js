import View from './view';

class WatchlistMoviesView extends View {
  _parentElement = document.getElementById('watchlist-grid-card-parentElement');
  _message = '🗑️ Movie removed from your watchlist';
  _type = 'error';

  addHandlerToRemoveWatchlist(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.remove-watchlist-btn');
      if (!btn) return;

      const id = +btn.dataset.id;
      handler(id);
    });
  }

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
        const rating = movie.vote_average || movie.rating;
        const year = new Date(movie.date || movie.release_date).getFullYear();

        return `<div
            class="bg-white/5 backdrop-blur-md rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-200 flex flex-col" data-aos="fade-up">
            <img
              src="https://image.tmdb.org/t/p/w500/${
                movie.poster || movie?.poster_path
              }"
              alt="${movie.title} Poster"
              class="w-full aspect-[2/3] object-cover object-top"
            />

            <div class="p-4 flex flex-col justify-between h-full">
              <div class="mb-4">
                <h3 class="text-xl font-semibold mb-1 truncate">${
                  movie.title
                }</h3>
                <div class="flex items-center gap-4 text-md text-white/70 mt-2">
                  <span>${year}</span>
                  &nbsp;
                  <span class="text-yellow-400">
                   <i class="fas fa-star"></i> ${
                     rating ? rating.toFixed(1) : 'N/A'
                   }</span>
                </div>
              </div>

              <div class="mt-auto flex gap-2">
                <button
                  class="w-1/2 bg-red-600 hover:bg-red-700 transition py-1.5 text-sm rounded-md font-medium movie-card" data-id="${
                    movie.id
                  }"
                >
                  <i class="fa-solid fa-circle-play"></i>
                   Watch
                </button>
                <button
                  class="w-1/2 bg-gray-700 hover:bg-gray-800 transition py-1.5 text-sm rounded-md font-medium remove-watchlist-btn" data-id="${
                    movie.id
                  }"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
`;
      })
      .join('');
  }
}

export default new WatchlistMoviesView();
