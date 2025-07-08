import '../styles/index.css';
import 'normalize.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import * as model from './model.js';
import { state, getMovieDetails, loadFromLocalStorage } from './helper.js';
import heroView from './views/heroView.js';
import trendingMoviesView from './views/trendingMoviesView.js';
import upcomingMoviesView from './views/upcomingMoviesView.js';
import productionLogosView from './views/productionLogosView.js';
import underratedMoviesView from './views/underratedMoviesView.js';
import newlyReleasedMoviesView from './views/newlyReleasedMoviesView.js';
import topRatedMoviesView from './views/topRatedMoviesView.js';
import recommendedMoviesView from './views/recommendedMoviesView.js';
import youtubeVideosView from './views/youtubeVideosView.js';
import tmdbVideosView from './views/tmdbVideosView.js';
import searchView from './views/searchView.js';
import headerView from './views/headerView.js';
import movieView from './views/movieView.js';
import trailerView from './views/trailerView.js';
import castView from './views/castView.js';
import similarMoviesView from './views/similarMoviesView.js';
import continueWatchingView from './views/continueWatchingView.js';
import watchlistMoviesView from './views/watchlistMoviesView.js';
import aboutView from './views/aboutView.js';

/////////////////////////////////////////////////////////////////////////////////////////////////
//////////////      START APPLICATION    ///////////  ENGINE ROOM 😅 /////////
///////////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener('DOMContentLoaded', function () {
  init();
});

const init = () => {
  const page = document.body.id;

  if (page === 'home') initHomePage();
  if (page === 'movie') initMoviePage();
  if (page === 'watchList') initWatchlistPage();
  if (page === 'about') initAboutPage();
};

//////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
// Home page controller Functions //
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
/////////////// Control Footer //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
const controlFooterYear = () => {
  const year = document.querySelector('.year');
  year.textContent = new Date().getFullYear();
};

////////////////////////////////////////////////////////////////////////////////
/////////////// Control Header //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
const controlStickyHeader = () => {
  headerView.viewObserver();
  headerView.addHeaderMenuToggle();
};

////////////////////////////////////////////////////////////////////////////////
///////////////   Control Hero UI Updates   /////////////////////////////
//////////////////////////////////////////////////////////////////////////////
const controlHeroUpdate = async () => {
  await model.fetchTopRatedMovies();

  const movie = model.getCurrentMovie(state.topMovies);

  heroView.updateHeroBackground(movie.backdrop);
  heroView.render(movie);
};

////////////////////////////////////////////////////////////////////////////////
//////////   Control Rotate of the Hero movie Details   //////////////
//////////////////////////////////////////////////////////////////////////////
const rotateHero = () => {
  setInterval(async () => {
    model.goToNextMovie();
    await controlHeroUpdate();
  }, 8000);
};

////////////////////////////////////////////////////////////////////////////////
///////////////   Control Hero ADD to Watchlist    /////////////////////
//////////////////////////////////////////////////////////////////////////////
const controlHeroAddToWatchList = () => {
  const handleWatchList = movie => {
    const added = model.addMovieObjectToWatchlist(movie);

    if (!added) {
      heroView.renderMessage('⚠️ Movie already in Watchlist', 'info');
    } else {
      heroView.renderMessage(' Added to your Watchlist', 'success');
    }
  };

  heroView.addHandlerToAddWatchlist(handleWatchList);
};

////////////////////////////////////////////////////////////////////////////////
///////////////  Control Trending Movies   /////////////////////////////
//////////////////////////////////////////////////////////////////////////////
const controlTrendingMovies = async () => {
  trendingMoviesView.renderSkeletonLoader();
  await new Promise(res => setTimeout(res, 400));

  await model.fetchTrendingMovies();

  trendingMoviesView.render(state.trendingMovies);
};

////////////////////////////////////////////////////////////////////////////////
///////////////  Control Upcoming Movies  ////////////////////////////
//////////////////////////////////////////////////////////////////////////////
const controlUpcomingMovies = async () => {
  upcomingMoviesView.renderSkeletonLoader();
  await new Promise(res => setTimeout(res, 400));

  await model.fetchUpcomingMovies();

  upcomingMoviesView.render(state.upcomingMovies);
};

