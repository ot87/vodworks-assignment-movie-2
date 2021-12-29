import './style.css';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Renders a row of the genre.
 *
 * @param {Object}   props
 * @param {string}   props.item         - The genre name.
 * @param {boolean}  [props.isActive]   - Whether the border should be drawn.
 * @param {boolean}  [props.isSelected] - Whether the genre is selected.
 */
function GenreItem({
  item,
  isActive = false,
  isSelected = false
}) {
  const itemClass = classNames({
    'genre-item': true,
    'genre-item-active': isActive && isSelected
  });

  return (
    <div className={itemClass}>
      {item}
      {isSelected ? <span className='arrow'></span> : ''}
    </div>
  );
}

GenreItem.propTypes = {
  item:       PropTypes.string.isRequired,
  isActive:   PropTypes.bool,
  isSelected: PropTypes.bool
};

export default GenreItem;
