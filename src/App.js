import { useState } from 'react';
import './App.css';

import GenreList from './components/GenreList';
import useLoadMovies from './hooks/useLoadMovies';

function App() {
  const [{ genres }] = useLoadMovies();
  const [selectedGenre, setSelectedGenre] = useState(null);

  return (
    <main className='content'>
      <GenreList
        list={genres}
        selectedGenre={selectedGenre}
        onSelect={setSelectedGenre}
      />
    </main>
  );
}

export default App;
