import View from './view';

class HeroView extends View {
  _heroWrapper = document.querySelector('.hero-background-image');
  _parentElement = document.getElementById('hero-movie-overView-parentElement');

  updateHeroBackground(backdropPath) {
    if (this._heroWrapper)
      this._heroWrapper.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${backdropPath})`;
  }

  /**
   * Generates the HTML markup for rendering the view's specific content.
   * This method is used internally by the parent `render()` method to inject
   * dynamic content into the DOM.
   *
   * @returns {string} - HTML string to be rendered in the view.
   */
  _generateMarkup() {
    const movie = this._data;
    const hours = Math.floor(movie.runtime / 60);
    const minutes = movie.runtime % 60;
    const year = new Date(movie.date).getFullYear();
    const genres = movie.genres.join('&nbsp; &nbsp;');

    return `<div class="p-4 sm:px-6 sm:py-8 md:px-10 md:py-12 rounded-lg max-w-4xl w-full mx-auto">
  <!-- Hero Title -->
  <h1
    class="text-xl xs:text-2xl iphone:text-3xl xsm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight text-white"
    id="hero-movie-title"
  >
    ${movie.title}
  </h1>

  <!-- Rating / Runtime / Year -->
  <div class="flex flex-wrap gap-3 sm:gap-5 items-center text-sm xs:text-base sm:text-lg md:text-xl text-gray-300 mb-4 sm:mb-6">
    <span class="flex items-center gap-1">
      <i class="fas fa-star text-yellow-400"></i>
      <span class="font-semibold" id="hero-movie-rating">
        ${movie.rating ? movie.rating.toFixed(1) : 'N/A'}
      </span>
    </span>

    <span class="flex items-center gap-1">
      <i class="fa-solid fa-clock text-blue-400"></i>
      <span class="font-semibold" id="hero-movie-duration">${hours}h ${minutes}min</span>
    </span>

    <span class="flex items-center gap-1">
      <i class="fa-solid fa-calendar-days text-white/70"></i>
      <span class="px-3 py-0.5 text-white bg-white/10 backdrop-blur-sm rounded-lg text-xs sm:text-sm border border-white/20">${year}</span>
    </span>
  </div>

  <!-- Genres -->
  <div class="flex flex-wrap gap-2 text-xs sm:text-sm text-white/80 mb-4 sm:mb-6" id="hero-movie-genres">
    <span class="bg-white/10 px-3 py-1 rounded-full">${genres}</span>
  </div>

  <!-- Overview -->
  <p class="text-white/80 leading-relaxed mb-6 sm:mb-10 text-sm sm:text-base max-w-3xl">
    ${movie.overview}
  </p>

  <!-- Buttons -->
  <div class="flex gap-2 sm:gap-4 md:gap-6 text-xs sm:text-sm md:text-base">
    <button
      class="movie-card bg-red-600 hover:bg-red-700 px-2 sm:px-6 lg:px-8 xl:px-10 py-2 sm:py-3 md:py-4 rounded-full font-semibold transition duration-200 flex items-center gap-1 sm:gap-2 flex-1 sm:flex-initial"
      data-id="${movie.id}" data-type="tmdb"
    >
      <i class="fa-solid fa-circle-play"></i> 
      Watch Trailer
    </button>

    <button
      class="bg-white text-gray-800 hover:bg-gray-200 px-2 sm:px-6 lg:px-8 xl:px-10 py-2 sm:py-3 md:py-4 rounded-full font-semibold transition duration-200 flex items-center gap-1 sm:gap-2 add-to-watchlist-btn flex-1 sm:flex-initial"
      data-movie="${encodeURIComponent(JSON.stringify(movie))}"
    >
      <i class="fa-solid fa-circle-plus"></i> 
      <span class="hidden sm:inline">Add to Watchlist</span>
    <span class="sm:hidden">Add To List</span>
    </button>
  </div>
</div>`;
  }
}

export default new HeroView();
