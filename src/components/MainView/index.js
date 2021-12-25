import { useState } from 'react';
import './style.css';
import PropTypes from 'prop-types';

import GenreList from '../GenreList';
import PosterBoard from '../PosterBoard';

/**
 * Renders a main view with the genres and the movies posters.
 *
 * @param {Object}   props
 * @param {string[]} props.genres                - The list of the genres.
 * @param {Object[]} props.movies                - The list of the movies.
 * @param {string[]} props.movies[].genre_ids    - The list of movie's genres.
 * @param {string}   props.movies[].poster_path  - The poster's url.
 * @param {string}   props.movies[].title        - The title of the movie.
 * @param {string}   props.movies[].overview     - The overview of the movie.
 * @param {string}   props.movies[].release_date - The release data of the movie.
 */
function MainView({ genres, movies }) {
  const [selectedGenre, setSelectedGenre] = useState(null);

  const filteredMovies = (
    selectedGenre ?
      movies.filter(movie => movie.genre_ids.includes(selectedGenre))
    : movies
  );

  return (
    <main className='main-view'>
      <header>
        <h3 className='heading'>FILMER</h3>
      </header>
      <div className='content'>
        <GenreList
          list={genres}
          selectedGenre={selectedGenre}
          onSelect={setSelectedGenre}
        />
        <PosterBoard movies={filteredMovies} />
      </div>
    </main>
  );
}

MainView.propTypes = {
  genres: PropTypes.arrayOf(PropTypes.string).isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      genre_ids:    PropTypes.arrayOf(
        PropTypes.string.isRequired
      ).isRequired,
      poster_path:  PropTypes.string.isRequired,
      title:        PropTypes.string.isRequired,
      overview:     PropTypes.string.isRequired,
      release_date: PropTypes.string.isRequired
    })
  ).isRequired
};

export default MainView;
