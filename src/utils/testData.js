export const genres = ['genre1', 'genre2', 'genre3'];

export const movies = [{
  genre_ids: ['genre1', 'genre2'],
  poster_path: 'poster_path1',
  title: 'title1',
  overview: 'overview1',
  release_date: 'release_date1'
}, {
  genre_ids: ['genre3'],
  poster_path: 'poster_path2',
  title: 'title2',
  overview: 'overview2',
  release_date: 'release_date2'
}];

const moviesTestData = { genres, movies };

export default moviesTestData;
