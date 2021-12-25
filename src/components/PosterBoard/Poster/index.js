import './style.css';
import PropTypes from 'prop-types';

/**
 * Renders a poster of the movie.
 *
 * @param {Object}   props
 * @param {Object}   props.movie              - The movie object.
 * @param {string[]} props.movie.genre_ids    - The list of movie's genres.
 * @param {string}   props.movie.poster_path  - The poster's url.
 * @param {string}   props.movie.title        - The title of the movie.
 * @param {string}   props.movie.overview     - The overview of the movie.
 * @param {string}   props.movie.release_date - The release data of the movie.
 * @param {boolean}  [props.isSelected]       - Whether the movie is selected.
 * @param {Function} props.onSelect           - On movie poster click handler.
 */
function Poster({
  movie,
  isSelected = false,
  onSelect
}) {
  const handleOnClick = () => {
    onSelect(movie.title);
  };

  return (
    <img
      className={`poster${isSelected ? ' poster-selected' : ''}`}
      src={movie.poster_path}
      alt={`The poster of the "${movie.title}"`}
      onClick={handleOnClick}
    />
  );
}

Poster.propTypes = {
  movie:      PropTypes.shape({
    genre_ids:    PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired,
    poster_path:  PropTypes.string.isRequired,
    title:        PropTypes.string.isRequired,
    overview:     PropTypes.string.isRequired,
    release_date: PropTypes.string.isRequired
  }).isRequired,
  isSelected: PropTypes.bool,
  onSelect:   PropTypes.func.isRequired
};

export default Poster;
