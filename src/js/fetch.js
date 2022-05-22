import axios from 'axios';

export const API_KEY = '?api_key=ad8c6c4dd7f8a685c9c739255442ccd5';

const axiosRequest = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
});

export default class FilmsApiService {
  async testFetch() {
    return fetchTest(`trending/movie/day${API_KEY}&page=1`).then(res => {
      if (!(res.status >= 200 && res.status < 300)) {
        // console.log(res);
        throw Error(res.statusText);
      }
      return res;
    });
  }

  async fetchArticles(filmName) {
    const urlTrending = `trending/movie/day${API_KEY}&page=1`;

    // console.log('Что нам передалось? ', filmName);
    if (!filmName) {
      return await axiosRequest(urlTrending).then(res => {
        if (!(res.status >= 200 && res.status < 300)) {
          throw Error(res.statusText);
        }
        return res;
      });
    } else {
      // console.log(filmName);
      const QUERY_VALUE = filmName;
      const urlQuery = `search/movie${API_KEY}&query=${QUERY_VALUE}&page=1`;

      return await axiosRequest(urlQuery).then(res => {
        if (!(res.status >= 200 && res.status < 300)) {
          throw Error(res.statusText);
        }
        return res;
      });
    }
  }

  async fetchFilmInfo(filmId) {
    const urlQuery = `movie/${filmId}${API_KEY}&language=en-US`;

    return await axiosRequest(urlQuery).then(res => {
      if (!(res.status >= 200 && res.status < 300)) {
        throw Error(res.statusText);
      }
      return res;
    });
  }

  async Genres() {
    axiosRequest(`genre/movie/list${API_KEY}&language=en-US`).then(res => {
      const GENRES = res.data.genres;
      localStorage.setItem('GenresArray', JSON.stringify(GENRES));
    });
  }
}
