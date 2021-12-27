import { useEffect, useState } from 'react';

/**
 * Custom hook that listens to the specified keys press and executes specified callback with the pressed key as a param.
 *
 * @param {string[]}                  keys     - An array of the names of the keys to be listened to.
 * @param {(keyName: string) => void} callback - A callback to execute upon a key press.
 * @returns {void}
 */
const useDispatchPressedKey = (keys, callback) => {
  const [pressedKeys, setPressedKeys] = useState(
    () => keys.reduce(
      (prev, name) => {
        prev[name] = false;
        return prev;
      },
      {}
    )
  );

  useEffect(
    () => {
      const handleKeyDown = ({ key }) => {
        if (keys.includes(key)) {
          setPressedKeys(prev => ({ ...prev, [key]: true }));
        }
      };
      const handleKeyUp = ({ key }) => {
        if (keys.includes(key)) {
          setPressedKeys(prev => ({ ...prev, [key]: false }));
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    },
    [keys]
  );

  useEffect(
    () => {
      const pressedKey = Object.keys(pressedKeys).find(name => pressedKeys[name]);

      if (pressedKey) {
        callback(pressedKey);
      }
    },
    [pressedKeys, callback]
  );
};

export default useDispatchPressedKey;
