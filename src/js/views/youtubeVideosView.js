import View from './view';

class YoutubeVideosView extends View {
  _parentElement = document.getElementById('youtube-search-results-container');

  /**
   * Generates the HTML markup for rendering the view's specific content.
   * This method is used internally by the parent `render()` method to inject
   * dynamic content into the DOM.
   *
   * @returns {string} - HTML string to be rendered in the view.
   */
  _generateMarkup() {
    return this._data
      .map(video => {
        return `<div class=" w-full max-w-[400px] mx-auto rounded-lg shadow-md overflow-hidden cursor-pointer hover:scale-105 transition-transform bg-gray-800 movie-card " data-id="${
          video.id
        }" data-type="youtube">
                  <a
                    href="https://www.youtube.com/watch?v=${video.id}"
                    target="_blank"
                    rel="noopener noreferrer" 
                  >
                    <img
                      src="${video.thumbnail}"
                      alt="${video.title} Thumbnail"
                      class="w-full h-64 object-cover object-center"
                    />
                  </a>
                  <div class="p-4 flex flex-col text-white">
                    <h3
                      class="text-lg font-semibold mb-2 truncate"
                      title="${video.title}"
                    >
                      ${video.title}
                    </h3>
                    <div
                      class="flex justify-between text-base text-gray-400 mb-2"
                    >
                      <span class"truncate">${video.channelTitle}</span>
                      <span
                        >${new Date(video.publishDate).toLocaleDateString(
                          undefined,
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }
                        )}</span
                      >
                    </div>
                    ${
                      video.isLive
                        ? `<span
                      class="text-red-500 text-sm font-semibold"
                      >LIVE</span
                    >`
                        : `<span class="text-gray-500 text-sm">Video</span>`
                    }
                  </div>
                </div>`;
      })
      .join('');
  }
}

export default new YoutubeVideosView();
