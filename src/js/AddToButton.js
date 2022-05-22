import { REF } from './Header/HeaderRefs';
import LocalStorageApi from './localStorageAPI';
import { singleHeaderController as header } from './Header/HeaderController';
import TabController from './Header/TabContorller';

const TEXT_ADD_TO = 'add to';
const TEXT_REMOVE_FROM = 'remove from';
const dbFieldName = {
  WATCHED: 'watched',
  QUEUE: 'queue',
};

// const buttonWatched = document.querySelector('[data-button="watched"]');
// const buttonQueue = document.querySelector('[data-button="queue"]');

const LocalStorage = new LocalStorageApi();

export function composeButtonText(movieID, storageName) {
  // console.log(movieID, storageName);
  return isMovieAlreadyStored(movieID, storageName)
    ? `${TEXT_REMOVE_FROM} ${storageName}`
    : `${TEXT_ADD_TO} ${storageName}`;
}

export function changeButtonText() {
  this.innerText = composeButtonText(Number(this.dataset.movieId), this.dataset.button);
}

function isMovieAlreadyStored(movieID, storageName) {
  //special case... not good at all. it works only for two buttons
  let isStored = null;
  if (storageName === dbFieldName.QUEUE) {
    isStored = LocalStorage.getFromQueue().find(movie => movie.id === movieID) ? true : false;
  }
  if (storageName === dbFieldName.WATCHED) {
    isStored = LocalStorage.getFromWatched().find(movie => movie.id === movieID) ? true : false;
  }
  // console.log(isStored);

  return isStored;
}

export function isThisTabActive(tabName) {
  return tabName === REF.LIBRARY.dataset.activeTab ? true : false;
}

export function willLibraryCollectionUpdated(buttonType) {
  return buttonType === REF.LIBRARY.dataset.activeTab;
}

export function showLibraryCollectionUpdates(activeTab = 'queue') {
  // console.log(header);
  header.updateControls(new TabController(REF.CONTAINER));
  if (activeTab === 'watched') {
    header.controller.switchToActiveTab(header.controller.watchedTab);
  }
}
