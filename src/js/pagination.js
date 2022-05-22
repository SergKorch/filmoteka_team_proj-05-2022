import Pagination from './Pagination/dist_p/tui-pagination';
import { API_KEY, QUERY_VALUE } from './fetch';
import { onLoadSpinner, offLoadSpinner } from './spinner';
import { refs, makeFilmCard } from './card';
import axios from 'axios';
import { shownMovieCollectionData } from '../js/Header/CollectionController';
var debounce = require('lodash.debounce');
let lastPage;
let totalPagesOn;
let itemsPages;

// построение пагинации
export let buildPagination;
function newOptionsPagination(last, totalPagesOn, itemsPages) {
  buildPagination = new Pagination('pagination-container', {
    totalItems: totalPagesOn,
    itemsPerPage: itemsPages,
    visiblePages: 5,
    centerAlign: true,
    template: {
      page: '<a href="#" class="tui-page-btn">{{page}}</a>',
      currentPage: '<span class="tui-page-btn tui-is-selected">{{page}}</span>',
      moveButton: ({ type }) => {
        lastPage = last;
        let template = ' ';
        if (type === 'next') {
          template =
            '<a href="#" class="tui-page-btn tui-next">' +
            '<span class="tui-ico-next"></span>' +
            '</a>';
        }

        if (type === 'prev') {
          template =
            '<a href="#" class="tui-page-btn tui-prev">' +
            '<span class="tui-ico-prev"></span>' +
            '</a>';
        }

        if (type === 'last') {
          template = `<a data-type="last" class="inner-page-number">${lastPage}</a>`;
        }
        if (type === 'first') {
          template = `<a data-type="first" class="inner-page-number">1</a>`;
        }
        return template;
      },
    },
  });
}

function afterMovePaginationTranding(buildPagination) {
  buildPagination.on('afterMove', event => {
    const nextCurrentPage = event.page;
    document.querySelector('.main-gallery-lisnichyi').innerHTML = '';
    onLoadSpinner();
    raitingFilms(nextCurrentPage)
      .then(res => {
        makeFilmCard(res);
      })
      .catch(error => {
        console.log(error);
        return;
      })
      .finally(setTimeout(offLoadSpinner, 500));
  });
}
function afterMovePaginationSearch(buildPagination, searchFilmsName) {
  buildPagination.on('afterMove', event => {
    const nextCurrentPage = event.page;
    document.querySelector('.main-gallery-lisnichyi').innerHTML = '';
    onLoadSpinner();
    searchFilms(nextCurrentPage, searchFilmsName)
      .then(makeFilmCard)
      .catch(error => {
        console.log(error);
        return;
      })
      .finally(setTimeout(offLoadSpinner, 500));
  });
}

function raitingFilms(nextCurrentPage) {
  return axios.get(
    `https://api.themoviedb.org/3/trending/movie/day${API_KEY}&page=${nextCurrentPage}`,
  );
}
function searchFilms(nextCurrentPage, searchFilmsName) {
  return axios.get(
    `https://api.themoviedb.org/3/search/movie${API_KEY}&query=${searchFilmsName}&page=${nextCurrentPage}`,
  );
}

// получения обьектов
export function buildPaginationSection(total, stringToSend) {
  document.querySelector('#pagination-container').innerHTML = '';
  totalPagesOn = total.data.total_results;
  lastPage = total.data.total_pages;
  itemsPages = 20;
  if (
    stringToSend === '' ||
    stringToSend === null ||
    stringToSend === false ||
    stringToSend === undefined
  ) {
    if (totalPagesOn <= 20) {
      return;
    }
    newOptionsPagination(lastPage, totalPagesOn, itemsPages);
    afterMovePaginationTranding(buildPagination);
  } else {
    if (totalPagesOn <= 20) {
      return;
    }
    newOptionsPagination(lastPage, totalPagesOn, itemsPages);
    afterMovePaginationSearch(buildPagination, stringToSend);
  }
}

export function buildPaginationLibrary(total) {
  document.querySelector('#pagination-container').innerHTML = '';
  let cardTotalP;
  if (window.innerWidth <= 768) {
    cardTotalP = 4;
  } else if (window.innerWidth > 769 && window.innerWidth <= 1023) {
    cardTotalP = 8;
  } else {
    cardTotalP = 9;
  }

  totalPagesOn = total.length;
  itemsPages = cardTotalP;
  lastPage = Math.ceil(totalPagesOn / itemsPages);
  if (totalPagesOn <= cardTotalP) {
    return;
  }
  newOptionsPagination(lastPage, totalPagesOn, itemsPages);
  window.addEventListener(
    'resize',
    debounce(function () {
      if (window.matchMedia('(max-width: 768px)').matches) {
        cardTotalP = 4;
        lastPage = Math.ceil(totalPagesOn / cardTotalP);
        newOptionsPagination(lastPage, totalPagesOn, cardTotalP);
        return cardTotalP;
      } else if (
        window.matchMedia('(max-width: 1023px)').matches &&
        window.matchMedia('(min-width: 769px)').matches
      ) {
        cardTotalP = 8;
        lastPage = Math.ceil(totalPagesOn / cardTotalP);
        newOptionsPagination(lastPage, totalPagesOn, cardTotalP);
        return cardTotalP;
      } else {
        cardTotalP = 9;
        lastPage = Math.ceil(totalPagesOn / cardTotalP);
        newOptionsPagination(lastPage, totalPagesOn, cardTotalP);
        return cardTotalP;
      }
    }, 100),
  );
}
