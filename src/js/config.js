import { formatDate } from './helper';

const today = new Date();
const lastMonth = new Date();
lastMonth.setDate(today.getDate() - 30);

export const FROM = formatDate(lastMonth);
export const TO = formatDate(today);
export const TMDB_API_KEY = process.env.PARCEL_TMDB_API_KEY;
export const YOUTUBE_API_KEY = process.env.PARCEL_YOUTUBE_API_KEY;
export const GET_MOVIE_DETAILS_URL = `https://api.themoviedb.org/3/movie/`;
export const GET_MOVIE_VIDEO_URL = `${GET_MOVIE_DETAILS_URL}550/videos?api_key=${TMDB_API_KEY}&language=en-US`;
export const TOP_MOVIES_URL = `${GET_MOVIE_DETAILS_URL}top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
export const TRENDING_MOVIES_URL = `https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
export const UPCOMING_MOVIES_URL = `${GET_MOVIE_DETAILS_URL}upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
export const UNDERRATED_MOVIES_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28&language=en-US&page=1`;

export const NEWLY_REALEASED_MOVIES_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&primary_release_date.gte=${FROM}&primary_release_date.lte=${TO}&sort_by=primary_release_date.desc&vote_count.gte=10&language=en-US&page=1`;

export const RECOMMENDED_MOVIES_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&vote_average.gte=7.5&vote_count.gte=1000&language=en-US&page=1`;
