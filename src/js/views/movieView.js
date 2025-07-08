import View from './view';

class MovieView extends View {
  _parentElement = document.getElementById('movie-container');
  _section = document.getElementById('movieOverviewSection');

  /**
   * Generates the HTML markup for rendering the view's specific content.
   * This method is used internally by the parent `render()` method to inject
   * dynamic content into the DOM.
   *
   * @returns {string} - HTML string to be rendered in the view.
   */
  _generateMarkup() {
    const movie = this._data;
    this._section.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
    const hours = Math.floor(movie.runtime / 60);
    const minutes = movie.runtime % 60;
    const genres = movie.genres.map(g => g.name).join('  ');
    const release = new Date(movie.release_date);

    const year = release.getFullYear();
    const shortMonth = new Intl.DateTimeFormat('en-US', {
      month: 'short',
    }).format(release);
    const day = release.getDate(); // Use getDate() for the numeric day

    return `<div
  class="movie-card relative flex flex-col md:flex-row w-full gap-8 z-10"
  data-id="${movie.id}"
  data-type="tmdb"
  data-aos="fade-up"
>
  <!-- Left Column: Text -->
<div class="flex-1 flex flex-col justify-center space-y-6 px-3 sm:px-3 md:px-6">
  <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
    <i class="fas fa-align-left text-sky-400"></i>
    Overview
  </h2>

  <p class="w-full text-sm sm:text-base md:text-lg leading-relaxed text-white/90">
    ${movie.overview}
  </p>

  <div class="text-white/60 text-sm sm:text-md ml-1 mb-1">
    ${genres}
  </div>

  <div class="text-sm text-white/50">
    ${hours}h ${minutes}m • Released: ${shortMonth} ${day}, ${year}
  </div>
</div>

  <!-- Right Column: Poster + Buttons -->
  <div class="w-full max-w-sm flex flex-col items-center px-4">
    <img
      src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"
      alt="${movie.title} Poster"
      class="rounded-xl shadow-lg mb-6 w-full"
      id="movie-poster"
    />

    <!-- Buttons -->
    <div class="flex flex-wrap sm:flex-nowrap gap-4 w-full">
      <button
        class="flex-1 bg-red-600 hover:bg-red-700 transition px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold text-sm sm:text-base play-trailer-btn"
      >
        <i class="fa-solid fa-circle-play mr-2"></i>
        Watch 
      </button>

      <button
        class="flex-1 bg-gray-700 hover:bg-gray-800 transition px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold text-sm sm:text-base add-to-watchlist-btn"
        data-movie="${encodeURIComponent(JSON.stringify(movie))}"
      >
        <i class="fa-solid fa-circle-plus mr-2"></i>
        Add to List
      </button>
    </div>

    <!-- Progress Bar -->
    <div
      id="progress-container"
      class="w-full bg-gray-700 rounded h-2 mt-6 cursor-pointer hidden"
      title="Click or drag to seek"
    >
      <div
        id="progress-bar"
        class="bg-blue-400 h-2 rounded w-0 transition-all duration-200"
      ></div>
    </div>
  </div>
</div>
`;
  }
}

export default new MovieView();
