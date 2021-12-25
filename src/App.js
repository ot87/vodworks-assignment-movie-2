import { useState } from 'react';
import './App.css';

import GenreList from './components/GenreList';
import PosterBoard from './components/PosterBoard';
import useLoadMovies from './hooks/useLoadMovies';

function App() {
  const [{ movies, genres }] = useLoadMovies();
  const [selectedGenre, setSelectedGenre] = useState(null);

  const filteredMovies = (
    selectedGenre ?
      movies.filter(movie => movie.genre_ids.includes(selectedGenre))
    : movies
  );

  return (
    <main className='content'>
      <GenreList
        list={genres}
        selectedGenre={selectedGenre}
        onSelect={setSelectedGenre}
      />
      <PosterBoard movies={filteredMovies} />
    </main>
  );
}

export default App;
