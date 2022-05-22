import { isTheSameReferenceElement, onSearchSubmit } from './HeaderEventHandlers';
import { searchForm } from './HeaderMarkup';
import { REF } from './HeaderRefs';

// const SEARCH_REF = document.querySelector('#search-form');

class SearchController {
  constructor(parentContainer) {
    this.parentContainer = parentContainer;
    this.headerPageElement = REF.HOME;
    this.controllerMarkup = searchForm;
    this.onSearchSubmit = onSearchSubmit.bind(this);
  }

  getVisibleReferences() {
    this.searchForm = document.querySelector('#search-form');
  }

  showInParentContainer() {
    this.parentContainer.insertAdjacentHTML('afterbegin', this.controllerMarkup());
    document.querySelector('.header').classList.remove('header-library-background');
    document.querySelector('.header').classList.add('header-original-background');
  }

  removeFromParentContainer() {
    this.removeSubmitHandler();
    this.searchForm = null;
    this.onSearchSubmit = null;
  }

  addControllerHandlers() {
    this.searchForm.addEventListener('submit', this.onSearchSubmit);
  }

  removeSubmitHandler() {
    this.searchForm.removeEventListener('submit', this.onSearchSubmit);
    this.onSubmit = null;
  }
}

export default SearchController;