////////////////////////////////////////////////////////////////////////////////
////////////   Control Production logos auto-Rotate  ////////////
//////////////////////////////////////////////////////////////////////////////
const controlProductionLogos = async () => {
  productionLogosView.render(state.productionLogos);
};

////////////////////////////////////////////////////////////////////////////////
/////////////// Control Underrated (Gems) Movies   /////////////////////////////
//////////////////////////////////////////////////////////////////////////////
const controlUnderratedMovies = async () => {
  underratedMoviesView.renderSkeletonLoader();
  await new Promise(res => setTimeout(res, 400));

  await model.fetchUnderratedMovies();

  underratedMoviesView.render(state.underratedMovies);
  underratedMoviesView.setUpSwiper();
};

////////////////////////////////////////////////////////////////////////////////
/////////////// Control Saerch Results  /////////////////////////////
//////////////////////////////////////////////////////////////////////////////
const controlSearchresults = async query => {
  tmdbVideosView.renderSkeletonLoader();
  await new Promise(res => setTimeout(res, 400));
  await model.loadSearchedResults(query);

  youtubeVideosView.renderSkeletonLoader();
  await new Promise(res => setTimeout(res, 400));
  await model.loadYoutubeVideos(query);

  tmdbVideosView.render(state.search.results);
  youtubeVideosView.render(state.search.videos);
};

////////////////////////////////////////////////////////////////////////////////
/////////////// Control Continue Watching Movies  /////////////////////////////
//////////////////////////////////////////////////////////////////////////////
const controlContinueWatchingMovies = async () => {
  continueWatchingView.renderSkeletonLoader();

  const cached = loadFromLocalStorage('continueWatching');
  if (Array.isArray(cached)) {
    state.continueWatchingMovies = cached;
  }

  const movies = state.continueWatchingMovies;
  if (!movies?.length) return;

  continueWatchingView.render(movies);
  continueWatchingView.setUpSwiper();
};

////////////////////////////////////////////////////////////////////////////////
/////////////// Control Newly Resleased Movies  /////////////////////////////
//////////////////////////////////////////////////////////////////////////////
const controlNewlyReleasedMovies = async () => {
  newlyReleasedMoviesView.renderSkeletonLoader();
  await new Promise(res => setTimeout(res, 400));

  await model.fetchNewlyReleasedMovies();

  newlyReleasedMoviesView.render(state.newlyReleasedMovies);
  newlyReleasedMoviesView.setUpSwiper();
};

////////////////////////////////////////////////////////////////////////////////
/////////////// Control Top Rated Movies  /////////////////////////////
//////////////////////////////////////////////////////////////////////////////
const controlTopRatedMovies = async () => {
  topRatedMoviesView.renderSkeletonLoader();
  await new Promise(res => setTimeout(res, 400));

  await model.fetchTopRatedMovies();

  topRatedMoviesView.render(state.topMovies);
  topRatedMoviesView.setUpSwiper();
};

////////////////////////////////////////////////////////////////////////////////
/////////////// Control Recommended Movies  /////////////////////////////
//////////////////////////////////////////////////////////////////////////////
const controlRecommendedMovies = async () => {
  recommendedMoviesView.renderSkeletonLoader();
  await new Promise(res => setTimeout(res, 400));

  await model.fetchRecommendedMovies();

  recommendedMoviesView.render(state.recommendedMovies);
  recommendedMoviesView.setUpSwiper();
};

