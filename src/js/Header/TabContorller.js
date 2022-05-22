import { onSwitchTab } from './HeaderEventHandlers';
import { isTheSameReferenceElement } from './HeaderEventHandlers';
import LocalStorageApi from '../localStorageAPI';
import { libraryTabs } from './HeaderMarkup';
import { showMoievsCollectionOnPage } from './CollectionController';
import { MOVIE_GALLERY_REF, REF } from './HeaderRefs';

// const WATCHED_REF = document.querySelector('.tab-watched');
// const QUEUE_REF = document.querySelector('.tab-queue');

const LS = new LocalStorageApi();

class TabController {
  constructor(parentContainer) {
    this.parentContainer = parentContainer;
    this.headerPageElement = REF.LIBRARY;
    this.controllerMarkup = libraryTabs;
    this.onSwitchTab = onSwitchTab.bind(this);
  }

  getVisibleReferences() {
    this.watchedTab = document.querySelector('.tab-watched');
    this.queueTab = document.querySelector('.tab-queue');
    this.activeTab = this.queueTab;
    this.headerPageElement.dataset.activeTab = this.activeTab.dataset.tab;
    this.fetchMyLibraryDataAndRender();
  }

  showInParentContainer() {
    this.parentContainer.insertAdjacentHTML('afterbegin', this.controllerMarkup());
    document.querySelector('.header').classList.remove('header-original-background');
    document.querySelector('.header').classList.add('header-library-background');
  }

  removeFromParentContainer() {
    this.removeSwitchTabHandlers();
    this.watchedTab = null;
    this.queueTab = null;
    this.activeTab = null;
    this.onSwitchTab = null;
    this.headerPageElement.dataset.activeTab = '';
  }

  addControllerHandlers() {
    this.watchedTab.addEventListener('click', this.onSwitchTab);
    this.queueTab.addEventListener('click', this.onSwitchTab);
  }

  removeSwitchTabHandlers() {
    this.watchedTab.removeEventListener('click', this.onSwitchTab);
    this.queueTab.removeEventListener('click', this.onSwitchTab);
  }

  switchToActiveTab(tab) {
    !isTheSameReferenceElement(this.activeTab, tab) && this.setActiveTab(tab);
  }

  setActiveTab(tab) {
    this.activeTab.classList.remove('tab-active');
    this.activeTab = tab;
    this.activeTab.classList.add('tab-active');
    this.headerPageElement.dataset.activeTab = this.activeTab.dataset.tab;
    this.fetchMyLibraryDataAndRender();
  }

  fetchMyLibraryDataAndRender() {
    const myLibraryData =
      this.activeTab.dataset.tab === 'queue' ? LS.getFromQueue() : LS.getFromWatched();
    // console.log(myLibraryData);
    showMoievsCollectionOnPage(myLibraryData, MOVIE_GALLERY_REF);
  }
}

export default TabController;
