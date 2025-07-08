import View from './view';

class ContinueWatchingView extends View {
  _parentElement = document.getElementById(
    'continue-watching-movies-swiper-parentElement'
  );

  _swiperContainer = document.getElementById(
    'continue-watching-movies-swiper-container'
  );

  _nextBtn = document.getElementById('continue_watching_next');
  _prevBtn = document.getElementById('continue_watching_prev');

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
        const progressPercent = Math.floor(
          (movie.progress / movie.duration) * 100
        );
        const watchedMinutes = Math.floor(movie.progress);
        const watchedTime = `${Math.floor(watchedMinutes / 60)}h ${
          watchedMinutes % 60
        }m`;
        const leftPercent = 100 - progressPercent;
        const year = new Date(movie.release_date).getFullYear();

        return `<div class="swiper-slide movie-card flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2" data-id="${
          movie.id
        }" data-type="tmdb">
                        <div
                          class="bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:scale-105 transition-transform text-white mx-auto"
                        >
                          <img
                            src="https://image.tmdb.org/t/p/w500${
                              movie.poster_path
                            }"
                            alt="${movie.title} Poster"
                            class="w-full aspect-[2/3] object-cover object-top"
                          />
                          <div class="p-4">
                            <h3 class="text-lg font-semibold mb-1 truncate">${
                              movie.title
                            }</h3>
                            <div class="text-sm text-gray-400 mb-1">
                              ${
                                movie.genres?.join(', ') || 'Genre'
                              } <br> <span class="px-2 py-0.5 text-white bg-red-700 rounded-lg text-xs mr-3">${year}</span>  ${Math.floor(
          movie.duration / 60
        )}h ${(movie.duration % 60).toFixed(0)}m
                            </div>
                            <div class="text-sm text-gray-500 mb-1">
                              Watched: ${watchedTime} • Left: ${leftPercent}%
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                              <div
                                class="bg-yellow-400 h-2 rounded-full"
                                style="width: ${progressPercent}%"
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>`;
      })
      .join('');
  }
}

export default new ContinueWatchingView();
