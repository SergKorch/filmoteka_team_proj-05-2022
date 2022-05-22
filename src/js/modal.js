import FilmsApiService from './fetch';
import ourTeam from '../data/team.json';
import svg from '../images/sprite.svg';
import LocalStorageApi from './localStorageAPI.js';
import { formatGenresData } from './Header/InfoFormatter';
import {
  composeButtonText,
  changeButtonText,
  willLibraryCollectionUpdated,
  showLibraryCollectionUpdates,
} from './AddToButton';
import defaultImage from '../images/defaultImage.jpg';
import { showMoievsCollectionOnPage } from './Header/CollectionController';

import { REF } from './Header/HeaderRefs';

const ROUT = { POSTER: 'https://image.tmdb.org/t/p/' };

const filmsApiService = new FilmsApiService();
const localApiStorageInstance = new LocalStorageApi();
localApiStorageInstance.setStorage();

const dbFieldName = {
  WATCHED: 'watched',
  QUEUE: 'queue',
};

const cardContainer = document.querySelector('.main-gallery-lisnichyi');
cardContainer.addEventListener('click', onCardClick);

function onCardClick(e) {
  if (!e) {
    showModal();
    return;
  }
  if (e.target !== e.currentTarget) {
    // showModal(e.target.getAttribute('filmId'));
    const currentMovieID = e.target?.closest('.js-card')?.dataset?.movieId;
    if (!currentMovieID) return;
    showModal(currentMovieID);
  }
}

function showModal(filmId) {
  document.querySelector('.modal').classList.add('active');
  document.querySelector('.backdrop').classList.add('active');
  document.querySelector('.modal-close-btn').addEventListener('click', closeModal);
  document.querySelector('.backdrop').addEventListener('click', closeModal);
  document.addEventListener('keydown', onKeyPress);
  if (!filmId) {
    showTeamInfo();
    return;
  }
  filmsApiService
    .fetchFilmInfo(filmId)
    .then(showFilmInfo)
    .catch(error => {
      console.log(error);
      return;
    });
}

function closeModal(e) {
  e.type === 'keydown' && setAttributesToCloseModal();
  e.type === 'click' && wasModalBackdropeOrCloseButtonClicked(e) && setAttributesToCloseModal();
}

function setAttributesToCloseModal() {
  document.querySelector('.modal-thumb').innerHTML = null;
  document.querySelector('.modal').classList.remove('active');
  document.querySelector('.backdrop').classList.remove('active');
  document.querySelector('.modal-close-btn').removeEventListener('click', closeModal);
  document.querySelector('.backdrop').removeEventListener('click', closeModal);
  document.removeEventListener('keydown', onKeyPress);
  willLibraryCollectionUpdated('watched') && showLibraryCollectionUpdates('watched');
  willLibraryCollectionUpdated('queue') && showLibraryCollectionUpdates('queue');
}

function wasModalBackdropeOrCloseButtonClicked({ target }) {
  const { dataset } = target;
  return (
    dataset.modalBackdrop ||
    dataset.closeModalButton ||
    dataset.closeModalIcon ||
    dataset.closeModalUse
  );
}

function onKeyPress(e) {
  if (e.key === 'Escape') {
    closeModal(e);
  }
}

