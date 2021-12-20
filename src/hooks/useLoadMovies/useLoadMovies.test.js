import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import useLoadMovies from '.';

const responseData = [{
  genre_ids: ['genre1', 'genre2'],
  title: 'title1'
}, {
  genre_ids: ['genre1', 'genre3'],
  title: 'title2'
}];
const initialData = { movies: [], genres: [] };
const hookReturn = {
  movies: [{
    genre_ids: ['genre1', 'genre2'],
    title: 'title1'
  }, {
    genre_ids: ['genre1', 'genre3'],
    title: 'title2'
  }],
  genres: ['genre1', 'genre2', 'genre3']
};

describe('useLoadMovies hook', () => {
  it('inits and loads data to state', async () => {
    jest.spyOn(window, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(responseData)
    });

    const { result } = renderHook(() => useLoadMovies());

    expect(result.current[0]).toMatchObject(initialData);

    await waitFor(() => {
      expect(result.current[0]).toMatchObject(hookReturn);
    });

    jest.restoreAllMocks();
  });
});
