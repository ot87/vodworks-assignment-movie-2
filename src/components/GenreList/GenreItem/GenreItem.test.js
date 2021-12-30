import { render, screen } from '@testing-library/react';

import GenreItem from '.';
import { genres } from '../../../utils/testData';

const genre = genres[0];

const renderGenreItem = (renderProps = {}) => {
  const initProps = { item: genres[0] };
  const { rerender } = render(<GenreItem {...initProps} {...renderProps} />);

  return {
    genreItem: screen.getByText(genre),
    rerenderGenreItem: rerenderProps => {
      rerender(<GenreItem {...initProps} {...rerenderProps} />);
    }
  };
};

describe('GenreItem', () => {
  it('renders with name', () => {
    const { genreItem } = renderGenreItem();
    expect(genreItem).toBeInTheDocument();
  });

  it('renders as not active and not selected', () => {
    const { genreItem } = renderGenreItem();
    expect(genreItem).not.toHaveClass('genre-item-active');
    expect(genreItem).not.toContainHTML('<span class="arrow"></span>');
  });

  it('renders and rerenders as selected and back', () => {
    const { rerenderGenreItem } = renderGenreItem();

    rerenderGenreItem({ isSelected: true });

    let genreItem = screen.getByText(genre);
    expect(genreItem).toContainHTML('<span class="arrow"></span>');

    rerenderGenreItem({ isSelected: false });

    genreItem = screen.getByText(genre);
    expect(genreItem).not.toContainHTML('<span class="arrow"></span>');
  });

  it('renders and rerenders as active and back', () => {
    const { rerenderGenreItem } = renderGenreItem();

    rerenderGenreItem({ isActive: true, isSelected: true });

    let genreItem = screen.getByText(genre);
    expect(genreItem).toHaveClass('genre-item-active');
    expect(genreItem).toContainHTML('<span class="arrow"></span>');

    rerenderGenreItem({ isActive: false, isSelected: false });

    genreItem = screen.getByText(genre);
    expect(genreItem).not.toHaveClass('genre-item-active');
    expect(genreItem).not.toContainHTML('<span class="arrow"></span>');
  });

  it('renders as active and rerenders as selected', () => {
    const { rerenderGenreItem } = renderGenreItem({ isActive: true, isSelected: true });

    rerenderGenreItem({ isActive: false, isSelected: true });

    let genreItem = screen.getByText(genre);
    expect(genreItem).not.toHaveClass('genre-item-active');
    expect(genreItem).toContainHTML('<span class="arrow"></span>');
  });
});
