import { forwardRef } from 'react';
import './style.css';
import PropTypes from 'prop-types';

import Poster from './Poster';

/**
 * Renders a board of the movies posters.
 *
 * @param {Object}      props
 * @param {Object[]}    props.movies                - The list of the movies.
 * @param {string[]}    props.movies[].genre_ids    - The list of movie's genres.
 * @param {string}      props.movies[].poster_path  - The poster's url.
 * @param {string}      props.movies[].title        - The title of the movie.
 * @param {string}      props.movies[].overview     - The overview of the movie.
 * @param {string}      props.movies[].release_date - The release data of the movie.
 * @param {boolean}     [props.isActive]            - Whether the component is active.
 * @param {string|null} [props.selectedPoster]      - Selected movie.
 * @param {Function}    props.onSelect              - On movie selection handler.
 * @param {Function}    props.onEnter               - On movie enter handler.
 * @param {Function}    props.onBack                - On movie back handler.
 */
const PosterBoard = forwardRef(function PosterBoard({
  movies,
  isActive = false,
  selectedPoster = null,
  onSelect,
  onEnter,
  onBack
}, ref) {
  const step = 5;
  const handleKeyDown = (event) => {
    event.preventDefault();

    const { key } = event;

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      const currentIndex = movies.findIndex(({ title }) => title === selectedPoster);
      let newMovieIndex;

      if (['ArrowLeft', 'ArrowRight'].includes(key)) {
        if (key === 'ArrowLeft') {
          newMovieIndex = currentIndex - 1;

          // if the poster is on the left side of the row,
          // then select the poster on the right side
          if (currentIndex % step === 0) {
            newMovieIndex = currentIndex + step - 1;
            // if there are less than 5 posters in the last row
            if (newMovieIndex + 1 > movies.length) {
              newMovieIndex = movies.length - 1;
            }
          }
        } else {
          newMovieIndex = currentIndex + 1;

          // if the poster is on the right side of the row,
          // then select the poster on the left side
          if (newMovieIndex % step === 0) {
            newMovieIndex -= step;
          // if the poster is the last one but is not divisible by 5
          } else if (newMovieIndex === movies.length) {
            newMovieIndex = currentIndex - (currentIndex % step);
          }
        }
      } else {
        if (key === 'ArrowUp') {
          newMovieIndex = currentIndex - step;

          // if the poster is in the first row
          if (newMovieIndex < 0) {
            newMovieIndex = movies.length + currentIndex - movies.length % step;
            if (newMovieIndex >= movies.length) {
              newMovieIndex -= step;
            }
          }
        } else {
          newMovieIndex = currentIndex + step;

          // if the poster is in the last row
          if (movies.length - currentIndex <= step) {
            newMovieIndex = currentIndex - (Math.ceil((currentIndex + 1) / step) - 1) * step;
          }
        }
      }

      onSelect(movies[newMovieIndex].title);
    } else if (key === 'Enter') {
      onEnter(movies.find(({ title }) => title === selectedPoster));
    } else if (key === 'b') {
      onBack();
    }
  };

  return (
    <section
      ref={ref}
      className='poster-board'
      style={{ gridTemplateColumns: `repeat(${step}, 1fr)` }}
      role='grid'
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {movies.map(({ poster_path, title }) => (
        <Poster
          key={title}
          posterPath={poster_path}
          title={title}
          isActive={isActive}
          isSelected={selectedPoster === title}
        />
      ))}
    </section>
  );
});

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
  ).isRequired,
  isActive: PropTypes.bool,
  selectedPoster: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(null)
  ]),
  onSelect: PropTypes.func.isRequired,
  onEnter: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired
};

export default PosterBoard;
