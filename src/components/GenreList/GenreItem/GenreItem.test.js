import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GenreItem from '.';

const item = 'item1';

describe('GenreItem', () => {
  it('renders with name', () => {
    render(<GenreItem item={item} onClick={jest.fn()} />);
    expect(screen.getByText(item)).toBeInTheDocument();
  });

  it('renders as not selected', () => {
    render(<GenreItem item={item} onClick={jest.fn()} />);
    expect(screen.getByText(item)).not.toHaveClass('genre-item-selected');
  });

  it('renders as not selected and rerenders as selected and back', () => {
    const { rerender } = render(<GenreItem item={item} onClick={jest.fn()} />);

    rerender(<GenreItem item={item} isSelected={true} onClick={jest.fn()} />);

    let genreItem = screen.getByText(item);
    expect(genreItem).toHaveClass('genre-item-selected');
    expect(genreItem).toContainHTML('<span class="arrow"></span>');

    rerender(<GenreItem item={item} isSelected={false} onClick={jest.fn()} />);

    genreItem = screen.getByText(item);
    expect(genreItem).not.toHaveClass('genre-item-selected');
    expect(genreItem).not.toContainHTML('<span class="arrow"></span>');
  });

  it('calls the onClick callback handler', () => {
    const onClickHandler = jest.fn();

    render(<GenreItem item={item} onClick={onClickHandler} />);

    userEvent.click(screen.getByText(item));
    expect(onClickHandler).toBeCalledTimes(1);
  });
});
