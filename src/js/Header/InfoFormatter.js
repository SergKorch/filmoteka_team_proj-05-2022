export function formatGenresData(genres) {
  const genreNames = genres.map(genre => (genre?.name ? genre.name : genre)); //special case, hmm... not good at all
  return genreNames.length <= 2
    ? genreNames.join(', ')
    : genreNames?.slice(0, 2).join(', ').concat(', other');
}

export function formatReleaseYearData(releaseYear) {
  return releaseYear?.slice(0, 4);
}

export function formatNumericalToFixed(number) {
  return number?.toFixed(1);
}

export function formatConvertedGenres(genres) {
  const genresNamesArray = JSON.parse(localStorage.getItem('GenresArray'));

  const translatedGenres = genres.map(item => {
    const searchValue = item;
    const nameObject = genresNamesArray.find(option => option.id === searchValue);
    return (item = nameObject.name);
  });

  // console.log(translatedGenres);

  const genreNames = translatedGenres.map(genre => (genre?.name ? genre.name : genre)); //special case, hmm... not good at all
  return genreNames.length <= 2
    ? genreNames.join(', ')
    : genreNames?.slice(0, 2).join(', ').concat(', other');
}
