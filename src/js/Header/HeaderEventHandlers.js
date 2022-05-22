import Notiflix from 'notiflix';
import { onClick } from '../card.js';

export function onClickStatic(event) {
  const { currentTarget: clickedButton } = event;
  if (isTheSameReferenceElement(this.homeButton, clickedButton)) {
    this.updateToSearchControls();
    onClick(event);
  }
  isTheSameReferenceElement(this.myLibraryButton, clickedButton) &&
    this.updateToMyLibraryControls();

  if (isTheSameReferenceElement(this.logoButton, clickedButton)) {
    !isHomeButtonActive.call(this) && this.updateToSearchControls();
    onClick(event);
  }
}

export function onSwitchTab(event) {
  const { currentTarget: clickedTab } = event;
  !isTheSameReferenceElement(this.watchedTab, clickedTab) && this.switchToActiveTab(this.queueTab);
  !isTheSameReferenceElement(this.queueTab, clickedTab) && this.switchToActiveTab(this.watchedTab);
}

export function onSearchSubmit(event) {
  if (event.currentTarget.elements.searchFilm.value.trim() === '') {
    event.preventDefault();
    Notiflix.Notify.warning('Пожалуйста введите название фильма');

    return;
  }

  onClick(event);
  event.currentTarget.reset();
}

export function isTheSameReferenceElement(reference, incomingReference) {
  return reference === incomingReference ? true : false;
}

function isHomeButtonActive() {
  return this.homeButton.classList.contains('active');
}
