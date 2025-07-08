import { trackAndUpdateWatchProgress } from '../model';
import { state } from '../helper';
import View from './view';

class TrailerView extends View {
  _parentElement = document.getElementById('similarMoviesSection');
  _trailerModal = document.getElementById('trailer-modal');
  _movieOverviewSection = document.getElementById('movieOverviewSection');
  _similarMoviesSection = document.getElementById('similarMoviesSection');

  _ytPlayer = null;
  _progressInterval = null;
  _currentTrailerKey = null;
  _currentTrailerID = null;

  /**
   * Adds an event listener to play the movie trailer when the "Watch Trailer" button is clicked.
   * If a valid trailer key is available, it initializes and displays a YouTube modal player.
   * If no trailer is found, it shows an error message to the user.
   *
   * @param {Object} trailer - The trailer object containing at least a `key` property from TMDB.
   */
  addPlayTrailerHandler(trailer) {
    this._movieOverviewSection.addEventListener('click', e => {
      const btn = e.target.closest('.play-trailer-btn');
      if (!btn) return;

      if (!trailer?.key) {
        this.renderMessage('⚠️ No trailer available for this movie.', 'error');
        return;
      }

      this._currentTrailerKey = trailer.key;
      this._currentTrailerID = state.movie?.id;

      const markup = this._generateMarkup({ key: trailer.key });
      this._trailerModal.innerHTML = markup;
      this._trailerModal.classList.remove('hidden');

      if (!window.YT || !window.YT.Player) {
        window.onYouTubeIframeAPIReady = () => this._initYouTubePlayer();
      } else {
        this._initYouTubePlayer();
      }
    });
  }

  /**
   * Attaches a click event listener to the "Watch" button within the similar movies section.
   * When clicked, it retrieves the movie ID from the corresponding card and calls the provided handler.
   *
   * @param {Function} handler - Callback function to handle the watch action, receives the movie ID.
   */
  addWatchHandler(handler) {
    this._similarMoviesSection.addEventListener('click', e => {
      const btn = e.target.closest('.watch-btn');
      if (!btn) return;

      const movieCard = btn.closest('.movie-card');
      const movieID = movieCard.dataset.id;

      handler(movieID);
    });
  }

  /**
   * Adds a click event listener to the trailer modal to handle closing the trailer.
   * When the close button is clicked, it destroys the YouTube player instance,
   * hides the modal, and clears its content.
   */
  addCloseHandler() {
    this._trailerModal.addEventListener('click', e => {
      if (e.target.id === 'close-trailer') {
        this._destroyPlayer();
        this._trailerModal.classList.add('hidden');
        this._trailerModal.innerHTML = '';
      }
    });
  }

  /**
   * Adds a click event listener to the trailer modal to handle closing the YouTube trailer.
   * When the close button is clicked, it destroys the YouTube player and navigates back to the homepage.
   */
  addYoutubeCloseHandler() {
    this._trailerModal.addEventListener('click', e => {
      if (e.target.id === 'close-trailer') {
        this._destroyPlayer();
        window.location.href = 'index.html';
      }
    });
  }

  /**
   * Plays a trailer video for a similar movie by injecting the YouTube iframe into the modal.
   * Initializes the YouTube player if not already available in the global scope.
   *
   * @param {Object} trailer - Trailer object containing the YouTube video key.
   */
  playSimilarVideo(trailer) {
    this._currentTrailerKey = trailer.key;
    this._currentTrailerID = state.movie?.id;

    const markup = this._generateMarkup({ key: trailer.key });
    this._trailerModal.innerHTML = markup;
    this._trailerModal.classList.remove('hidden');

    if (!window.YT || !window.YT.Player) {
      window.onYouTubeIframeAPIReady = () => this._initYouTubePlayer();
    } else {
      this._initYouTubePlayer();
    }
  }

  /**
   * Plays a YouTube video from search results by injecting the player iframe into the trailer modal.
   * Initializes the YouTube player if not already available in the global scope.
   *
   * @param {string} videoId - The YouTube video ID to play.
   */
  playYouTubeSearchResult(videoId) {
    this._currentTrailerKey = videoId;
    this._currentTrailerID = videoId;

    const markup = this._generateMarkup({ key: videoId });
    this._trailerModal.innerHTML = markup;
    this._trailerModal.classList.remove('hidden');

    if (!window.YT || !window.YT.Player) {
      window.onYouTubeIframeAPIReady = () => this._initYouTubePlayer();
    } else {
      this._initYouTubePlayer();
    }
  }

  /**
   * Internal method to track and update the user's watch progress for a movie.
   *
   * @param {string} movieID - The ID of the movie being watched.
   * @param {number} currentTime - The current playback time in seconds.
   * @param {number} duration - The total duration of the video in seconds.
   */
  _onTrackProgress(movieID, currentTime, duration) {
    if (!movieID) return;
    trackAndUpdateWatchProgress(movieID, currentTime, duration);
  }

  /**
   * Allows external assignment of a custom progress tracking handler.
   * This replaces the default `_onTrackProgress` method.
   *
   * @param {Function} handler - A function to handle tracking progress (movieID, currentTime, duration).
   */
  setProgressHandler(handler) {
    this._onTrackProgress = handler;
  }

  /**
   * Initializes the embedded YouTube player using the YouTube IFrame API.
   * Automatically starts playback of the trailer using the stored trailer key.
   * Also sets up a state change listener to begin tracking progress when playback starts.
   */
  _initYouTubePlayer() {
    this._ytPlayer = new YT.Player('youtube-player', {
      videoId: this._currentTrailerKey,
      width: '100%',
      height: '100%',
      playerVars: { autoplay: 1, controls: 1 },
      events: {
        onStateChange: event => {
          if (event.data === YT.PlayerState.PLAYING) {
            this._trackTrailerProgress();
          }
        },
      },
    });
  }

  /**
   * Starts tracking the current trailer's playback progress using setInterval.
   * Every 2 seconds, it fetches the current time and duration from the YouTube player.
   * If a progress handler is defined, it calls it with the trailer ID, current time, and duration.
   * Automatically stops tracking when 95% of the video has been watched.
   */
  _trackTrailerProgress() {
    if (this._progressInterval) clearInterval(this._progressInterval);

    this._progressInterval = setInterval(() => {
      const duration = this._ytPlayer.getDuration();
      const currentTime = this._ytPlayer.getCurrentTime();
      if (!duration) return;

      const ratio = currentTime / duration;

      if (this._onTrackProgress)
        this._onTrackProgress(this._currentTrailerID, currentTime, duration);

      if (ratio >= 0.95) {
        clearInterval(this._progressInterval);
      }
    }, 2000);
  }

  /**
   * Stops trailer progress tracking and destroys the YouTube player instance if it exists.
   */
  _destroyPlayer() {
    if (this._progressInterval) clearInterval(this._progressInterval);
    if (this._ytPlayer && this._ytPlayer.destroy) this._ytPlayer.destroy();
  }

  /**
   * Returns HTML markup for the trailer modal including the YouTube player container
   * and a close button.
   * @param {Object} param0 - Object containing the trailer key.
   * @param {string} param0.key - The YouTube video ID.
   * @returns {string} - HTML string for the trailer modal.
   */
  _generateMarkup({ key }) {
    return `
      <div class="relative w-full h-[80vh]">
        <div class="w-full h-full rounded-lg" id="youtube-player" ></div>
        <button
          id="close-trailer"
          class="absolute top-0 right-1 text-white text-4xl font-bold hover:text-red-500 z-10"
          title="Close"
        >
          &times;
        </button>
      </div>
    `;
  }
}

export default new TrailerView();
