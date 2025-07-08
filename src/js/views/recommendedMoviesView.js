import View from './view';

class RecommendedMoviesView extends View {
  _parentElement = document.getElementById(
    'recommended-movies-swiper-ParentElement'
  );
  _swiperContainer = document.getElementById(
    'recommended-movies-swiper-container'
  );
  _nextBtn = document.getElementById('recommended_movies_next');
  _prevBtn = document.getElementById('recommended_movies_prev');

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
        const hours = Math.floor(movie.runtime / 60);
        const minutes = movie.runtime % 60;
        const year = new Date(movie.date).getFullYear();
        const shortMonth = new Intl.DateTimeFormat('en-US', {
          month: 'short',
        }).format(new Date(movie.date));
        const day = new Date(movie.date).getDay();

        return `<div class="swiper-slide movie-card flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2" data-id="${
          movie.id
        }" data-type="tmdb" data-aos="fade-up">
                  <div
                    class="rounded-lg shadow-md overflow-hidden cursor-pointer hover:scale-105 transition-transform bg-gray-800 text-white"
                  >
                    <img
                      src="https://image.tmdb.org/t/p/w500/${movie.poster}"
                      alt="${movie.title} Poster"
                      class="w-full aspect-[2/3] object-cover object-top"
                    />
                    <div class="p-4">
                      <h3 class="text-lg font-semibold truncate">
                       ${movie.title}
                      </h3>
                      <div
                        class="flex items-center justify-between text-sm text-gray-400"
                      >
                        <span>${movie.genres[0]} &nbsp;&nbsp; ${
          movie.genres[1]
        }</span>
                        <span class="px-2 py-0.5 text-white bg-red-700 rounded-lg text-xs mr-2">${year}</span>
                      </div>
                      <div class="mt-2 text-base text-yellow-500 font-semibold">
                        <i class="fas fa-star"></i> ${movie.rating.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>`;
      })
      .join('');
  }
}

export default new RecommendedMoviesView();
