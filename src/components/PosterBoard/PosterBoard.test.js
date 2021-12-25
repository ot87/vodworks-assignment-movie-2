import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PosterBoard from '.';
import { movies } from '../../utils/testData';
import { getByRoleOption } from '../../utils/testHelpers';

describe('PosterBoard', () => {
  it('renders an empty board', () => {
    render(<PosterBoard movies={[]} />);

    const posterBoard = screen.getByRole('grid');
    expect(posterBoard).toBeInTheDocument();
    expect(posterBoard).toBeEmptyDOMElement();
  });

  it('renders with two movie posters', () => {
    render(<PosterBoard movies={movies} />);

    const posterBoard = screen.getByRole('grid');
    expect(posterBoard).toBeInTheDocument();

    movies.forEach(movie => {
      const poster = within(posterBoard).getByRole('img', getByRoleOption(movie.title));

      expect(poster).toBeInTheDocument();
      expect(poster).toHaveAttribute('src', movie.poster_path);
      expect(poster).toHaveAttribute('alt', getByRoleOption(movie.title).name);
    });
  });

  it('selects one movie poster and then another one', () => {
    render(<PosterBoard movies={movies} />);

    userEvent.click(screen.getByRole('img', getByRoleOption(movies[0].title)));
    expect(screen.getByRole('img', getByRoleOption(movies[0].title))).toHaveClass('poster-selected');
    expect(screen.getByRole('img', getByRoleOption(movies[1].title))).not.toHaveClass('poster-selected');

    userEvent.click(screen.getByRole('img', getByRoleOption(movies[1].title)));
    expect(screen.getByRole('img', getByRoleOption(movies[0].title))).not.toHaveClass('poster-selected');
    expect(screen.getByRole('img', getByRoleOption(movies[1].title))).toHaveClass('poster-selected');
  });
});
