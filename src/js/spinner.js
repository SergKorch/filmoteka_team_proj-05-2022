export function onLoadSpinner () {
      const spinner = document.querySelector(".spinner-wrapper");
        spinner.classList.remove('visually-hidden');
    };
export function offLoadSpinner () {
    const spinner = document.querySelector(".spinner-wrapper");
      spinner.classList.add('visually-hidden');
  };