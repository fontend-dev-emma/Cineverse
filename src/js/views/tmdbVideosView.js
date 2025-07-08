import View from './view';

class TmdbVideosView extends View {
  _parentElement = document.getElementById('tmdb-search-results-container');
  _message = 'No TMDB movie found';
  _type = 'error';

  /**
   * @description Generate markup for YouTube video cards
   * @returns {string} Markup for all videos
   */
  _generateMarkup() {
    return this._data
      .map(movie => {
        const year = new Date(movie.date).getFullYear();

        return `<div class="w-full max-w-[400px] mx-auto rounded-lg shadow-md overflow-hidden cursor-pointer hover:scale-105 transition-transform bg-gray-800 movie-card " data-id="${
          movie.id
        }" data-type="tmdb">
                  <img
                    src="https://image.tmdb.org/t/p/w500/${movie.poster}"
                    alt="${movie.title} Poster"
                    class="w-full aspect-[2/3]  object-cover"
                  />
                  <div class="p-4 flex flex-col">
                    <h3 class="text-lg font-semibold mb-1 truncate text-white">
                      ${movie?.title || 'Untitled'}
                    </h3>
                    <div
                      class="flex justify-between text-base text-gray-400 mb-2"
                    >
                      <span>${movie.genres[0]}</span>
                      <span>${year || 'N/A'}</span>
                      <span>${
                        typeof movie.runtime === 'number' && movie.runtime > 0
                          ? `${Math.floor(movie.runtime / 60)}h ${
                              movie.runtime % 60
                            }m`
                          : ''
                      }</span>
                    </div>
                    <div class="text-base text-yellow-500">
                      <i class="fas fa-star mr-1"></i>
                      <span>${movie.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>`;
      })
      .join('');
  }
}

export default new TmdbVideosView();
