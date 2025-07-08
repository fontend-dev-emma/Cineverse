import View from './view';

class TrendingMoviesView extends View {
  _parentElement = document.getElementById('trending-movie-container');
  // _movieCard = document.querySelector('.movie-card');

  #errorMessage = 'No coins found. Try another search.';

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

        return `
<div class="flex-shrink-0  w-[90%] max-w-[200px] sm:w-60 md:w-56 lg:w-64 xl:w-82 movie-card " data-id="${movie.id}" data-type="tmdb" data-aos="fade-up">
                            <div class="rounded-lg overflow-hidden shadow-md cursor-pointer hover:scale-105 transition-transform bg-gray-800 text-white">
                              <img
                                src="https://image.tmdb.org/t/p/w500${movie.poster}"
                                alt="${movie.title} Poster"
                                class="w-full aspect-[2/3] object-cover object-top"
                              />
                              <div class="p-3">
                                <h3 class="text-lg font-semibold truncate mb-2">${movie.title}</h3>
                                <div class="text-sm text-gray-400 flex items-center gap-2">
                                  <span>${hours}h ${minutes}m</span>
                                  <span class="px-2 py-0.5 text-white bg-red-700 rounded-lg text-xs">${year}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        `;
      })
      .join('');
  }
}

export default new TrendingMoviesView();
