import { useState } from 'react';
import './style.css';
import PropTypes from 'prop-types';

import Poster from './Poster';

/**
 * Renders a board of the movies posters.
 *
 * @param {Object}   props
 * @param {Object[]} props.movies                - The list of the movies.
 * @param {string[]} props.movies[].genre_ids    - The list of movie's genres.
 * @param {string}   props.movies[].poster_path  - The poster's url.
 * @param {string}   props.movies[].title        - The title of the movie.
 * @param {string}   props.movies[].overview     - The overview of the movie.
 * @param {string}   props.movies[].release_date - The release data of the movie.
 */
function PosterBoard({ movies }) {
  const [selectedPoster, setSelectedPoster] = useState(null);

  return (
    <section className='poster-board' role='grid'>
      {movies.map(movie => (
        <Poster
          key={movie.title}
          movie={movie}
          isSelected={selectedPoster === movie.title}
          onSelect={setSelectedPoster}
        />
      ))}
    </section>
  );
}

PosterBoard.propTypes = {
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

export default PosterBoard;
