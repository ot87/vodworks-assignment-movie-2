import { render, screen } from '@testing-library/react';

import Poster from '.';
import { movies } from '../../../utils/testData';
import { getByRoleOption } from '../../../utils/testHelpers';

const movie = movies[0];
const byRoleOption = getByRoleOption(movie.title);

const renderPoster = (renderProps = {}) => {
  const initProps = {
    posterPath: movie.poster_path,
    title: movie.title
  };
  const { rerender } = render(<Poster {...initProps} {...renderProps} />);

  return {
    poster: screen.getByRole('img', byRoleOption),
    rerenderPoster: rerenderProps => {
      rerender(<Poster {...initProps} {...rerenderProps} />);
    }
  };
};

describe('Poster', () => {
  it('renders with src and alt attributes', () => {
    const { poster } = renderPoster();

    expect(poster).toBeInTheDocument();
    expect(poster).toHaveAttribute('src', movie.poster_path);
    expect(poster).toHaveAttribute('alt', byRoleOption.name);
  });

  it('renders as not active and not selected', () => {
    const { poster } = renderPoster();

    expect(poster).not.toHaveClass('poster-active');
    expect(poster).not.toHaveClass('poster-selected');
  });

  it('renders and rerenders as selected and back', () => {
    const { rerenderPoster } = renderPoster();

    rerenderPoster({ isSelected: true });
    expect(screen.getByRole('img', byRoleOption)).toHaveClass('poster-selected');

    rerenderPoster({ isSelected: false });
    expect(screen.getByRole('img', byRoleOption)).not.toHaveClass('poster-selected');
  });

  it('renders and rerenders as active and back', () => {
    const { rerenderPoster } = renderPoster();

    rerenderPoster({ isActive: true, isSelected: true });

    let poster = screen.getByRole('img', byRoleOption);
    expect(poster).toHaveClass('poster-active');
    expect(poster).toHaveClass('poster-selected');

    rerenderPoster({ isActive: false, isSelected: false });

    poster = screen.getByRole('img', byRoleOption);
    expect(poster).not.toHaveClass('poster-active');
    expect(poster).not.toHaveClass('poster-selected');
  });

  it('renders as active and rerenders as selected', () => {
    const { rerenderPoster } = renderPoster({ isActive: true, isSelected: true });

    rerenderPoster({ isActive: false, isSelected: true });

    let poster = screen.getByRole('img', byRoleOption);
    expect(poster).not.toHaveClass('poster-active');
    expect(poster).toHaveClass('poster-selected');
  });
});
