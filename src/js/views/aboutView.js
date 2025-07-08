import View from './view';

class AboutView extends View {
  _parentElement = document.getElementById('about-parentElement');

  loadAboutContent() {
    this._parentElement.innerHTML = '';
    const markup = this._generateMarkup();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Generates the HTML markup for rendering the view's specific content.
   * This method is used internally by the parent `render()` method to inject
   * dynamic content into the DOM.
   *
   * @returns {string} - HTML string to be rendered in the view.
   */
  _generateMarkup() {
    return `<div class="text-center mb-20">
          <h2
            class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-400 to-pink-500 bg-clip-text text-transparent"
          >
            About Cineverse
          </h2>
          <p class="mt-4 text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
            Cineverse is your ultimate hub for discovering, exploring, and
            keeping track of the movies that matter most to you.
          </p>
        </div>

        <!-- Mission & Vision -->
        <div class="grid md:grid-cols-2 gap-10 text-white/90">
          <div>
            <h3 class="text-2xl font-semibold mb-4 text-blue-400">
              <i class="fas fa-bullseye"></i>
              Our Mission
            </h3>
            <p class="leading-relaxed text-white/80">
              At Cineverse, our goal is to connect movie lovers with the content
              they crave. Whether it's the latest blockbuster or an underrated
              gem, we help you discover, explore, and build a personalized
              watchlist in a beautifully crafted experience.
            </p>
          </div>
          <div>
            <h3 class="text-2xl font-semibold mb-4 text-purple-400">
              <i class="fas fa-earth-americas"></i>
              Why Cineverse?
            </h3>
            <p class="leading-relaxed text-white/80">
              We believe movies are more than entertainment — they're stories
              that move us. Cineverse brings together smart design and powerful
              features to make browsing, tracking, and watching a seamless
              experience across devices.
            </p>
          </div>
        </div>

        <!-- Features -->
        <div class="mt-32">
          <h3
            class="text-3xl font-bold mb-8 bg-gradient-to-r from-sky-400 to-pink-500 bg-clip-text text-transparent text-center"
          >
            <i class="fas fa-rocket"></i>
            What You Can Do on Cineverse
          </h3>
          <ul
            class="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-white/80 text-base"
          >
            <li
              class="bg-white/10 backdrop-blur-lg p-6 rounded-xl cursor-pointer hover:scale-105 transition-transform"
            >
              <i class="fas fa-folder-open text-blue-400 mr-1"></i>
              Explore your saved movies
            </li>
            <li
              class="bg-white/10 backdrop-blur-lg p-6 rounded-xl cursor-pointer hover:scale-105 transition-transform"
            >
              <i class="fas fa-search text-pink-400 mr-1"></i>
              Search for trending and upcoming movies
            </li>
            <li
              class="bg-white/10 backdrop-blur-lg p-6 rounded-xl cursor-pointer hover:scale-105 transition-transform"
            >
              <i class="fas fa-video text-purple-400 mr-1"></i>
              Watch trailers and explore cast information
            </li>
            <li
              class="bg-white/10 backdrop-blur-lg p-6 rounded-xl cursor-pointer hover:scale-105 transition-transform"
            >
              <i class="fas fa-gem text-blue-300 mr-1"></i>
              Discover top-rated and underrated gems
            </li>
            <li
              class="bg-white/10 backdrop-blur-lg p-6 rounded-xl cursor-pointer hover:scale-105 transition-transform"
            >
              <i class="fas fa-play-circle text-red-500 mr-1"></i>
              Continue watching from where you left off
            </li>
            <li
              class="bg-white/10 backdrop-blur-lg p-6 rounded-xl cursor-pointer hover:scale-105 transition-transform"
            >
              <i class="fas fa-clapperboard text-yellow-400 mr-1"></i>
              Stay updated with newly released movies
            </li>
          </ul>
        </div>
`;
  }
}

export default new AboutView();
