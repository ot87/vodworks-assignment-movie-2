import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GenreList from '.';
import { genres } from '../../utils/testData';

const renderGenreList = (renderProps = {}) => {
  const onSelectHandler = jest.fn();
  const onEnterHandler  = jest.fn();
  const initProps = {
    list: genres,
    onSelect: onSelectHandler,
    onEnter: onEnterHandler
  };
  const { rerender } = render(<GenreList {...initProps} {...renderProps} />);

  return {
    genreList: screen.getByRole('navigation'),
    onSelectHandler,
    onEnterHandler,
    rerenderGenreList: rerenderProps => {
      rerender(<GenreList {...initProps} {...rerenderProps} />);
    }
  };
};

describe('GenreList', () => {
  it('renders with an empty list', () => {
    const { genreList } = renderGenreList({ list: [] });

    expect(genreList).toBeInTheDocument();
    expect(genreList).toBeEmptyDOMElement();
  });

  it('renders with genres that are not selected', () => {
    const { genreList } = renderGenreList();

    expect(genreList).toBeInTheDocument();
    genres.forEach(genre => {
      const genreItem = within(genreList).getByText(genre);
      expect(genreItem).toBeInTheDocument();
      expect(genreItem).not.toHaveClass('genre-item-active');
    });
  });

  it('renders with not selected genres and rerenders one selected and back', () => {
    const { rerenderGenreList } = renderGenreList();

    rerenderGenreList({ selectedGenre: genres[0] });
    expect(screen.getByText(genres[0])).toContainHTML('<span class="arrow"></span>');

    rerenderGenreList({ selectedGenre: null });
    expect(screen.getByText(genres[0])).not.toContainHTML('<span class="arrow"></span>');
  });

  it('renders as inactive with not selected genres and rerenders one as active and selected and back', () => {
    const { rerenderGenreList } = renderGenreList();

    rerenderGenreList({ isActive: true, selectedGenre: genres[1] });

    let genreItem = screen.getByText(genres[1]);
    expect(genreItem).toHaveClass('genre-item-active');
    expect(genreItem).toContainHTML('<span class="arrow"></span>');

    rerenderGenreList({ selectedGenre: null });
    expect(genreItem).not.toHaveClass('genre-item-active');
    expect(genreItem).not.toContainHTML('<span class="arrow"></span>');
  });
});

describe('GenreList keys', () => {
  it.each`
    key            | times
    ${'ArrowUp'}   | ${1}
    ${'ArrowDown'} | ${1}
  `(
    'renders as inactive and calls "onSelectHandler" with the first genre by "$key" key "$times" time(s)',
    ({ key, times }) => {
      const { genreList, onSelectHandler } = renderGenreList();

      userEvent.click(genreList);
      userEvent.keyboard(`{${key}}`);
      expect(onSelectHandler).toBeCalledTimes(times);
      expect(onSelectHandler).toBeCalledWith(genres[0]);
    }
  );

  it('"ArrowDown" and "ArrowUp" keys calls "onSelectHandler" with corresponding genre', () => {
    const { genreList, onSelectHandler, rerenderGenreList } = renderGenreList({ selectedGenre: genres[1] });

    userEvent.click(genreList);
    userEvent.keyboard(`{ArrowDown}`);
    expect(onSelectHandler).toBeCalledWith(genres[2]);

    rerenderGenreList({ selectedGenre: genres[2] });

    userEvent.click(genreList);
    userEvent.keyboard(`{ArrowUp}`);
    expect(onSelectHandler).toBeCalledWith(genres[1]);

    expect(onSelectHandler).toBeCalledTimes(2);
  });

  it('"Enter" key calls "onEnterHandler"', () => {
    const { genreList, onEnterHandler } = renderGenreList();

    userEvent.click(genreList);
    userEvent.keyboard(`{Enter}`);
    expect(onEnterHandler).toBeCalled();
  });

  it('"b" key calls "onSelectHandler" with "null" value', () => {
    const { genreList, onSelectHandler } = renderGenreList();

    userEvent.click(genreList);
    userEvent.keyboard(`{b}`);
    expect(onSelectHandler).toBeCalledTimes(1);
    expect(onSelectHandler).toBeCalledWith(null);
  });
});
