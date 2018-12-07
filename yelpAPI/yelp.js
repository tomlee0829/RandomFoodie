//project1/RandomFoodie/YelpAPI/yelp.js
import axios from 'axios';

//Yelp API authroization
const api = axios.create({
  baseURL: 'https://api.yelp.com/v3',
  headers: {
    'Authorization': 'Bearer Your-Yelp-Key' //Replace Your-Yelp-Key with actual key

  }
});

//Get restaurants from Yelp API with assigned parameters
export const getRestaurants = userLocation => {
	return api
		.get('/businesses/search', {
			params: {
				limit: 30,
				categories: 'chinese, japanese',
				...userLocation,
			}
		})
    //Return the results to map
    .then(res =>
      res.data.businesses.map(business => {
        return {
          name: business.name,
          coords: business.coordinates,
        };
      })
    )
    .catch(error => console.error(error));
};

export const randomRestaurant = userLocation => {
	return api
		.get('/businesses/search', {
			params: {
				limit: 1,
        offset: 0,
				categories: 'chinese, japanese',
				...userLocation,
			}
		})
    .then(res =>
      res.data.businesses.map(business => {
        return {
          name: business.name,
          coords: business.coordinates
        };
      })
    )
    .catch(error => console.error(error));
};

export default {
  getRestaurants,
  randomRestaurant
};
