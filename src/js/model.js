import axios from 'axios';
import {
  TMDB_API_KEY,
  TOP_MOVIES_URL,
  TRENDING_MOVIES_URL,
  UPCOMING_MOVIES_URL,
  UNDERRATED_MOVIES_URL,
  NEWLY_REALEASED_MOVIES_URL,
  RECOMMENDED_MOVIES_URL,
  GET_MOVIE_DETAILS_URL,
  YOUTUBE_API_KEY,
} from './config';

import {
  loadFromLocalStorage,
  saveToLocalStorage,
  isValidTmdbMovie,
  getFullDetailsForAll,
  getFullDetailsForMultiSearch,
  getMovieDetails,
  createmovieObject,
  createYoutubeVideoObject,
  state,
} from './helper';

/**
 * Removes a movie from the watchlist state by its ID and updates local storage.
 *
 * @param {string|number} movieId - The ID of the movie to remove.
 * @returns {void}
 */
export const removeMovieFromWatchlist = movieId => {
  state.watchlistMovies = state.watchlistMovies.filter(m => m.id !== movieId);

  saveToLocalStorage('watchlist', state.watchlistMovies);
};

/**
 * Loads the watchlist from local storage and updates the state.
 * If the data is invalid, it sets the watchlist to an empty array.
 *
 * @returns {void}
 */
export const loadWatchlist = () => {
  const data = loadFromLocalStorage('watchlist');

  if (!Array.isArray(data)) {
    state.watchlistMovies = [];
    return;
  }

  /**
   * Filters out invalid movie entries from the watchlist data and updates the state.
   * Ensures each movie has at least an `id`, `title`, and `poster` (or `poster_path`).
   * If invalid entries are found and removed, updates the saved local storage.
   *
   * @param {Array<Object>} data - The raw movie array to clean and validate.
   * @returns {void}
   */
  const cleanedData = data.filter(
    movie => (movie?.id && movie?.title && movie?.poster) || movie.poster_path
  );

  state.watchlistMovies = cleanedData;

  if (cleanedData.length !== data.length) {
    saveToLocalStorage('watchlist', cleanedData);
  }
};

/**
 * Adds a movie object to the watchlist state and saves it to local storage.
 * Skips adding if the movie already exists in the watchlist.
 *
 * @param {Object} movie - The movie object to add.
 * @returns {boolean|undefined} Returns `true` if the movie was added, otherwise returns `undefined`.
 */
export const addMovieObjectToWatchlist = movie => {
  loadWatchlist();

  const key = 'watchlist';
  if (state.watchlistMovies.some(m => m.id === movie.id)) return;

  state.watchlistMovies.unshift(movie);
  saveToLocalStorage(key, state.watchlistMovies);
  return true;
};

/**
 * Tracks and updates the watch progress for a movie by its ID.
 * Loads cached progress if not already present in the state.
 *
 * @param {string|number} id - The unique movie ID.
 * @param {number} currentTime - The current time the movie has been watched.
 * @param {number} duration - The total duration of the movie.
 * @returns {void}
 */
export const trackAndUpdateWatchProgress = (id, currentTime, duration) => {
  const key = 'continueWatching';

  id = String(id);

  if (!state.continueWatchingMovies?.length) {
    const cached = loadFromLocalStorage(key);
    if (Array.isArray(cached)) {
      state.continueWatchingMovies = cached;
    }
  }

  const watchedRatio = currentTime / duration;
  if (watchedRatio >= 0.95) {
    state.continueWatchingMovies = state.continueWatchingMovies.filter(
      movie => movie.id !== id
    );

    saveToLocalStorage(key, state.continueWatchingMovies);
    return;
  }

  const index = state.continueWatchingMovies.findIndex(
    movie => String(movie.id) === id
  );

  if (index !== -1) {
    const movie = state.continueWatchingMovies[index];
    movie.progress = currentTime;
    movie.duration = duration;
    movie.updatedAt = Date.now();

    state.continueWatchingMovies.splice(index, 1);
    state.continueWatchingMovies.unshift(movie);
  } else {
    if (
      !state.movie?.title ||
      !state.movie?.poster_path ||
      !state.movie?.release_date
    )
      return;

    state.continueWatchingMovies.unshift({
      id,
      progress: currentTime,
      duration,
      updatedAt: Date.now(),
      title: state.movie.title,
      poster_path: state.movie.poster_path,
      genres: state.movie.genres?.map(g => g.name),
      release_date: state.movie.release_date,
    });

    if (state.continueWatchingMovies.length > 10) {
      state.continueWatchingMovies.pop();
    }
  }
  saveToLocalStorage(key, state.continueWatchingMovies);
};

