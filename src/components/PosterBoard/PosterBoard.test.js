import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PosterBoard from '.';

const movies = [{
  genre_ids: ['genre_id1'],
  poster_path: 'poster_path1',
  title: 'title1',
  overview: 'overview1',
  release_date: 'release_date1'
}, {
  genre_ids: ['genre_id2'],
  poster_path: 'poster_path2',
  title: 'title2',
  overview: 'overview2',
  release_date: 'release_date2'
}];

const byRoleOption = (name) => ({ name: `The poster of the "${name}"` });

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

    const poster1 = within(posterBoard).getByRole('img', byRoleOption(movies[0].title));
    expect(poster1).toBeInTheDocument();
    expect(poster1).toHaveAttribute('src', movies[0].poster_path);
    expect(poster1).toHaveAttribute('alt', byRoleOption(movies[0].title).name);

    const poster2 = within(posterBoard).getByRole('img', byRoleOption(movies[1].title));
    expect(poster2).toBeInTheDocument();
    expect(poster2).toHaveAttribute('src', movies[1].poster_path);
    expect(poster2).toHaveAttribute('alt', byRoleOption(movies[1].title).name);
  });

  it('selects one movie poster and then another one', () => {
    render(<PosterBoard movies={movies} />);

    userEvent.click(screen.getByRole('img', byRoleOption(movies[0].title)));
    expect(screen.getByRole('img', byRoleOption(movies[0].title))).toHaveClass('poster-selected');
    expect(screen.getByRole('img', byRoleOption(movies[1].title))).not.toHaveClass('poster-selected');

    userEvent.click(screen.getByRole('img', byRoleOption(movies[1].title)));
    expect(screen.getByRole('img', byRoleOption(movies[0].title))).not.toHaveClass('poster-selected');
    expect(screen.getByRole('img', byRoleOption(movies[1].title))).toHaveClass('poster-selected');
  });
});
