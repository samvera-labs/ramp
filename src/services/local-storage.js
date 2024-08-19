// Adapted from https://blog.logrocket.com/using-localstorage-react-hooks/

import { useState, useEffect } from "react";

function getValue(key, defaultValue) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return getValue(key, defaultValue);
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      ; // no-op
    }
  }, [key, value]);

  return [value, setValue];
};
