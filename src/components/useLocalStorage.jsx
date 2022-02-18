import { useEffect, useState } from 'react';

export default function useLocalStorage(resourceKey) {
  const [resource, setResource] = useState(null);

  useEffect(getItem, [resourceKey]);

  function getItem() {
    const localStorageResource = localStorage.getItem(resourceKey);

    if (localStorageResource === null) {
      setResource(null);
      return;
    }

    let parsedData;
    try {
      parsedData = JSON.parse(localStorageResource);
    } catch (err) {
      setResource(null);
      localStorage.removeItem(resourceKey);
      return;
    }
    const { expiryDate, data } = parsedData;

    if (expiryDate && new Date(expiryDate) - new Date() < 0) {
      localStorage.removeItem(resourceKey);
      setResource(null);
      return;
    }

    setResource(data);
  }

  function setItem(data, expiryDate) {
    if (data === null) {
      localStorage.removeItem(resourceKey);
      setResource(null);
      return;
    }

    localStorage.setItem(resourceKey, JSON.stringify({ data, expiryDate }));
    setResource(data);
  }

  return [resource, setItem];
}
