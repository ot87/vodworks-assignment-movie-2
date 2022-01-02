import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import MainView from '.';
import { genres, movies }  from '../../utils/testData';
import { getByRoleOption } from '../../utils/testHelpers';

afterEach(() => {
  jest.restoreAllMocks();
});

const renderMainView = (renderProps = {}) => {
  const refSpy = jest.spyOn(React, 'useRef').mockReturnValue({ current: null });
  const genreRef = refSpy();
  const posterRef = refSpy();
  const focusComponentHandler = jest.fn();
  const setMovieHandler = jest.fn();
  const initProps = {
    genres,
    movies,
    genreRef,
    posterRef,
    activeRef: refSpy(),
    focusComponent: focusComponentHandler,
    setMovie: setMovieHandler
  };

  render(<MainView {...initProps} {...renderProps} />);

  return {
    mainView: screen.getByRole('main'),
    genreList: screen.getByRole('navigation'),
    posterBoard: screen.getByRole('grid'),
    genreRef,
    posterRef,
    focusComponentHandler,
    setMovieHandler
  };
};

describe('MainView', () => {
  it('renders with the heading and the empty genres list and the movie posters board', () => {
    const { mainView } = renderMainView({ genres: [], movies: [] });

    expect(mainView).toBeInTheDocument();

    expect(
      within(mainView).getByRole('heading', { name: /filmer/i })
    ).toBeInTheDocument();

    const genreList = within(mainView).getByRole('navigation');
    expect(genreList).toBeInTheDocument();
    expect(genreList).toBeEmptyDOMElement();

    const posterBoard = within(mainView).getByRole('grid');
    expect(posterBoard).toBeInTheDocument();
    expect(posterBoard).toBeEmptyDOMElement();
  });

  it('renders with all the genres and movie posters', () => {
    const { mainView } = renderMainView();

    expect(mainView).toBeInTheDocument();

    const genreList = within(mainView).getByRole('navigation');
    expect(genreList).toBeInTheDocument();
    genres.forEach(genre => {
      expect(within(genreList).getByText(genre)).toBeInTheDocument();
    });

    const posterBoard = within(mainView).getByRole('grid');
    expect(posterBoard).toBeInTheDocument();

    movies.forEach(movie => {
      const poster = within(posterBoard).getByRole('img', getByRoleOption(movie.title));

      expect(poster).toBeInTheDocument();
      expect(poster).toHaveAttribute('src', movie.poster_path);
      expect(poster).toHaveAttribute('alt', getByRoleOption(movie.title).name);
    });
  });
});

describe('MainView - GenreList keys', () => {
  it('renders filtered movie posters depends on selected genre', () => {
    const { genreList } = renderMainView();

    userEvent.click(genreList);
    genres.forEach(genre => {
      userEvent.keyboard('{ArrowDown}');

      expect(screen.getByText(genre)).toHaveClass('genre-item-active');
      expect(screen.getByText(genre)).toContainHTML('<span class="arrow"></span>');

      movies
        .filter(movie => movie.genre_ids.includes(genre))
        .forEach(movie => {
          expect(screen.getByRole('img', getByRoleOption(movie.title))).toBeInTheDocument();
        });
    });
  });

  it('"Enter" key on genre', () => {
    const { genreList, posterRef, focusComponentHandler } = renderMainView();

    userEvent.click(genreList);
    userEvent.keyboard('{ArrowDown}');
    userEvent.keyboard('{Enter}');
    expect(focusComponentHandler).toBeCalled();
    expect(focusComponentHandler).toBeCalledWith(posterRef);
    expect(screen.getByRole('img', getByRoleOption(movies[0].title))).toHaveClass('poster-selected');
  });

  it('activates poster after "Enter" key on genre', () => {
    const { genreList, posterBoard } = renderMainView();

    userEvent.click(genreList);
    userEvent.keyboard('{ArrowDown}');
    userEvent.keyboard('{Enter}');

    userEvent.click(posterBoard);
    expect(screen.getByRole('img', getByRoleOption(movies[0].title))).toHaveClass('poster-active');
    expect(screen.getByRole('img', getByRoleOption(movies[0].title))).toHaveClass('poster-selected');
  });

  it('"b" key on genre', () => {
    const { genreList } = renderMainView();

    userEvent.click(genreList);
    userEvent.keyboard('{ArrowDown}');
    expect(screen.getByText(genres[0])).toHaveClass('genre-item-active');

    userEvent.keyboard('{b}');
    expect(screen.getByText(genres[0])).not.toHaveClass('genre-item-active');
  });
});

describe('MainView - PosterBoard keys', () => {
  it('switches through posters', () => {
    const { genreList, posterBoard } = renderMainView();

    userEvent.click(genreList);
    userEvent.keyboard('{ArrowDown}');
    userEvent.keyboard('{Enter}');

    const filteredMovies = movies.filter(movie => movie.genre_ids.includes(genres[0]));

    userEvent.click(posterBoard);
    expect(screen.getByRole('img', getByRoleOption(filteredMovies[0].title))).toHaveClass('poster-active');
    expect(screen.getByRole('img', getByRoleOption(filteredMovies[0].title))).toHaveClass('poster-selected');

    userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('img', getByRoleOption(filteredMovies[1].title))).toHaveClass('poster-active');
    expect(screen.getByRole('img', getByRoleOption(filteredMovies[1].title))).toHaveClass('poster-selected');

    userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('img', getByRoleOption(filteredMovies[0].title))).toHaveClass('poster-active');
    expect(screen.getByRole('img', getByRoleOption(filteredMovies[0].title))).toHaveClass('poster-selected');

    userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('img', getByRoleOption(filteredMovies[5].title))).toHaveClass('poster-active');
    expect(screen.getByRole('img', getByRoleOption(filteredMovies[5].title))).toHaveClass('poster-selected');

    userEvent.keyboard('{ArrowUp}');
    expect(screen.getByRole('img', getByRoleOption(filteredMovies[0].title))).toHaveClass('poster-active');
    expect(screen.getByRole('img', getByRoleOption(filteredMovies[0].title))).toHaveClass('poster-selected');
  });

  it('"Enter" key on poster', () => {
    const { genreList, posterBoard, setMovieHandler } = renderMainView();

    userEvent.click(genreList);
    userEvent.keyboard('{ArrowDown}');
    userEvent.keyboard('{Enter}');

    userEvent.click(posterBoard);
    userEvent.keyboard('{Enter}');
    expect(setMovieHandler).toBeCalled();
    expect(setMovieHandler).toBeCalledWith(movies[0]);
  });

  it('"b" key from poster', () => {
    const {
      genreList,
      posterBoard,
      genreRef,
      focusComponentHandler
    } = renderMainView();

    userEvent.click(genreList);
    userEvent.keyboard('{ArrowDown}');
    userEvent.keyboard('{Enter}');

    userEvent.click(posterBoard);
    expect(screen.getByRole('img', getByRoleOption(movies[0].title))).toHaveClass('poster-active');
    expect(screen.getByRole('img', getByRoleOption(movies[0].title))).toHaveClass('poster-selected');

    userEvent.keyboard('{b}');
    expect(focusComponentHandler).toBeCalled();
    expect(focusComponentHandler).toBeCalledWith(genreRef);
    expect(screen.getByRole('img', getByRoleOption(movies[0].title))).not.toHaveClass('poster-active');
    expect(screen.getByRole('img', getByRoleOption(movies[0].title))).not.toHaveClass('poster-selected');
  });
});
