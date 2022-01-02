import { useState } from 'react';
import './style.css';
import PropTypes from 'prop-types';

import GenreList   from '../GenreList';
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
 * @param {Object}   props.genreRef              - The reference to the HTML element of the GenreList component.
 * @param {Object}   props.genreRef.current
 * @param {Object}   props.posterRef             - The reference to the HTML element of the PosterBoard component.
 * @param {Object}   props.posterRef.current
 * @param {Object}   props.activeRef             - The reference to the HTML element of the component that is currently focused.
 * @param {Object}   props.activeRef.current
 * @param {Function} props.focusComponent        - Focus the specified component.
 * @param {Function} props.setMovie              - Set a chosen movie.
 */
function MainView({
  genres,
  movies,
  genreRef,
  posterRef,
  activeRef,
  focusComponent,
  setMovie
}) {
  const [selectedGenre,  setSelectedGenre]  = useState(null);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const isGenreActive  = Boolean(genreRef.current  === activeRef.current && selectedGenre);
  const isPosterActive = Boolean(posterRef.current === activeRef.current && selectedPoster);

  const filteredMovies = (
    selectedGenre ?
      movies.filter(movie => movie.genre_ids.includes(selectedGenre))
    : movies
  );

  const handleGenreEnter = () => {
    focusComponent(posterRef);
    setSelectedPoster(filteredMovies[0].title);
  };
  const handlePosterBack = () => {
    focusComponent(genreRef);
    setSelectedPoster(null);
  };

  return (
    <main className='main-view'>
      <header>
        <h3 className='heading'>FILMER</h3>
      </header>
      <div className='content'>
        <GenreList
          ref={genreRef}
          list={genres}
          isActive={isGenreActive}
          selectedGenre={selectedGenre}
          onSelect={setSelectedGenre}
          onEnter={handleGenreEnter}
        />
        <PosterBoard
          ref={posterRef}
          movies={filteredMovies}
          isActive={isPosterActive}
          selectedPoster={selectedPoster}
          onSelect={setSelectedPoster}
          onEnter={setMovie}
          onBack={handlePosterBack}
        />
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
  ).isRequired,
  genreRef:  PropTypes.shape({ current: PropTypes.instanceOf(HTMLElement) }).isRequired,
  posterRef: PropTypes.shape({ current: PropTypes.instanceOf(HTMLElement) }).isRequired,
  activeRef: PropTypes.shape({ current: PropTypes.instanceOf(HTMLElement) }).isRequired,
  focusComponent: PropTypes.func.isRequired,
  setMovie:       PropTypes.func.isRequired
};

export default MainView;
