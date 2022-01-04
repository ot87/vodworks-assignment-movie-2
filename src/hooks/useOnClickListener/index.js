import { useEffect } from 'react';

/**
 * Custom hook that listens to the mouse click and executes specified callback. Added in order to prevent loss of the focus of the active component.
 *
 * @param {(key: string) => void} callback - A callback to execute upon a click.
 * @returns {void}
 */
const useOnClickListener = (callback) => {
  useEffect(() => {
    window.addEventListener('click', callback);

    return () => {
      window.removeEventListener('click', callback);
    };
  }, [callback]);
};

export default useOnClickListener;
