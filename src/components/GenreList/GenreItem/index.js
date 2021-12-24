import './style.css';
import PropTypes from 'prop-types';

/**
 * Renders a row of the genre.
 *
 * @param {Object}   props
 * @param {string}   props.item         - The genre name.
 * @param {boolean}  [props.isSelected] - Whether the genre is selected.
 * @param {Function} props.onClick      - On genre click handler.
 */
function GenreItem({
  item,
  isSelected = false,
  onClick
}) {
  const handleOnClick = () => {
    onClick(item);
  };

  return (
    <div
      className={`genre-item${isSelected ? ' genre-item-selected' : ''}`}
      onClick={handleOnClick}
    >
      {item}
      {isSelected ? <span className='arrow'></span> : ''}
    </div>
  );
}

GenreItem.propTypes = {
  item:       PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  onClick:    PropTypes.func.isRequired
};

export default GenreItem;
