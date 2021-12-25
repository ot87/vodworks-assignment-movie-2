import './App.css';

import MainView from './components/MainView';
import useLoadMovies from './hooks/useLoadMovies';

function App() {
  const [moviesInfo] = useLoadMovies();

  return (
    <div className='container'>
      <MainView {...moviesInfo} />
    </div>
  );
}

export default App;
