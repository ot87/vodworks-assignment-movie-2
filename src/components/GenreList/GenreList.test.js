import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GenreList from '.';

const genres = ['genre1', 'genre2'];

describe('GenreList', () => {
  it('renders with an empty list', () => {
    render(<GenreList list={[]} onSelect={jest.fn()} />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders with two genres', () => {
    render(<GenreList list={genres} onSelect={jest.fn()} />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('genre1')).toBeInTheDocument();
    expect(screen.getByText('genre2')).toBeInTheDocument();
  });

  it('renders with two not selected genres', () => {
    render(<GenreList list={genres} onSelect={jest.fn()} />);

    expect(screen.getByText('genre1')).not.toHaveClass('genre-item-selected');
    expect(screen.getByText('genre2')).not.toHaveClass('genre-item-selected');
  });

  it('renders with both genres not selected and rerenders one selected and back', () => {
    const { rerender } = render(<GenreList list={genres} onSelect={jest.fn()} />);

    rerender(<GenreList list={genres} selectedGenre='genre1' onSelect={jest.fn()} />);
    expect(screen.getByText('genre1')).toHaveClass('genre-item-selected');

    rerender(<GenreList list={genres} selectedGenre={null} onSelect={jest.fn()} />);
    expect(screen.getByText('genre1')).not.toHaveClass('genre-item-selected');
  });

  it('calls the onSelect callback handler', () => {
    const onSelectHandler = jest.fn();

    render(<GenreList list={genres} onSelect={onSelectHandler} />);

    userEvent.click(screen.getByText('genre1'));
    expect(onSelectHandler).toBeCalledTimes(1);
  });
});
