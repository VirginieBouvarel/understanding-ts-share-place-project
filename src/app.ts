import axios from 'axios';

const GOOGLE_API_KEY = 'MY_API_KEY';

const form = document.querySelector('form')!;
const addressInput = document.getElementById('address') as HTMLInputElement;

type GoogleGeocodingResponse = { 
  results: { geometry: { location: { lat: number, lng: number }}}[];
  status: 'OK' | 'ZERO_RESULTS';
}

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`;
  console.log(URL);

  axios
  .get<GoogleGeocodingResponse>(URL)
  .then((response) => {
    if (response.data.status !== 'OK') {
      throw new Error('Could not fetch location!');
    }
    const coordinates = response.data.results[0].geometry.location;

    const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: coordinates,
      zoom: 16
    }); 
    new google.maps.Marker({ position: coordinates, map: map });
  })
  .catch((error) => {
    alert(error.message);
    console.log(error);
  });

}
form.addEventListener('submit', searchAddressHandler);