function showFilmInfo(filmInfo) {
  const {
    id,
    original_title,
    vote_average,
    vote_count,
    popularity,
    title,
    genres,
    overview,
    poster_path,
  } = filmInfo.data;

  // console.log(id);

  const pathToSmallerImage = poster_path ? ROUT.POSTER + 'w342' + poster_path : defaultImage;
  const pathToLargerImage = poster_path ? ROUT.POSTER + 'w500' + poster_path : defaultImage;

  localApiStorageInstance.saveToModal(filmInfo.data);

  const textQueue = composeButtonText(id, dbFieldName.QUEUE);
  const textWatched = composeButtonText(id, dbFieldName.WATCHED);

  const markup = `
    <div class="pictureThumb">
      <img
        class="film-picture"
         src="${pathToSmallerImage}"
         srcset="${pathToSmallerImage} 1x,
                 ${pathToLargerImage} 2x"
        loading="lazy"
      />
    </div>
    <div class="infoThumb">
      <h2 class="filmTitle">${title}</h2>
      <table class="infoStatistic">
      <tbody class="stat-data">
        <tr class="stat-row">
          <td class="statTitle">Vote / Votes</td>
          <td class="statData">
          <span class="statData"> <span class="spanAccent">${vote_average.toFixed(
            1,
          )}</span>&nbsp/<span class="span" >${vote_count}</span></td>
        </tr>
        <tr class="stat-row">
          <td class="statTitle">Popularity</td>
          <td class="statData">${popularity.toFixed(1)}</td>
        </tr>
        <tr class="stat-row">
          <td class="statTitle">Original Title</td>
          <td class="statData">${original_title.toUpperCase()}</td>
        </tr>
        <tr class="stat-row">
          <td class="statTitle">Genre</td>
          <td class="statData">${formatGenresData(genres)}</td>
        </tr>
      </tbody>
      </table>

      <h3 class="aboutTitle">ABOUT</h3>
      <p class="aboutText">${overview}</p>
      <div class="buttonThumb">
        <button type="button" class="modalButton" data-button="watched" data-movie-id="${id}">${textWatched}</button>
        <button type="button" class="modalButton" data-button="queue" data-movie-id="${id}">${textQueue}</button>
      </div>
    </div>`;

  document.querySelector('.modal-thumb').innerHTML = markup;
  const modalButtons = document
    .querySelector('.buttonThumb')
    .addEventListener('click', onModalButtonsClick);
}

function onModalButtonsClick(e) {
  e.stopPropagation();
  const filmFromModal = localApiStorageInstance.getFromModal();
  const { button } = e.target.dataset;
  // console.log(button);
  if (button === 'watched') {
    localApiStorageInstance.filmIsPresentInWatched(filmFromModal)
      ? localApiStorageInstance.deleteFromWatched(filmFromModal)
      : localApiStorageInstance.saveToWatched(filmFromModal);
    changeButtonText.call(e.target);
  }

  if (button === 'queue') {
    localApiStorageInstance.filmIsPresentQueue(filmFromModal)
      ? localApiStorageInstance.deleteFromQueue(filmFromModal)
      : localApiStorageInstance.saveToQueue(filmFromModal);
    changeButtonText.call(e.target);
  }
}

document.querySelector('.students-ref').addEventListener('click', () => onCardClick());

function showTeamInfo() {
  const m = ourTeam
    .map(({ name, position, photo, fb, tg, ld, gh }) => {
      return `
        <li class='team__cards-item'>
          <img class='team__member-photo' src='${photo}' alt='${name}' />
          <div class="team__member-wrapper">
            <div class="team__member-info">
              <h2 class="team__member-name">${name}</h2>
              <p class="team__member-position">${position}</p>
            </div>
            <ul class="link__icon-list">
            ${
              fb &&
              ` <li class="link__item">
                  <a href="${fb}" rel="noreferrer noopener" target="_blank">
                    <svg class="link__icon">
                      <use href="${svg}#facebook"></use>
                    </svg>
                  </a>
                </li>`
            }
            ${
              ld &&
              `<li class="link__item">
                  <a href='${ld}' rel="noreferrer noopener" target="_blank">
                  <svg class="link__icon">
                    <use href='${svg}#linkedin'></use>
                  </svg>
                  </a>
                </li>`
            }
            ${
              gh &&
              `<li class="link__item">
                <a href='${gh}' rel="noreferrer noopener" target="_blank">
                  <svg class="link__icon">
                    <use href='${svg}#github'></use>
                  </svg>
                </a>
              </li>`
            }
            ${
              tg &&
              `<li class="link__item">
                <a href='${tg}' rel="noreferrer noopener" target="_blank">
                  <svg class="link__icon">
                    <use href='${svg}#telegram'></use>
                  </svg>
                </a>
              </li>`
            }
            </ul>
            </div>
          </li>`;
    })
    .join('');

  document.querySelector('.modal-thumb').innerHTML = `
    <div class="team__wrapper">
      <h2 class="team__title">Great thanks to our team</h2> 
      <ul class="team__cards-list">${m}</ul>
    </div>`;
}
