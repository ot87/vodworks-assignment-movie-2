import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import classNames from 'classnames';

import useLoadMovies from './hooks/useLoadMovies';
import useOnClickListener from './hooks/useOnClickListener';
import MainView from './components/MainView';
import Movie from './components/Movie';

function App() {
  const [moviesInfo] = useLoadMovies();
  const genreRef  = useRef();
  const posterRef = useRef();
  const movieRef  = useRef();
  const [activeRef, setActiveRef] = useState(genreRef);
  const [selectedMovie, setSelectedMovie] = useState();

  const handleClick = useCallback(() => {
    activeRef.current.focus({ preventScroll: true });
  }, [activeRef]);
  useOnClickListener(handleClick);

  const focusComponent = ref => {
    activeRef.current.blur();
    setActiveRef(ref);
  };
  const setMovie = movie => {
    focusComponent(movieRef);
    setSelectedMovie(movie);
  };
  const handleMovieBack = () => {
    focusComponent(posterRef);
    setSelectedMovie(null);
  };

  useEffect(() => {
    activeRef.current?.focus();
  }, [activeRef]);

  const appClass = classNames({
    container: true,
    'hide-movie': true,
    'show-movie': Boolean(selectedMovie)
  });

  return (
    <div className={appClass}>
      <MainView
        {...moviesInfo}
        genreRef={genreRef}
        posterRef={posterRef}
        activeRef={activeRef}
        focusComponent={focusComponent}
        setMovie={setMovie}
      />
      {selectedMovie && (
        <Movie
          ref={movieRef}
          movie={selectedMovie}
          onBack={handleMovieBack}
        />
      )}
    </div>
  );
}

export default App;
