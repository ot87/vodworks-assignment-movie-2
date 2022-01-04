import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import './style.css';
import PropTypes from 'prop-types';

/**
 * Renders a movie screen with the information about it.
 *
 * @param {Object}   props
 * @param {Object}   props.movie              - The details of the movie.
 * @param {string[]} props.movie.genre_ids    - The list of movie's genres.
 * @param {string}   props.movie.poster_path  - The poster's url.
 * @param {string}   props.movie.title        - The title of the movie.
 * @param {string}   props.movie.overview     - The overview of the movie.
 * @param {string}   props.movie.release_date - The release data of the movie.
 * @param {Function} props.onBack             - On movie back handler.
 */
const Movie = forwardRef(function Movie({ movie, onBack }, ref) {
  const playButton = useRef();
  const trailerButton = useRef();
  const addToListButton = useRef();
  const buttonsRefs = useMemo(() => [playButton, trailerButton, addToListButton], []);
  const [focusedId, setFocusedId] = useState(0);

  const handleKeyDown = ({ key }) => {
    if (['ArrowLeft', 'ArrowRight'].includes(key)) {
      let nextFocusedId;

      buttonsRefs[focusedId].current.blur();
      if (key === 'ArrowRight') {
        nextFocusedId = 0;
        if (focusedId < buttonsRefs.length - 1) {
          nextFocusedId = focusedId + 1;
        }
      } else {
        nextFocusedId = buttonsRefs.length - 1;
        if (focusedId > 0) {
          nextFocusedId = focusedId - 1;
        }
      }

      setFocusedId(nextFocusedId);
    } else if (key === 'b') {
      onBack();
    }
  };

  useImperativeHandle(ref, () => ({
    focus: () => {
      buttonsRefs[focusedId]?.current.focus();
    },
    blur: () => ref.current.blur
  }), [ref, buttonsRefs, focusedId]);

  useEffect(() => {
    buttonsRefs[focusedId]?.current.focus();
  }, [buttonsRefs, focusedId]);

  return (
    <article
      className='movie'
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className='movie-title'>{movie.title}</div>
      <div className='movie-content'>
        <div className='movie-info'>
          <div className='movie-labels'>
            <div className='movie-label'>
              <div className='movie-label-name'>RELEASE DATE</div>
              <div className='movie-label-text'>{movie.release_date}</div>
            </div>
            <div className='movie-label'>
              <div className='movie-label-name'>GENRE</div>
              <div className='movie-label-text'>
                {movie.genre_ids.map(
                  genre => `${genre[0].toUpperCase()}${genre.slice(1)}`
                ).join(' ')}
              </div>
            </div>
          </div>
          <img
            className='movie-image'
            src={movie.poster_path}
            alt={`The poster of the "${movie.title}"`}
          />
          <div className='movie-buttons'>
            <div ref={buttonsRefs[0]} tabIndex={-1} className='movie-button'>PLAY</div>
            <div ref={buttonsRefs[1]} tabIndex={-1} className='movie-button'>TRAILER</div>
            <div ref={buttonsRefs[2]} tabIndex={-1} className='movie-button'>ADD TO LIST</div>
          </div>
        </div>
        <div className='movie-overview'>{movie.overview}</div>
      </div>
    </article>
  );
});

Movie.propTypes = {
  movie: PropTypes.shape({
    genre_ids:    PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired,
    poster_path:  PropTypes.string.isRequired,
    title:        PropTypes.string.isRequired,
    overview:     PropTypes.string.isRequired,
    release_date: PropTypes.string.isRequired
  }).isRequired,
  onBack:   PropTypes.func.isRequired
};

export default Movie;
