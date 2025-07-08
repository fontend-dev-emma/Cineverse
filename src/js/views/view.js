// ✅ Import Swiper bundle correctly
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// Swiper.use([Navigation]);

import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: false,
  mirror: true,
  offset: 100,
});

export default class View {
  _swiperInstance;

  /**
   * Unhides the parent section of the current view by:
   * - Removing the `hidden` class to make it visible.
   * - Adding `opacity-100` on the next animation frame for smooth fade-in effect (assuming Tailwind transitions are used).
   *
   * @private symbolize with _
   * @returns {void}
   *
   * @example
   * this._unhideSection(); // Reveals the section with a fade-in animation
   */
  _unhideSection() {
    const section = this._parentElement.closest('section');
    if (section) {
      section.classList.remove('hidden');
      requestAnimationFrame(() => section.classList.add('opacity-100'));
    }
  }

  /**
   * Renders a set of animated skeleton loader cards inside the view.
   *
   * - Unhides the section if it was hidden.
   * - Inserts a repeated skeleton loader markup to visually indicate loading state.
   * - Defaults to rendering 5 skeletons if no count is provided.
   * - Refreshes AOS (Animate On Scroll) after injecting the loaders.
   *
   * @param {number} [count=5] - The number of skeleton cards to render.
   * @returns {void}
   *
   * @example
   * this.renderSkeletonLoader();       // Renders 5 skeletons
   * this.renderSkeletonLoader(3);      // Renders 3 skeletons
   */
  renderSkeletonLoader(count = 5) {
    this._unhideSection();
    const skeletonCard = `
      <div class="relative overflow-hidden rounded-md bg-gray-600/50 w-full animate-pulse">
        <div class="aspect-[2/3] bg-gray-700"></div>
        <div class="p-4 space-y-2">
          <div class="h-4 bg-gray-600 rounded w-3/4"></div>
          <div class="h-3 bg-gray-600 rounded w-1/2"></div>
        </div>
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm"></div>
      </div>
    `;
    const markup = new Array(count).fill(skeletonCard).join('');
    this.#clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);

    AOS.refreshHard();
  }

  /**
   * Displays a centered loading spinner inside the parentElement on the view.
   *
   * @returns {void}
   */
  renderSpinner() {
    const markup = `<div class="flex items-center justify-center w-full h-64">
  <div class="w-12 h-12 border-[3px] border-white/20 border-t-white rounded-full animate-spin"></div>
</div>`;
    this.#clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Renders the provided data into the UI (view) using the generated markup.
   * Falls back to an error message if data is missing or empty.
   *
   * @param {Object|Array} data - The data to render (single object or array of objects).
   * @returns {void}
   */
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError(this._message);

    this._data = data;
    const markup = this._generateMarkup();

    this.#clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);

    AOS.refreshHard();
  }

  /**
   * @description --- controlled the catched error on an API called when called. in other not ti mess the DOM (UI)
   * @param {*} message --- to be called with an error message or will render default message from the child class
   */
  // Render Error Message to
  renderError(message = this._errorMessage) {
    const markup = `<div class="text-center py-8 text-red-400">${message}</div>`;
    this.#clear();
    this._parentElement.innerHTML = markup;

    setTimeout(() => {
      this.#clear();
    }, 1000);
  }

  /**
   * Renders a temporary toast message in the center of the screen.
   * Supports `success`, `error`, or `default` message styles.
   *
   * @param {string} [message=this._message or can be passsed in manually] - The message text to display.
   * @param {string} [type=this._type] - The type of message ('success' | 'error' | 'default').
   * @returns {void}
   */
  renderMessage(message = this._message, type = this._type) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `
      fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
    w-[80%] sm:w-auto max-w-[90%] bg-gray-800 text-white text-center text-sm
    px-3 py-2 sm:px-4 sm:py-2 rounded-md shadow-lg
    transition-opacity duration-300 opacity-0 pointer-events-auto
    `;

    toast.textContent = message;

    // Color based on type
    if (type === 'error') toast.classList.add('bg-red-600');
    else if (type === 'success') toast.classList.add('bg-green-600');
    else toast.classList.add('bg-gray-800');

    this._parentElement.appendChild(toast);

    // Fade in
    requestAnimationFrame(() => {
      toast.classList.remove('opacity-0');
      toast.classList.add('opacity-100');
    });

    // Auto remove after 3s
    setTimeout(() => {
      toast.classList.remove('opacity-100');
      toast.classList.add('opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /**
   * Clears all existing content from the parent element.
   *
   * @private
   * @returns {void}
   */
  #clear() {
    this._parentElement.innerHTML = '';
  }

  /**
   * Initializes a Swiper slider instance with responsive settings and navigation controls.
   *
   * - Sets `slidesPerView` based on screen width breakpoints.
   * - Enables `centeredSlides` on smaller screens for better alignment.
   * - Uses Swiper's Navigation module for next/prev buttons.
   * - Does not loop slides.
   *
   * @returns {void}
   */
  setUpSwiper() {
    new Swiper(this._swiperContainer, {
      modules: [Navigation],
      slidesPerGroup: 1,
      spaceBetween: 8,
      loop: false,
      navigation: {
        nextEl: this._nextBtn,
        prevEl: this._prevBtn,
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
          centeredSlides: true,
        },
        640: {
          slidesPerView: 2,
          centeredSlides: false,
        },
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
      },
    });
  }

  /**
   * Attaches a click event listener to the parent element.
   * Delegates clicks to elements with the `.movie-card` class and calls the handler with the card's ID and type.
   *
   * @param {(id: string, type: string) => void} handler - Callback function to handle the card click, receives `id` and `type` as arguments.
   * @returns {void}
   */
  addHandlerCardClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const card = e.target.closest('.movie-card');

      if (!card) return;

      e.preventDefault();

      const id = card.dataset.id;
      if (!id) return;

      const type = card.dataset.type || 'tmdb';

      handler(id, type);
    });
  }

  /**
   * Adds a click event listener to the parent element to handle clicks on "Add to Watchlist" buttons.
   * Extracts the movie data from the clicked button's dataset and passes it to the provided handler.
   *
   * @param {(movie: Object) => void} handler - Callback function that receives the parsed movie object.
   * @returns {void}
   */
  addHandlerToAddWatchlist(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.add-to-watchlist-btn');
      if (!btn) return;

      const raw = decodeURIComponent(btn.dataset.movie);
      const movie = JSON.parse(raw);
      if (!movie) return;

      handler(movie);
    });
  }
}
