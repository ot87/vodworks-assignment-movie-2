import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MainView from '.';
import { genres, movies } from '../../utils/testData';
import { getByRoleOption } from '../../utils/testHelpers';

describe('MainView', () => {
  it('renders with the heading and an empty genres list and an movie posters board', () => {
    render(<MainView genres={[]} movies={[]} />);

    const mainView = screen.getByRole('main');
    expect(mainView).toBeInTheDocument();

    expect(
      within(mainView).getByRole('heading', { name: /filmer/i })
    ).toBeInTheDocument();

    const genreList = within(mainView).getByRole('navigation');
    expect(genreList).toBeInTheDocument();
    expect(genreList).toBeEmptyDOMElement();

    const posterBoard = within(mainView).getByRole('grid');
    expect(posterBoard).toBeInTheDocument();
    expect(posterBoard).toBeEmptyDOMElement();
  });

  it('renders with three genres and two movie posters', () => {
    render(<MainView genres={genres} movies={movies} />);

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

  it('filters movie posters depends on selected genre', () => {
    render(<MainView genres={genres} movies={movies} />);

    genres.forEach(genre => {
      userEvent.click(screen.getByText(genre));
      expect(screen.getByText(genre)).toHaveClass('genre-item-selected');

      movies
        .filter(movie => movie.genre_ids.includes(genre))
        .forEach(movie => {
          expect(screen.getByRole('img', getByRoleOption(movie.title))).toBeInTheDocument();

          userEvent.click(screen.getByRole('img', getByRoleOption(movie.title)));
          expect(screen.getByRole('img', getByRoleOption(movie.title))).toHaveClass('poster-selected');
        });
    });
  });
});
