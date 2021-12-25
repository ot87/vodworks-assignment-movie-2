import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GenreItem from '.';
import { genres } from '../../../utils/testData';

const genre = genres[0];

describe('GenreItem', () => {
  it('renders with name', () => {
    render(<GenreItem item={genre} onClick={jest.fn()} />);
    expect(screen.getByText(genre)).toBeInTheDocument();
  });

  it('renders as not selected', () => {
    render(<GenreItem item={genre} onClick={jest.fn()} />);
    expect(screen.getByText(genre)).not.toHaveClass('genre-item-selected');
  });

  it('renders as not selected and rerenders as selected and back', () => {
    const { rerender } = render(<GenreItem item={genre} onClick={jest.fn()} />);

    rerender(<GenreItem item={genre} isSelected={true} onClick={jest.fn()} />);

    let genreItem = screen.getByText(genre);
    expect(genreItem).toHaveClass('genre-item-selected');
    expect(genreItem).toContainHTML('<span class="arrow"></span>');

    rerender(<GenreItem item={genre} isSelected={false} onClick={jest.fn()} />);

    genreItem = screen.getByText(genre);
    expect(genreItem).not.toHaveClass('genre-item-selected');
    expect(genreItem).not.toContainHTML('<span class="arrow"></span>');
  });

  it('calls the onClick callback handler', () => {
    const onClickHandler = jest.fn();

    render(<GenreItem item={genre} onClick={onClickHandler} />);

    userEvent.click(screen.getByText(genre));
    expect(onClickHandler).toBeCalledTimes(1);
  });
});
