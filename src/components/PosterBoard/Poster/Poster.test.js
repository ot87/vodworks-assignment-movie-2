import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Poster from '.';

const movie = {
  genre_ids: ['genre_id'],
  poster_path: 'poster_path',
  title: 'title',
  overview: 'overview',
  release_date: 'release_date'
};
const byRoleOption = { name: `The poster of the "${movie.title}"` };

describe('Poster', () => {
  it('renders with src and alt attributes', () => {
    render(<Poster movie={movie} onSelect={jest.fn()} />);

    const poster = screen.getByRole('img', byRoleOption);
    expect(poster).toBeInTheDocument();
    expect(poster).toHaveAttribute('src', movie.poster_path);
    expect(poster).toHaveAttribute('alt', byRoleOption.name);
  });

  it('renders as not selected', () => {
    render(<Poster movie={movie} onSelect={jest.fn()} />);
    expect(screen.getByRole('img', byRoleOption)).not.toHaveClass('poster-selected');
  });

  it('renders as not selected and rerenders as selected and back', () => {
    const { rerender } = render(<Poster movie={movie} onSelect={jest.fn()} />);

    rerender(<Poster movie={movie} isSelected={true} onSelect={jest.fn()} />);
    expect(screen.getByRole('img', byRoleOption)).toHaveClass('poster-selected');

    rerender(<Poster movie={movie} isSelected={false} onSelect={jest.fn()} />);
    expect(screen.getByRole('img', byRoleOption)).not.toHaveClass('poster-selected');
  });

  it('calls the onSelect callback handler', () => {
    const onSelectHandler = jest.fn();

    render(<Poster movie={movie} onSelect={onSelectHandler} />);

    userEvent.click(screen.getByRole('img', byRoleOption));
    expect(onSelectHandler).toBeCalledTimes(1);
  });
});
