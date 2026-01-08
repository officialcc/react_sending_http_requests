import { useEffect, useState } from 'react';

import Places from './Places.jsx';
import ErrorPage from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        const places = await fetchAvailablePlaces();
        // const response = await fetch('http://localhost:3000/places');
        // const resData = await response.json();

        // if (!response.ok) {
        //   throw new Error('Could not fetch places');
        // }

        navigator.geolocation.getCurrentPosition((position) => {
          // const sortedPlaces = sortPlacesByDistance(resData.places, position.coords.latitude, position.coords.longitude)
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
      } catch (error) {
        setError({
          message: error.message || 'Could not fetch places, please try again later.',
        });
        setIsFetching(false);
      }
    }

    fetchPlaces();
  }, []);

  if (error) {
    return <ErrorPage title="An Error Occurred!" message={error.message} />;
  }

    // Replace with async/await
  //   fetch('http://localhost:3000/places').then((response) => {
  //     return response.json()
  //   }).then((resData) => {
  //     setAvailablePlaces(resData.places);
  //   });
  // }, []);

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data"
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
