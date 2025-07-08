import axios from 'axios';

import { TMDB_API_KEY, GET_MOVIE_DETAILS_URL } from './config';

export const formatDate = date => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const state = {
  videoID: null,
  movieID: null,
  selectedMovie: null,

  movie: {},
  video: {},

  search: {
    query: '',
    results: [],
    videos: [],
  },

  cast: [],
  topMovies: [],
  similarMovies: [],
  trendingMovies: [],
  upcomingMovies: [],
  productionLogos: [],
  underratedMovies: [],
  newlyReleasedMovies: [],
  recommendedMovies: [],
  continueWatchingMovies: [],
  watchlistMovies: [],

  currentMovieIndex: 0,
  hasFetched: false,
};

/**
 * Formats a raw movie object into a consistent structure for the app.
 *
 * @param {Object} movie - The raw movie data from TMDB API.
 * @returns {Object} A formatted movie object with selected and renamed properties.
 */
export const createmovieObject = movie => {
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    poster: movie.poster_path,
    backdrop: movie.backdrop_path,
    date: movie.release_date,
    popularity: movie.popularity,
    rating: movie.vote_average,
    runtime: movie.runtime,
    productionLogos: movie.productionLogos,
    genres: movie.genres?.map(g => g.name),
    type: movie.media_type,
  };
};

/**
 * Formats a raw YouTube video object into a simplified structure for the app.
 *
 * @param {Object} video - The raw video data from the YouTube API.
 * @returns {Object} A formatted video object with key information used in the UI.
 */
export const createYoutubeVideoObject = video => {
  return {
    id: video.id.videoId,
    title: video.snippet.title,
    description: video.snippet.description,
    thumbnail: video.snippet.thumbnails.medium.url,
    channelTitle: video.snippet.channelTitle,
    publishDate: video.snippet.publishedAt,
    videoUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`,
    liveBroadcastContent: video.snippet.liveBroadcastContent,
  };
};

/**
 * Saves data to localStorage with a timestamp.
 *
 * @param {string} key - The key to store the data under.
 * @param {*} data - The data to store (will be stringified).
 */
export const saveToLocalStorage = (key, data) => {
  const cacheItem = {
    data,
    savedAt: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(cacheItem));
};

/**
 * Loads data from localStorage if it's still fresh.
 *
 * @param {string} key - The key under which the data is stored.
 * @param {number} [maxAgeInHours=6] - Max allowed age for the cache in hours.
 * @returns {*} The parsed data if valid, or null if expired or not found.
 */
export const loadFromLocalStorage = (key, maxAgeInHours = 6) => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  try {
    const cacheItem = JSON.parse(cached);
    const isValidCache =
      Date.now() - cacheItem.savedAt < maxAgeInHours * 60 * 60 * 1000;

    if (!isValidCache) {
      localStorage.removeItem(key);
      return null;
    }

    return cacheItem.data;
  } catch (err) {
    localStorage.removeItem(key);
    return null;
  }
};

/**
 * Checks if a TMDB movie object has the required valid properties.
 *
 * @param {Object} movie - The movie object to validate.
 * @returns {boolean} True if the movie is valid; otherwise, false.
 */
export function isValidTmdbMovie(movie) {
  return (
    movie &&
    movie.poster &&
    movie.poster !== 'null' &&
    movie.title &&
    typeof movie.rating === 'number' &&
    movie.rating > 0
  );
}

/**
 * Fetches detailed information for a specific movie from TMDB API
 * and updates the global state.
 *
 * @param {string|number} movieId - The ID of the movie to fetch.
 * @returns {Promise<Object>} The detailed movie data from TMDB.
 * @throws Will throw an error if the API call fails.
 */
export const getMovieDetails = async movieId => {
  try {
    const res = await axios.get(
      `${GET_MOVIE_DETAILS_URL}${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    state.movie = res.data;
    return res.data;
  } catch (err) {
    throw err;
  }
};

// To get full  details for all movies
export const getFullDetailsForAll = movies =>
  Promise.all(movies.map(movie => getMovieDetails(movie.id)));

//  Get full Details for multiple search
export const getFullDetailsForMultiSearch = async movies =>
  Promise.all(movies.map(movie => getMultiSearchDetails(movie)));

/**
 * Fetches detailed information for a movie or TV show from TMDB based on its media type.
 *
 * @param {Object} movies - An object containing `id` and `media_type` ("movie" or "tv").
 * @returns {Promise<Object|null>} The detailed movie/TV data from TMDB, or null if failed.
 */
export const getMultiSearchDetails = async movies => {
  try {
    const { id, media_type } = movies;

    if (!id || !media_type) throw new Error('Missing ID or media type');

    const endpoint =
      media_type === 'movie'
        ? `https://api.themoviedb.org/3/movie/${id}`
        : media_type === 'tv'
        ? `https://api.themoviedb.org/3/tv/${id}`
        : null;

    if (!endpoint) throw new Error(`Unsupported media type: ${media_type}`);

    const res = await axios.get(
      `${endpoint}?api_key=${TMDB_API_KEY}&language=en-US`
    );

    return res.data;
  } catch (err) {
    return null;
  }
};
