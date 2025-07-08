import View from './view';

class TopRatedMoviesView extends View {
  _parentElement = document.getElementById(
    'top-rated-movies-swiper-parentElement'
  );
  _swiperContainer = document.getElementById(
    'top-rated-movies-swiper-container'
  );
  _nextBtn = document.getElementById('top_rated_next');
  _prevBtn = document.getElementById('top_rated_prev');

  /**
   * @description ---  this Function construct the Search results coin cards DOM structure to the render Method in the Parent class View
   * @returns {markUp} -- it returns a markUp to the Render method in the Parent Class ( View )
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
                      alt="${movie.title}"
                      class="w-full aspect-[2/3] object-cover object-top"
                    />
                    <div class="p-4">
                      <h3 class="text-lg font-semibold mb-1 truncate">
                        ${movie.title}
                      </h3>
                       <div class="text-sm text-gray-400 mb-2">
                        <span class="mr-2">${movie.genres[0]} </span>
                        <span class="px-2 py-0.5 text-white bg-red-700 rounded-lg text-xs mr-2">${year}</span>  
                        <span>${hours}h ${minutes}m</span>
                      </div>
                      <div class="text-base text-yellow-500">
                        <i class="fas fa-star"></i> ${movie.rating.toFixed(
                          1
                        )} / 10
                      </div>
                    </div>
                  </div>
                </div>`;
      })
      .join('');
  }
}

export default new TopRatedMoviesView();
