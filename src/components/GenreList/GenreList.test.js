import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GenreList from '.';
import { genres } from '../../utils/testData';

describe('GenreList', () => {
  it('renders with an empty list', () => {
    render(<GenreList list={[]} onSelect={jest.fn()} />);

    const genreList = screen.getByRole('navigation');
    expect(genreList).toBeInTheDocument();
    expect(genreList).toBeEmptyDOMElement();
  });

  it('renders with three genres', () => {
    render(<GenreList list={genres} onSelect={jest.fn()} />);

    const genreList = screen.getByRole('navigation');
    expect(genreList).toBeInTheDocument();
    genres.forEach(genre => {
      expect(within(genreList).getByText(genre)).toBeInTheDocument();
    });
  });

  it('renders with three not selected genres', () => {
    render(<GenreList list={genres} onSelect={jest.fn()} />);

    genres.forEach(genre => {
      expect(screen.getByText(genre)).not.toHaveClass('genre-item-selected');
    });
  });

  it('renders with three genres not selected and rerenders one selected and back', () => {
    const { rerender } = render(<GenreList list={genres} onSelect={jest.fn()} />);

    rerender(<GenreList list={genres} selectedGenre={genres[0]} onSelect={jest.fn()} />);
    expect(screen.getByText(genres[0])).toHaveClass('genre-item-selected');

    rerender(<GenreList list={genres} selectedGenre={null} onSelect={jest.fn()} />);
    expect(screen.getByText(genres[0])).not.toHaveClass('genre-item-selected');
  });

  it('calls the onSelect callback handler', () => {
    const onSelectHandler = jest.fn();

    render(<GenreList list={genres} onSelect={onSelectHandler} />);

    userEvent.click(screen.getByText(genres[0]));
    expect(onSelectHandler).toBeCalledTimes(1);
  });
});
