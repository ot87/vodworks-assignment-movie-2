import { useEffect, useState } from 'react';

const ENDPOINT = 'https://raw.githubusercontent.com/bdiadiun/technical-assignments/main/movieDataCollection.json';

/**
 * Custom hook that makes one request for the movies data and inits state to store all the movies and the genres list that is generated from the movies list.
 *
 * @returns {Array} State object with "movies" and "genres".
 */
const useLoadMovies = () => {
  // There might be implemented loading and error handling too but, according to the shape of the resource as a just JSON object, it seems unnecessary.
  const [moviesInfo, setMoviesInfo] = useState({ movies: [], genres: [] });

  useEffect(() => {
    const fetchData = async () => {
      const movies = await fetch(ENDPOINT).then(response => response.json());

      setMoviesInfo({
        movies,
        // create list of all the genres
        genres: movies
          .reduce(
            (allGenres, { genre_ids }) => ([
              ...allGenres,
              ...genre_ids.filter(genre => !allGenres.includes(genre))
            ]),
            []
          )
          .sort()
      });
    };

    fetchData();
  }, []);

  return [moviesInfo];
}

export default useLoadMovies;
