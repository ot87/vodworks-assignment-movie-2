import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';
import { genres, movies }  from './utils/testData';
import { getByRoleOption } from './utils/testHelpers';

const renderApp = async () => {
  const promise = Promise.resolve();
  jest.spyOn(window, 'fetch').mockResolvedValue({
    json: jest.fn(() => promise).mockResolvedValue(movies)
  });

  render(<App />);
  await act(() => promise);
};

afterEach(() => {
  jest.restoreAllMocks();
});

describe('App', () => {
  it('renders GenreList and PosterBoard with content', async () => {
    await renderApp();

    const mainView = screen.getByRole('main');
    expect(mainView).toBeInTheDocument();

    const genreList = within(mainView).getByRole('navigation');
    expect(genreList).toBeInTheDocument();
    genres.forEach(genre => {
      expect(within(genreList).getByText(genre)).toBeInTheDocument();
    });

    const posterBoard = within(mainView).getByRole('grid');
    expect(posterBoard).toBeInTheDocument();
    movies.forEach(movie => {
      const poster = within(posterBoard).getByRole('img', getByRoleOption(movie.title));

      expect(poster).toBeInTheDocument();
      expect(poster).toHaveAttribute('src', movie.poster_path);
      expect(poster).toHaveAttribute('alt', getByRoleOption(movie.title).name);
    });
  });

  it('navigates through genres and poster to the and Movie is rendered and back', async () => {
    await renderApp();

    // navigate to the first genre
    userEvent.keyboard('{ArrowDown}');

    let genreItem = screen.getByText(genres[0]);
    expect(genreItem).toHaveClass('genre-item-active');
    expect(genreItem).toContainHTML('<span class="arrow"></span>');

    // select the genre
    userEvent.keyboard('{Enter}');
    // wait for PosterBoard to be focused
    await waitFor(() => expect(screen.getByRole('grid')).toHaveFocus());

    const filteredMovies = movies.filter(movie => movie.genre_ids.includes(genres[0]));
    let firstPoster = screen.getByRole('img', getByRoleOption(filteredMovies[0].title));
    expect(firstPoster).toHaveClass('poster-active');
    expect(firstPoster).toHaveClass('poster-selected');

    // select the next poster
    userEvent.keyboard('{ArrowRight}');

    firstPoster = screen.getByRole('img', getByRoleOption(filteredMovies[0].title));
    expect(firstPoster).not.toHaveClass('poster-active');
    expect(firstPoster).not.toHaveClass('poster-selected');

    let secondPoster = screen.getByRole('img', getByRoleOption(filteredMovies[1].title));
    expect(secondPoster).toHaveClass('poster-active');
    expect(secondPoster).toHaveClass('poster-selected');

    genreItem = screen.getByText(genres[0]);
    expect(genreItem).not.toHaveClass('genre-item-active');
    expect(genreItem).toContainHTML('<span class="arrow"></span>');

    // select the movie
    userEvent.keyboard('{Enter}');
    // wait for Play button of the Movie to be focused
    await waitFor(() => expect(within(screen.getByRole('article')).getByText('PLAY')).toHaveFocus());

    const movieElement = screen.getByRole('article');
    expect(movieElement).toBeInTheDocument();
    expect(within(movieElement).getByText(filteredMovies[1].title)).toBeInTheDocument();

    secondPoster = within(screen.getByRole('grid')).getByRole('img', getByRoleOption(filteredMovies[1].title));
    expect(secondPoster).not.toHaveClass('poster-active');
    expect(secondPoster).toHaveClass('poster-selected');

    // return back to the posters
    userEvent.keyboard('{b}');
    // wait for PosterBoard to be focused
    await waitFor(() => expect(screen.getByRole('grid')).toHaveFocus());

    secondPoster = screen.getByRole('img', getByRoleOption(filteredMovies[1].title));
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    expect(secondPoster).toHaveClass('poster-active');
    expect(secondPoster).toHaveClass('poster-selected');

    // return back to the genres
    userEvent.keyboard('{b}');
    // wait for GenreList to be focused
    await waitFor(() => expect(screen.getByRole('navigation')).toHaveFocus());

    genreItem = screen.getByText(genres[0]);
    expect(genreItem).toHaveClass('genre-item-active');
    expect(genreItem).toContainHTML('<span class="arrow"></span>');

    // deselect the first genre
    userEvent.keyboard('{b}');

    genreItem = screen.getByText(genres[0]);
    expect(genreItem).not.toHaveClass('genre-item-active');
    expect(genreItem).not.toContainHTML('<span class="arrow"></span>');
  });

  it('focuses GenreList back after a mouse click', async () => {
    await renderApp();

    expect(screen.getByRole('navigation')).toHaveFocus();

    userEvent.click(document.body);

    expect(screen.getByRole('navigation')).toHaveFocus();
  });

  it('focuses PosterBoard back after a mouse click', async () => {
    await renderApp();

    userEvent.keyboard('{ArrowDown}');
    userEvent.keyboard('{Enter}');
    await waitFor(() => expect(screen.getByRole('grid')).toHaveFocus());

    userEvent.click(document.body);

    expect(screen.getByRole('grid')).toHaveFocus();
  });

  it('focuses the button of the Movie back after a mouse click', async () => {
    await renderApp();

    userEvent.keyboard('{ArrowDown}');
    userEvent.keyboard('{Enter}');
    await waitFor(() => expect(screen.getByRole('grid')).toHaveFocus());
    userEvent.keyboard('{Enter}');
    await waitFor(() => expect(screen.getByText('PLAY')).toHaveFocus());

    userEvent.click(document.body);

    expect(screen.getByText('PLAY')).toHaveFocus();
  });
});
