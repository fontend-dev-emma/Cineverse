import View from './view';

class UnderratedMoviesView extends View {
  _parentElement = document.getElementById(
    'underrated-swiper-movies-parentElement'
  );
  _swiperContainer = document.getElementById(
    'underrated-movies-swiper-container'
  );
  _nextBtn = document.getElementById('underrated_next');
  _prevBtn = document.getElementById('underrated_prev');

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
        const genre = movie.genres[0];
        // const rating = movie.rating.toFixed(1)

        return `
        <div class="swiper-slide movie-card  flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2" data-id="${
          movie.id
        }" data-type="tmdb" data-aos="slide-down">
                  <div
                    class="rounded-lg shadow-md overflow-hidden cursor-pointer hover:scale-105 transition-transform bg-gray-800 text-white mx-auto"
                  >
                    <img
                      src="https://image.tmdb.org/t/p/w500/${movie.poster}"
                       alt="${movie.title} poster"
                      class="w-full aspect-[2/3] object-cover object-top"
                    />
                    <div class="p-4">
                      <div class="flex justify-between mb-2">
                        <h3 class="text-lg font-semibold truncate">
                         ${movie.title}
                        </h3>
                        <span
                          class="text-yellow-400 text-base flex items-center gap-1"
                        >
                          <i class="fas fa-star"></i> ${movie.rating.toFixed(1)}
                        </span>
                      </div>
                      <div class="flex justify-between text-gray-400 text-sm">
                        <span>${genre}</span>
                        <span class="px-2 py-0.5 text-white bg-red-700 rounded-lg text-xs">${year}</span>
                        <span>${hours}h ${minutes}m</span>
                      </div>
                    </div>
                  </div>
                </div>
              `;
      })
      .join('');
  }
}

export default new UnderratedMoviesView();
