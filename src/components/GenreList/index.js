import { forwardRef } from 'react';
import './style.css';
import PropTypes from 'prop-types';

import GenreItem from './GenreItem';

/**
 * Renders a list of the genres.
 *
 * @param {Object}      props
 * @param {string[]}    props.list            - The list of the genres.
 * @param {boolean}     [props.isActive]      - Whether the component is active.
 * @param {number|null} [props.selectedGenre] - Selected genre.
 * @param {Function}    props.onSelect        - On genre selection handler.
 * @param {Function}    props.onEnter         - On genre enter handler.
 */
const GenreList = forwardRef(function GenreList({
  list,
  isActive = false,
  selectedGenre = null,
  onSelect,
  onEnter
}, ref) {
  const handleKeyDown = ({ key }) => {
    if (['ArrowUp', 'ArrowDown'].includes(key)) {
      let newItem = list[0];

      if (selectedGenre) {
        const currentIndex = list.findIndex(item => item === selectedGenre);

        if (key === 'ArrowUp') {
          newItem = list[(currentIndex || list.length) - 1];
        } else {
          newItem = list[(
            currentIndex === list.length - 1 ?
              0
            : currentIndex + 1
          )];
        }
      }
      onSelect(newItem);
    } else if (key === 'Enter') {
      onEnter();
    } else if (key === 'b') {
      onSelect(null);
    }
  };

  return (
    <nav
      ref={ref}
      className='genre-list' 
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {list.map(item => (
        <GenreItem
          key={item}
          item={item}
          isActive={isActive}
          isSelected={selectedGenre === item}
        />
      ))}
    </nav>
  );
});

GenreList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.string).isRequired,
  isActive: PropTypes.bool,
  selectedGenre: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(null)
  ]),
  onSelect: PropTypes.func.isRequired,
  onEnter: PropTypes.func.isRequired
};

export default GenreList;
