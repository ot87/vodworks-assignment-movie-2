import './style.css';
import PropTypes from 'prop-types';
import GenreItem from './GenreItem';

/**
 * Renders a list of the genres.
 *
 * @param {Object}      props
 * @param {string[]}    props.list            - The list of the genres.
 * @param {string|null} [props.selectedGenre] - Selected genre.
 * @param {Function}    props.onSelect        - On genre click handler.
 */
function GenreList({
  list,
  selectedGenre = null,
  onSelect
}) {
  return (
    <nav className='genre-list'>
      {list.map(item => (
        <GenreItem
          key={item}
          item={item}
          isSelected={selectedGenre === item}
          onClick={onSelect}
        />
      ))}
    </nav>
  );
}

GenreList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedGenre: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(null)
  ]),
  onSelect: PropTypes.func.isRequired
};

export default GenreList;