/**
 * Fetches trailer videos for a given movie from the TMDB API.
 * Filters for YouTube trailers only and sets the first official trailer (if available)
 * or the first YouTube trailer as the current video in state.
 *
 * @param {string|number} movieId - The ID of the movie to fetch trailer videos for.
 * @returns {Promise<Array<Object>|undefined>} An array of filtered YouTube trailers, or undefined on error.
 */ export const getMovieVideos = async movieId => {
  try {
    const res = await axios.get(
      `${GET_MOVIE_DETAILS_URL}${movieId}/videos?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const movies = res.data.results;
    const filteredMovies = movies.filter(
      movie => movie.type === 'Trailer' && movie.site === 'YouTube'
    );

    const official = filteredMovies.find(movie => movie.official === true);
    state.video = official || filteredMovies[0] || null;

    return filteredMovies;
  } catch (err) {
    throw err;
  }
};

/**
 * Fetches cast information for a specific movie from the TMDB API.
 * Filters the cast to include only those with profile images, names, and character names.
 * Stores the top 10 filtered cast members in the application state.
 *
 * @param {string|number} movieId - The ID of the movie to fetch cast data for.
 * @returns {Promise<void>} A promise that resolves when cast data is stored in state.
 * @throws Will throw an error if the API request fails.
 */ export const getMovieCast = async movieId => {
  try {
    const res = await axios.get(
      `${GET_MOVIE_DETAILS_URL}${movieId}/credits?api_key=${TMDB_API_KEY}`
    );

    const filteredCast = res.data.cast
      .filter(cast => cast.profile_path && cast.original_name && cast.character)
      .slice(0, 10);

    state.cast = filteredCast;
  } catch (err) {
    throw err;
  }
};

/**
 * Fetches similar movies for a given movie ID from the TMDB API.
 * Filters out movies missing essential fields (poster, title, rating),
 * limits to the top 6 valid results, and transforms them using `createmovieObject`.
 * Stores the processed results in the `state.similarMovies` array.
 *
 * @param {string|number} movieId - The ID of the movie to get similar titles for.
 * @returns {Promise<void>} A promise that resolves after updating the state.
 */
export const getSimilarMovies = async movieId => {
  try {
    const res = await axios.get(
      `${GET_MOVIE_DETAILS_URL}${movieId}/similar?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );

    const basicMovies = res.data.results;

    const validMovies = basicMovies.filter(
      movie => movie.poster_path && movie.title && movie.vote_average
    );

    const topValidMovies = validMovies.slice(0, 6);
    const preparedMovies = topValidMovies.map(createmovieObject);

    state.similarMovies = preparedMovies;
  } catch (err) {
    state.similar = [];
  }
};

/**
 * Fetches production company logos for a list of movies.
 * For each movie, retrieves its full details and extracts companies with valid logo paths.
 * Aggregates all logos into a single `allLogos` array.
 *
 * @param {Array<Object>} movies - Array of movie objects (each must include an `id`).
 * @returns {Promise<void>} A promise that resolves after all logos are collected.
 */
export const fetchUniqueProductionLogos = async movies => {
  const allLogos = [];

  await Promise.all(
    movies.map(async movie => {
      const details = await getMovieDetails(movie.id);
      const logos = details.production_companies.filter(c => c.logo_path);
      allLogos.push(...logos);
    })
  );

  const uniqueLogosMap = new Map();
  allLogos.forEach(logo => {
    if (!uniqueLogosMap.has(logo.id)) {
      uniqueLogosMap.set(logo.id, logo);
    }
  });

  state.productionLogos = Array.from(uniqueLogosMap.values());
};

/**
 * Fetches top-rated movies from the TMDB API.
 * - Checks for cached data in local storage using the prefix "topRatedMovies".
 * - If no cache is found, it fetches the movies, gets full details for each,
 *   maps them into a consistent format using `createmovieObject`,
 *   and filters them using `isValidTmdbMovie`.
 * - Updates `state.topMovies` and caches the result.
 *
 * @returns {Promise<void>} A promise that resolves when the top movies are loaded and cached.
 */ export const fetchTopRatedMovies = async () => {
  const prefix = 'topRatedMovies';
  const cached = loadFromLocalStorage(prefix);

  if (cached) {
    state.topMovies = cached;
    return;
  }

  try {
    const res = await axios.get(TOP_MOVIES_URL);
    const basicMovies = res.data.results;

    const fullDetailedMovies = await getFullDetailsForAll(basicMovies);
    const preparedMovies = fullDetailedMovies.map(createmovieObject);

    const validMovies = preparedMovies.filter(isValidTmdbMovie);

    state.topMovies = validMovies;

    saveToLocalStorage(prefix, validMovies);
  } catch (err) {
    throw err;
  }
};

