import { waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';

import useDispatchPressedKey from '.';

const correctKeys   = ['ArrowUp', 'ArrowDown'];
const incorrectKeys = ['Control'];

describe('useDispatchPressedKey hook', () => {
  it('executes callback with the pressed key as a param', async () => {
    const callback = jest.fn();

    renderHook(() => useDispatchPressedKey(correctKeys, callback));

    expect(callback).not.toBeCalled();

    correctKeys.forEach(async name => {
      // disable the line because of the "not wrapped in act" warning that happens
      // because of the internal "setState" in the "useEffect" in the hook
      // eslint-disable-next-line testing-library/no-unnecessary-act
      act(() => {
        userEvent.keyboard(`{${name}}`);
      });
      await waitFor(() => {
        expect(callback).toBeCalledTimes(1);
      });
      expect(callback).toBeCalledWith(name);
    });
  });

  it('does not execute for incorrect key', () => {
    const callback = jest.fn();

    renderHook(() => useDispatchPressedKey(correctKeys, callback));

    incorrectKeys.forEach(name => {
      userEvent.keyboard(`{${name}}`);
    });

    expect(callback).not.toBeCalled();
  });
});
