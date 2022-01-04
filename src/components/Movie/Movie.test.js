import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';

import Movie from '.';
import { movies }  from '../../utils/testData';
import { getByRoleOption } from '../../utils/testHelpers';

const movie = movies[0];

const renderMovie = (ref = false) => {
  const onBackHandler = jest.fn();
  const initProps = {
    movie,
    onBack: onBackHandler
  };

  if (ref) {
    initProps['ref'] = ref;
  }

  render(<Movie {...initProps} />);

  const movieElement = screen.getByRole('article');

  return {
    movieElement,
    playButton: within(movieElement).getByText('PLAY'),
    trailerButton: within(movieElement).getByText('TRAILER'),
    addToListButton: within(movieElement).getByText('ADD TO LIST'),
    onBackHandler
  };
};

describe('Movie', () => {
  it('renders with all the movie information', () => {
    const { movieElement } = renderMovie();

    expect(movieElement).toBeInTheDocument();

    expect(within(movieElement).getByText(movie.title)).toBeInTheDocument();
    expect(within(movieElement).getByText(movie.release_date)).toBeInTheDocument();
    expect(
      within(movieElement).getByText(
        movie.genre_ids.map(genre => `${genre[0].toUpperCase()}${genre.slice(1)}`).join(' ')
      )
    ).toBeInTheDocument();
    expect(within(movieElement).getByText(movie.overview)).toBeInTheDocument();

    const byRoleOption = getByRoleOption(movie.title);
    const poster = within(movieElement).getByRole('img', byRoleOption);
    expect(poster).toBeInTheDocument();
    expect(poster).toHaveAttribute('src', movie.poster_path);
    expect(poster).toHaveAttribute('alt', byRoleOption.name);
  });

  it('renders with the buttons, the first one is focused', () => {
    const {
      playButton,
      trailerButton,
      addToListButton
    } = renderMovie();

    expect(playButton).toBeInTheDocument();
    expect(trailerButton).toBeInTheDocument();
    expect(addToListButton).toBeInTheDocument();

    expect(playButton).toHaveFocus();
    expect(trailerButton).not.toHaveFocus();
    expect(addToListButton).not.toHaveFocus();
  });
});

describe('Movie keys', () => {
  it('swithes through all the buttons to the right', () => {
    const {
      movieElement,
      playButton,
      trailerButton,
      addToListButton
    } = renderMovie();

    userEvent.click(movieElement);
    userEvent.keyboard('{ArrowRight}');
    expect(playButton).not.toHaveFocus();
    expect(trailerButton).toHaveFocus();
    expect(addToListButton).not.toHaveFocus();

    userEvent.click(movieElement);
    userEvent.keyboard('{ArrowRight}');
    expect(playButton).not.toHaveFocus();
    expect(trailerButton).not.toHaveFocus();
    expect(addToListButton).toHaveFocus();

    userEvent.click(movieElement);
    userEvent.keyboard('{ArrowRight}');
    expect(playButton).toHaveFocus();
    expect(trailerButton).not.toHaveFocus();
    expect(addToListButton).not.toHaveFocus();
  });

  it('swithes through all the buttons to the left', () => {
    const {
      movieElement,
      playButton,
      trailerButton,
      addToListButton
    } = renderMovie();

    userEvent.click(movieElement);
    userEvent.keyboard('{ArrowLeft}');
    expect(playButton).not.toHaveFocus();
    expect(trailerButton).not.toHaveFocus();
    expect(addToListButton).toHaveFocus();

    userEvent.click(movieElement);
    userEvent.keyboard('{ArrowLeft}');
    expect(playButton).not.toHaveFocus();
    expect(trailerButton).toHaveFocus();
    expect(addToListButton).not.toHaveFocus();

    userEvent.click(movieElement);
    userEvent.keyboard('{ArrowLeft}');
    expect(playButton).toHaveFocus();
    expect(trailerButton).not.toHaveFocus();
    expect(addToListButton).not.toHaveFocus();
  });

  it('"b" key calls "onBackHandler"', () => {
    const { onBackHandler } = renderMovie();

    userEvent.keyboard('{b}');
    expect(onBackHandler).toBeCalled();
  });

  it('nothing happens for another key, for ex. "Control"', () => {
    const {
      playButton,
      trailerButton,
      addToListButton,
      onBackHandler
    } = renderMovie();

    userEvent.keyboard('{Control}');
    expect(playButton).toHaveFocus();
    expect(trailerButton).not.toHaveFocus();
    expect(addToListButton).not.toHaveFocus();
    expect(onBackHandler).not.toBeCalled();
  });
});

describe('Movie ref', () => {
  it('focuses the first button', () => {
    const movieRef = createRef();
    const {
      playButton,
      trailerButton,
      addToListButton
    } = renderMovie(movieRef);

    movieRef.current.focus();

    expect(playButton).toHaveFocus();
    expect(trailerButton).not.toHaveFocus();
    expect(addToListButton).not.toHaveFocus();
  });

  it('blurs the movie components', () => {
    const movieRef = createRef();
    const { movieElement } = renderMovie(movieRef);

    movieRef.current.blur();

    expect(movieElement).not.toHaveFocus();
  });
});
