import './style.css';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Renders a poster of the movie.
 *
 * @param {Object}  props
 * @param {string}  props.posterPath   - The poster's url.
 * @param {string}  props.title        - The title of the movie.
 * @param {boolean} [props.isActive]   - Whether the border should be drawn.
 * @param {boolean} [props.isSelected] - Whether the movie is selected.
 */
function Poster({
  posterPath,
  title,
  isActive = false,
  isSelected = false
}) {
  const posterClass = classNames({
    'poster': true,
    'poster-active': isActive && isSelected,
    'poster-selected': isSelected
  });

  return (
    <img
      className={posterClass}
      src={posterPath}
      alt={`The poster of the "${title}"`}
    />
  );
}

Poster.propTypes = {
  posterPath: PropTypes.string.isRequired,
  title:      PropTypes.string.isRequired,
  isActive:   PropTypes.bool,
  isSelected: PropTypes.bool
};

export default Poster;
