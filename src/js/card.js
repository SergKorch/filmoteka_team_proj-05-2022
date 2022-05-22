//  backdrop_path  original_title release_date   genres (array[objects])
import Pagination from './Pagination/dist_p/tui-pagination';
import FilmsApiService from './fetch';
import {
  formatGenresData,
  formatReleaseYearData,
  formatNumericalToFixed,
  formatConvertedGenres,
} from './Header/InfoFormatter';
import defaultImage from '../images/defaultImage.jpg';
import { onLoadSpinner, offLoadSpinner } from './spinner';
import { buildPagination, buildPaginationSection, firstPage } from './pagination';
import { Notify } from 'notiflix';

const refs = {
  buildFilmGallery: document.querySelector('.buildFilmGallery'),
  filmsGalleyDiv: document.querySelector('.main-gallery-lisnichyi'),
  GenresArray: [],
};

const ROUT = { POSTER: 'https://image.tmdb.org/t/p/' };

localStorage.setItem('GenresArray', JSON.stringify(refs.GenresArray));

const filmsApiService = new FilmsApiService();

window.onload = () => {
  if ((refs.GenresArray = [])) {
    filmsApiService.Genres();
  }

  if (document.querySelector('.main-gallery-lisnichyi').textContent === '') {
    // console.log('FIRST LOAD');
    onLoadSpinner();

    filmsApiService
      .fetchArticles()
      .then(res => {
        makeFilmCard(res);
        buildPaginationSection(res);
      })
      .catch(error => {
        console.log(error);
        return;
      })
      .finally(offLoadSpinner());
  }
};

export function onClick(event) {
  event.preventDefault();
  let stringToSend = '';
  // console.log(event.type);
  if (event.type === 'submit') {
    stringToSend = event.currentTarget.elements.searchFilm.value;
    // console.log('Проверяем', stringToSend);
  }

  document.querySelector('.main-gallery-lisnichyi').innerHTML = '';
  onLoadSpinner();
  filmsApiService
    .fetchArticles(stringToSend)
    .then(res => {
      if (res.data.results.length === 0) {
        Notify.info('Nothing found!');
      }
      return res;
    })
    .then(res => {
      makeFilmCard(res);
      buildPaginationSection(res, stringToSend);
    })
    .catch(error => {
      console.log(error);
      return;
    })
    .finally(offLoadSpinner());
}

export function makeFilmCard(films) {
  const markup = films.data.results
    .map(({ poster_path, original_title, title, release_date, genre_ids, id, vote_average }) => {
      const pathToSmallerImage = poster_path ? ROUT.POSTER + 'w342' + poster_path : defaultImage;
      const pathToLargerImage = poster_path ? ROUT.POSTER + 'w500' + poster_path : defaultImage;
      return `
        <li class="card__container js-card"  data-movie-id ="${id}">
          <img
            class="card__picture"
            src="${pathToSmallerImage}"
            srcset="${pathToSmallerImage} 1x,
                    ${pathToLargerImage} 2x"
            alt="${title} poster"
          /> 
          <p class="card__title"><span class="card__title--name"> ${title}</span>
            <span class="card__title--genres">${formatConvertedGenres(
              genre_ids,
            )}&nbsp|&nbsp ${formatReleaseYearData(release_date)}
              <span class="card__filmRaiting"> ${formatNumericalToFixed(vote_average)}</span>
            </span>
          </p>
        </li>`;
    })
    .join('');
  refs.filmsGalleyDiv.insertAdjacentHTML('beforeend', markup);
}
