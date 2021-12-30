import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PosterBoard from '.';
import { movies } from '../../utils/testData';
import { getByRoleOption } from '../../utils/testHelpers';

const renderPosterBoard = (renderProps = {}) => {
  const onSelectHandler = jest.fn();
  const onEnterHandler  = jest.fn();
  const onBackHandler   = jest.fn();
  const initProps = {
    movies,
    onSelect: onSelectHandler,
    onEnter: onEnterHandler,
    onBack: onBackHandler
  };
  const { rerender } = render(<PosterBoard {...initProps} {...renderProps} />);

  return {
    posterBoard: screen.getByRole('grid'),
    onSelectHandler,
    onEnterHandler,
    onBackHandler,
    rerenderPosterBoard: rerenderProps => {
      rerender(<PosterBoard {...initProps} {...rerenderProps} />);
    }
  };
};

describe('PosterBoard', () => {
  it('renders an empty board', () => {
    const { posterBoard } = renderPosterBoard({ movies: [] });

    expect(posterBoard).toBeInTheDocument();
    expect(posterBoard).toBeEmptyDOMElement();
  });

  it('renders with posters that are not selected', () => {
    const { posterBoard } = renderPosterBoard();

    expect(posterBoard).toBeInTheDocument();
    movies.forEach(movie => {
      const poster = within(posterBoard).getByRole('img', getByRoleOption(movie.title));

      expect(poster).toBeInTheDocument();
      expect(poster).toHaveAttribute('src', movie.poster_path);
      expect(poster).toHaveAttribute('alt', getByRoleOption(movie.title).name);
      expect(poster).not.toHaveClass('poster-selected');
    });
  });

  it('renders with not selected posters and rerenders one selected and back', () => {
    const { rerenderPosterBoard } = renderPosterBoard();

    rerenderPosterBoard({ selectedPoster: movies[0].title });
    expect(screen.getByRole('img', getByRoleOption(movies[0].title))).toHaveClass('poster-selected');

    rerenderPosterBoard({ selectedPoster: null });
    expect(screen.getByRole('img', getByRoleOption(movies[0].title))).not.toHaveClass('poster-selected');
  });

  it('renders as inactive with not selected posters and rerenders one as active and selected and back', () => {
    const { rerenderPosterBoard } = renderPosterBoard();

    rerenderPosterBoard({ isActive: true, selectedPoster: movies[1].title });

    let poster = screen.getByRole('img', getByRoleOption(movies[1].title));
    expect(poster).toHaveClass('poster-active');
    expect(poster).toHaveClass('poster-selected');

    rerenderPosterBoard({ selectedPoster: null });
    expect(poster).not.toHaveClass('poster-active');
    expect(poster).not.toHaveClass('poster-selected');
  });
});

describe('PosterBoard keys', () => {
  const movieUp    = movies[5].title;
  const movieDown  = movies[5].title;
  const movieLeft  = movies[4].title;
  const movieRight = movies[1].title;

  it.each`
    key             | times | param
    ${'ArrowUp'}    | ${1}  | ${movieUp}
    ${'ArrowDown'}  | ${1}  | ${movieDown}
    ${'ArrowLeft'}  | ${1}  | ${movieLeft}
    ${'ArrowRight'} | ${1}  | ${movieRight}
  `(
    'renders with the first poster selected and an calls "onSelectHandler" by "$key" key "$times" time(s) with "$param"',
    ({ key, times, param }) => {
      const {
        posterBoard,
        onSelectHandler
      } = renderPosterBoard({ selectedPoster: movies[0].title});

      userEvent.click(posterBoard);
      userEvent.keyboard(`{${key}}`);
      expect(onSelectHandler).toBeCalledTimes(times);
      expect(onSelectHandler).toBeCalledWith(param);
    }
  );

  it('"Arrow" keys calls "onSelectHandler" with corresponding poster', () => {
    const {
      posterBoard,
      onSelectHandler,
      rerenderPosterBoard
    } = renderPosterBoard({ selectedPoster: movies[5].title });

    userEvent.click(posterBoard);
    userEvent.keyboard(`{ArrowDown}`);
    expect(onSelectHandler).toBeCalledWith(movies[0].title);

    rerenderPosterBoard({ selectedPoster: movies[5].title });
    userEvent.click(posterBoard);
    userEvent.keyboard(`{ArrowUp}`);
    expect(onSelectHandler).toBeCalledWith(movies[0].title);

    rerenderPosterBoard({ selectedPoster: movies[4].title });
    userEvent.click(posterBoard);
    userEvent.keyboard(`{ArrowRight}`);
    expect(onSelectHandler).toBeCalledWith(movies[0].title);

    rerenderPosterBoard({ selectedPoster: movies[0].title });
    userEvent.click(posterBoard);
    userEvent.keyboard(`{ArrowLeft}`);
    expect(onSelectHandler).toBeCalledWith(movies[4].title);

    expect(onSelectHandler).toBeCalledTimes(4);
  });

  it('"Enter" key calls "onEnterHandler" with a selected movie', () => {
    const {
      posterBoard,
      onEnterHandler
    } = renderPosterBoard({ selectedPoster: movies[0].title });

    userEvent.click(posterBoard);
    userEvent.keyboard(`{Enter}`);
    expect(onEnterHandler).toBeCalled();
    expect(onEnterHandler).toBeCalledWith(movies[0]);
  });

  it('"b" key calls "onBackHandler"', () => {
    const { posterBoard, onBackHandler } = renderPosterBoard();

    userEvent.click(posterBoard);
    userEvent.keyboard(`{b}`);
    expect(onBackHandler).toBeCalled();
  });
});