/**
 * Fetches trending movies from the TMDB API.
 * - Attempts to load cached trending movies from localStorage using the key "trendingMovies".
 * - If cached data exists, sets `state.trendingMovies` and fetches production logos.
 * - If not cached, fetches from API, enriches with full details, formats with `createmovieObject`,
 *   filters valid movies using `isValidTmdbMovie`, and updates the state.
 * - Saves the valid movies to localStorage for future use.
 *
 * @returns {Promise<void>} A promise that resolves once trending movies are loaded and processed.
 */
export const fetchTrendingMovies = async () => {
  const prefix = 'trendingMovies';
  const cached = loadFromLocalStorage(prefix);

  if (cached) {
    state.trendingMovies = cached;
    await fetchUniqueProductionLogos(cached);
    return;
  }

  try {
    const res = await axios.get(TRENDING_MOVIES_URL);
    const basicMovies = res.data.results;

    const fullDetailedMovies = await getFullDetailsForAll(basicMovies);
    const preparedMovies = fullDetailedMovies.map(createmovieObject);
    const validMovies = preparedMovies.filter(isValidTmdbMovie);

    state.trendingMovies = validMovies;

    saveToLocalStorage(prefix, validMovies);
  } catch (err) {
    throw err;
  }
};

/**
 * Fetches upcoming movies from the TMDB API.
 * - First checks localStorage using the key "upcomingMovies".
 * - If cached data exists, it is loaded into `state.upcomingMovies`.
 * - Otherwise, it fetches data from the API, retrieves full movie details,
 *   maps each movie to a formatted object, and filters for valid entries.
 * - Stores the processed movies in `state.upcomingMovies` and caches them in localStorage.
 *
 * @returns {Promise<void>} A promise that resolves after updating the upcoming movies state.
 */
export const fetchUpcomingMovies = async () => {
  const prefix = 'upcomingMovies';
  const cached = loadFromLocalStorage(prefix);

  if (cached) {
    state.upcomingMovies = cached;
    return;
  }

  try {
    const res = await axios.get(UPCOMING_MOVIES_URL);
    const basicMovies = res.data.results;

    const fullDetailedMovies = await getFullDetailsForAll(basicMovies);
    const preparedMovies = fullDetailedMovies.map(createmovieObject);
    const validMovies = preparedMovies.filter(isValidTmdbMovie);

    state.upcomingMovies = validMovies;

    saveToLocalStorage(prefix, validMovies);
  } catch (err) {
    throw err;
  }
};

/**
 * Fetches Underrated movies from the TMDB API.
 * - First checks localStorage using the key "underratedMovies".
 * - If cached data exists, it is loaded into `state.underratedMovies`.
 * - Otherwise, it fetches data from the API, retrieves full movie details,
 *   maps each movie to a formatted object, and filters for valid entries.
 * - Stores the processed movies in `state.underratedMovies` and caches them in localStorage.
 *
 * @returns {Promise<void>} A promise that resolves after updating the Underrated movies state.
 */ export const fetchUnderratedMovies = async () => {
  const prefix = 'underratedMovies';
  const cached = loadFromLocalStorage(prefix);

  if (cached) {
    state.underratedMovies = cached;
    return;
  }

  try {
    const res = await axios.get(UNDERRATED_MOVIES_URL);
    const basicMovies = res.data.results;

    const fullDetailedMovies = await getFullDetailsForAll(basicMovies);
    const preparedMovies = fullDetailedMovies.map(createmovieObject);
    const validMovies = preparedMovies.filter(isValidTmdbMovie);

    state.underratedMovies = validMovies;

    saveToLocalStorage(prefix, validMovies);
  } catch (err) {
    throw err;
  }
};

/**
 * Fetches upcoming movies from the TMDB API.
 * - First checks localStorage using the key "newlyReleasedMovies".
 * - If cached data exists, it is loaded into `state.newlyReleasedMovies`.
 * - Otherwise, it fetches data from the API, retrieves full movie details,
 *   maps each movie to a formatted object, and filters for valid entries.
 * - Stores the processed movies in `state.newlyReleasedMovies` and caches them in localStorage.
 *
 * @returns {Promise<void>} A promise that resolves after updating the newly Released movies state.
 */
export const fetchNewlyReleasedMovies = async () => {
  const prefix = 'newlyReleasedMovies';
  const cached = loadFromLocalStorage(prefix);

  if (cached) {
    state.newlyReleasedMovies = cached;
    return;
  }

  try {
    const res = await axios.get(NEWLY_REALEASED_MOVIES_URL);
    const basicMovies = res.data.results;

    const fullDetailedMovies = await getFullDetailsForAll(basicMovies);
    const preparedMovies = fullDetailedMovies.map(createmovieObject);
    const validMovies = preparedMovies.filter(isValidTmdbMovie);

    state.newlyReleasedMovies = validMovies;
    saveToLocalStorage(prefix, validMovies);
  } catch (err) {
    throw err;
  }
};

