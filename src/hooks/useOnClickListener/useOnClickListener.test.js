import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';

import useOnClickListener from '.';

describe('useOnClickListener hook', () => {
  it('executes callback on mouse click', async () => {
    const callback = jest.fn();

    renderHook(() => useOnClickListener(callback));

    expect(callback).not.toBeCalled();

    userEvent.click(document.body);

    expect(callback).toBeCalled();
  });
});
