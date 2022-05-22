export function libraryTabs() {
  return `
     <ul class="library-tabs">
        <li class="library-tab">
          <a class="tab-watched" href="#" role="button" data-tab="watched">watched</a></li>
        <li class="library-tab">
          <a class="tab-queue tab-active" href="#" role="button" data-tab="queue">queue</a>
        </li>
      </ul>
    `;
}

export function searchForm() {
  return `
    <form class="search-form" id="search-form" autocomplete="off">
      <input class="search-input" type="text" name="searchFilm" placeholder="Пошук фільмів" />
      <button class="btn-search" type="submit" width="12" height="12">
        <svg class="btn-search-icon" width="12" height="12">
          <use href="./images/bg-header/search.svg"></use>
        </svg>
      </button>
    </form>
    `;
}

export function controlsError() {
  return '<h2 style="color: tomato; text-align: center">OOPS! Controls should be there.</h2>';
}