/**
 * Fetches upcoming movies from the TMDB API.
 * - First checks localStorage using the key "recommendedMovies".
 * - If cached data exists, it is loaded into `state.recommendedMovies`.
 * - Otherwise, it fetches data from the API, retrieves full movie details,
 *   maps each movie to a formatted object, and filters for valid entries.
 * - Stores the processed movies in `state.recommendedMovies` and caches them in localStorage.
 *
 * @returns {Promise<void>} A promise that resolves after updating the recommended movies state.
 */
export const fetchRecommendedMovies = async () => {
  const prefix = 'recommendedMovies';
  const cached = loadFromLocalStorage(prefix);

  if (cached) {
    state.recommendedMovies = cached;
    return;
  }

  try {
    const res = await axios.get(RECOMMENDED_MOVIES_URL);
    const basicMovies = res.data.results;

    const fullDetailedMovies = await getFullDetailsForAll(basicMovies);
    const preparedMovies = fullDetailedMovies.map(createmovieObject);
    const validMovies = preparedMovies.filter(isValidTmdbMovie);

    state.recommendedMovies = validMovies;
    saveToLocalStorage(prefix, validMovies);
  } catch (err) {
    throw err;
  }
};

/**
 * Loads searched movies or TV shows based on a user query.
 *
 * - First checks if results for the query exist in localStorage.
 * - If cached, sets the state with the cached data and exits.
 * - Otherwise, fetches results from TMDB's multi-search API.
 * - Filters only valid movie/TV items that have a poster.
 * - Enhances the results with full movie details, maps them, and filters out invalid entries.
 * - Saves the valid results to both state and localStorage.
 *
 * @param {string} query - The search term entered by the user.
 * @returns {Promise<void>} A promise that resolves after updating the state and localStorage.
 */
export const loadSearchedResults = async query => {
  const tmdbKey = `tmdb_search_${encodeURIComponent(query)}`;
  const cachedTMDB = loadFromLocalStorage(tmdbKey);

  if (cachedTMDB) {
    state.search.query = query;
    state.search.results = cachedTMDB;
    return;
  }

  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        query
      )}`
    );
    const rawMovies = res.data.results;
    const filteredMovies = rawMovies.filter(
      item =>
        (item.media_type === 'movie' || item.media_type === 'tv') &&
        item.poster_path
    );

    const fullDetailedMovies = await getFullDetailsForMultiSearch(
      filteredMovies
    );
    const preparedMovies = fullDetailedMovies.map(createmovieObject);
    const validMovies = preparedMovies.filter(isValidTmdbMovie);

    state.search.query = query;
    state.search.results = validMovies;

    saveToLocalStorage(tmdbKey, validMovies);
  } catch (err) {
    throw err;
  }
};

/**
 * Loads YouTube videos based on a search query.
 *
 * - Checks if the search results for the query are cached in localStorage.
 * - If cached, loads from localStorage and updates state.
 * - If not cached, fetches videos from the YouTube Data API v3.
 * - Maps the raw video data using `createYoutubeVideoObject`.
 * - Updates `state.search.videos` and saves to localStorage.
 *
 * @param {string} query - The search term to query YouTube.
 * @returns {Promise<void>} A promise that resolves after the state and cache are updated.
 */ export const loadYoutubeVideos = async query => {
  const ytKey = `youtube_search_${encodeURIComponent(query)}`;
  const cachedYT = loadFromLocalStorage(ytKey);

  if (cachedYT) {
    state.search.query = query;
    state.search.videos = cachedYT;
    return;
  }

  try {
    const res = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query
      )}&type=video&maxResults=12&key=${YOUTUBE_API_KEY}`
    );
    const rawVidoes = res.data.items;
    const filteredVidoes = rawVidoes.map(createYoutubeVideoObject);

    state.search.query = query;
    state.search.videos = filteredVidoes;

    saveToLocalStorage(ytKey, filteredVidoes);
  } catch (err) {
    throw err;
  }
};

/**
 * Returns the movie object at the current index from a given array.
 *
 * @param {Array<Object>} arrayOfObjects - Array of movie objects.
 * @returns {Object} The movie at the current index stored in state.
 */
export const getCurrentMovie = arrayOfObjects => {
  return arrayOfObjects[state.currentMovieIndex];
};

/**
 * Move to the next movie in the topMovies list.
 * If it's already on the last movie, start again from the first.
 */
export const goToNextMovie = () => {
  state.currentMovieIndex =
    (state.currentMovieIndex + 1) % state.topMovies.length;
};
