import { render, screen } from '@testing-library/react';

import GenreItem from '.';
import { genres } from '../../../utils/testData';

const genre = genres[0];

describe('GenreItem', () => {
  it('renders with name', () => {
    render(<GenreItem item={genre} />);
    expect(screen.getByText(genre)).toBeInTheDocument();
  });

  it('renders as not active and not selected', () => {
    render(<GenreItem item={genre} />);
    expect(screen.getByText(genre)).not.toHaveClass('genre-item-active');
    expect(screen.getByText(genre)).not.toContainHTML('<span class="arrow"></span>');
  });

  it('renders and rerenders as selected and back', () => {
    const { rerender } = render(<GenreItem item={genre} />);

    rerender(<GenreItem item={genre} isSelected={true} />);

    let genreItem = screen.getByText(genre);
    expect(genreItem).toContainHTML('<span class="arrow"></span>');

    rerender(<GenreItem item={genre} isSelected={false} />);

    genreItem = screen.getByText(genre);
    expect(genreItem).not.toContainHTML('<span class="arrow"></span>');
  });

  it('renders and rerenders as active and back', () => {
    const { rerender } = render(<GenreItem item={genre} />);

    rerender(<GenreItem item={genre} isActive={true} isSelected={true} />);

    let genreItem = screen.getByText(genre);
    expect(genreItem).toHaveClass('genre-item-active');
    expect(genreItem).toContainHTML('<span class="arrow"></span>');

    rerender(<GenreItem item={genre} isActive={false} isSelected={false} />);

    genreItem = screen.getByText(genre);
    expect(genreItem).not.toHaveClass('genre-item-active');
    expect(genreItem).not.toContainHTML('<span class="arrow"></span>');
  });

  it('renders as active and rerenders as selected', () => {
    const { rerender } = render(<GenreItem item={genre} isActive={true} isSelected={true} />);

    rerender(<GenreItem item={genre} isActive={false} isSelected={true} />);

    let genreItem = screen.getByText(genre);
    expect(genreItem).not.toHaveClass('genre-item-active');
    expect(genreItem).toContainHTML('<span class="arrow"></span>');
  });
});
