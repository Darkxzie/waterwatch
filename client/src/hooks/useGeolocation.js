import { useEffect, useState } from 'react';

const HYDERABAD = { latitude: 17.385, longitude: 78.4867 };

export function useGeolocation() {
  const [coords, setCoords] = useState(HYDERABAD);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => setError('Location access denied. Using Hyderabad as default.')
    );
  }, []);

  return { coords, error, setCoords };
}