////////////////////////////////////////////////////////////////////////////////
/////////////// Home.html Page Initialization  /////////////////////////////
//////////////////////////////////////////////////////////////////////////////
const initHomePage = async () => {
  controlFooterYear();
  controlStickyHeader();

  await controlHeroUpdate();
  rotateHero();
  controlHeroAddToWatchList();

  await controlTrendingMovies();
  await controlUpcomingMovies();
  await controlProductionLogos();
  await controlUnderratedMovies();

  searchView.addHandlerSearch(controlSearchresults);

  controlContinueWatchingMovies();

  await controlNewlyReleasedMovies();
  await controlTopRatedMovies();
  await controlRecommendedMovies();

  ///////////////////////////////////////////////////////////////////////////////////////
  ////// Handling the click Event and Navigation to Movie.html /////
  ///////////////////////////////////////////////////////////////////////////////////
  heroView.addHandlerCardClick(controlCardClick);
  trendingMoviesView.addHandlerCardClick(controlCardClick);
  newlyReleasedMoviesView.addHandlerCardClick(controlCardClick);
  recommendedMoviesView.addHandlerCardClick(controlCardClick);
  youtubeVideosView.addHandlerCardClick(controlCardClick);
  tmdbVideosView.addHandlerCardClick(controlCardClick);
  topRatedMoviesView.addHandlerCardClick(controlCardClick);
  underratedMoviesView.addHandlerCardClick(controlCardClick);
  underratedMoviesView.addHandlerCardClick(controlCardClick);
  upcomingMoviesView.addHandlerCardClick(controlCardClick);
  continueWatchingView.addHandlerCardClick(controlCardClick);
};

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////   Movie.html page controller Functions  ///////////////
///////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
///////////////  Controls CardClick used Globally  /////////////////////////////
//////////////////////////////////////////////////////////////////////////////
const controlCardClick = (id, type) => {
  window.location.href = `movie.html?id=${id}&type=${type}`;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////  Controls Search results CardClick On Movie.html /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
const controlMovieOverviewSearchResultsCardClick = (id, type) => {
  if (type !== 'tmdb' && type !== 'youtube') return;

  if (type === 'tmdb') {
    window.location.href = `${window.location.pathname}?id=${id}&type=${type}`;

    controlMovieOverview(id);
  } else if (type === 'youtube') {
    controlYoutubeVideo(id, type);
  }
};

////////////////////////////////////////////////////////////////////////////////
/////////////// Controls MovieOverView ON Movie.html  /////////////////////////////
//////////////////////////////////////////////////////////////////////////////
const controlMovieOverview = async movieID => {
  const id = movieID || new URLSearchParams(window.location.search).get('id');
  if (!id) return;

  state.movieID = id;

  movieView.renderSpinner();
  await new Promise(res => setTimeout(res, 400));

  await getMovieDetails(id);
  await model.getMovieVideos(id);
  await model.getMovieCast(id);

  similarMoviesView.renderSkeletonLoader();
  await new Promise(res => setTimeout(res, 400));

  await model.getSimilarMovies(id);

  movieView.render(state.movie);
  castView.render(state.cast);

  similarMoviesView.render(state.similarMovies);

  trailerView.addPlayTrailerHandler(state.video);
  trailerView.addCloseHandler();
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////// Controls MovieOverView Add to watchlist ON Movie.html  /////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const controlMoviesOverviewAddToWatchList = () => {
  const handleWatchList = movie => {
    loadFromLocalStorage();
    const added = model.addMovieObjectToWatchlist(movie);

    if (!added) {
      movieView.renderMessage('⚠️ Movie already in Watchlist', 'info');
    } else {
      movieView.renderMessage(' Added to your Watchlist', 'success');
    }
  };

  movieView.addHandlerToAddWatchlist(handleWatchList);
};

////////////////////////////////////////////////////////////////////////////////
/////////////// Controls Similar Movies ON Movie.html  /////////////////////////////
//////////////////////////////////////////////////////////////////////////////
const controlSimilarMovies = () => {
  trailerView.addWatchHandler(async movieID => {
    try {
      await getMovieDetails(movieID);

      await model.getMovieVideos(movieID);

      if (state.video) {
        trailerView.playSimilarVideo(state.video);
        trailerView.addCloseHandler();
      } else {
        trailerView.renderMessage(
          '⚠️ Movie data not found. Unable to play.',
          'error'
        );
      }
    } catch (error) {
      throw err;
    }
  });
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////// Controls Simailar Movies Add to Watchlist ON Movie.html  /////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const controlSimilarMoviesAddToWatchList = () => {
  const handleWatchList = movie => {
    loadFromLocalStorage();
    const added = model.addMovieObjectToWatchlist(movie);

    if (!added) {
      similarMoviesView.renderMessage('⚠️ Movie already in Watchlist', 'info');
    } else {
      similarMoviesView.renderMessage(' Added to your Watchlist', 'success');
    }
  };

  similarMoviesView.addHandlerToAddWatchlist(handleWatchList);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////// Controls Youtube Modal Video Play ON Movie.html  /////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const controlYoutubeVideo = (movieID, movieType) => {
  const id = movieID || new URLSearchParams(window.location.search).get('id');
  const type =
    movieType || new URLSearchParams(window.location.search).get('type');
  if (!id) return;

  if (type === 'youtube') {
    state.videoID = id;
    trailerView.playYouTubeSearchResult(state.videoID);
    trailerView.addYoutubeCloseHandler();
  } else {
    return;
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////// Controls Video Trailer progress ON Movie.html  /////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
const controlTrailerProgress = () => {
  trailerView.setProgressHandler((id, currentTime, duration) => {
    model.trackAndUpdateWatchProgress(id, currentTime, duration);
  });
};

////////////////////////////////////////////////////////////////////////////////
/////////////// Movie.html Page Initialization  /////////////////////////////
//////////////////////////////////////////////////////////////////////////////
const initMoviePage = () => {
  controlFooterYear();

  controlStickyHeader();
  controlMovieOverview();
  controlMoviesOverviewAddToWatchList();

  controlSimilarMovies();
  controlSimilarMoviesAddToWatchList();

  controlYoutubeVideo();
  controlTrailerProgress();

  searchView.addHandlerSearch(controlSearchresults);

  tmdbVideosView.addHandlerCardClick(
    controlMovieOverviewSearchResultsCardClick
  );
  youtubeVideosView.addHandlerCardClick(
    controlMovieOverviewSearchResultsCardClick
  );
};

//////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////   watchlist.html page controller Functions   //////////////////
//////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
/////////////// Controls Watchlist Movies ON watchlist.html  /////////////////////////////
//////////////////////////////////////////////////////////////////////////////
const controlRenderOfWatchlistMovies = async () => {
  watchlistMoviesView.renderSkeletonLoader();
  await new Promise(res => setTimeout(res, 300));

  model.loadWatchlist();
  const movies = state.watchlistMovies;
  if (!movies?.length) return;

  watchlistMoviesView.render(movies);
};

////////////////////////////////////////////////////////////////////////////////
/////////////// Controls Remove of Watchlist ON watchlist.html  /////////////////////////////
//////////////////////////////////////////////////////////////////////////////
const controlRemoveWatchListMovies = () => {
  const handleWatchListRemove = movieID => {
    model.removeMovieFromWatchlist(movieID);
    watchlistMoviesView.render(state.watchlistMovies);

    watchlistMoviesView.renderMessage();
  };

  watchlistMoviesView.addHandlerToRemoveWatchlist(handleWatchListRemove);
};

////////////////////////////////////////////////////////////////////////////////
/////////////// Watchlist.html Page Initialization  /////////////////////////////
//////////////////////////////////////////////////////////////////////////////
const initWatchlistPage = () => {
  controlFooterYear();

  controlStickyHeader();
  controlRenderOfWatchlistMovies();
  controlRemoveWatchListMovies();

  watchlistMoviesView.addHandlerCardClick(controlCardClick);

  searchView.addHandlerSearch(controlSearchresults);

  tmdbVideosView.addHandlerCardClick(controlCardClick);
  youtubeVideosView.addHandlerCardClick(controlCardClick);
};

////////////////////////////////////////////////////////////////////////////////
/////////////// about.html Page Initialization  /////////////////////////////
//////////////////////////////////////////////////////////////////////////////
const controlAboutContent = async () => {
  aboutView.renderSpinner();
  await new Promise(res => setTimeout(res, 400));
  aboutView.loadAboutContent();
};

const initAboutPage = () => {
  controlFooterYear();

  controlStickyHeader();
  controlAboutContent();

  aboutView.addHandlerCardClick(controlCardClick);

  searchView.addHandlerSearch(controlSearchresults);

  tmdbVideosView.addHandlerCardClick(controlCardClick);
  youtubeVideosView.addHandlerCardClick(controlCardClick);
};
