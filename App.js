//App.js
import React, { Component } from 'react';
import { Button } from 'react-native';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import { Location, Permissions } from 'expo'
import YelpService from './yelpAPI/yelp'
import Map from './components/map'

//Hard coded coordinates as user's location for iOS simulator
const deltas = {
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
};

const region = {
  latitude: 47.673988,
  longitude: -122.121513,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
}

//HomeScreen tab
export class HomeScreen extends Component {
  render() {
    return(
      <View style = {{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>🍕🥪🌭🍔🍟🍗🍳</Text>
      <Text>Welcome to RandomFoodie</Text>

      //Create a button for displaying restaurants near user's location
      <Button
        title = "Find Restaurants near me"
        onPress = {() => this.props.navigation.navigate('Restaurants')}
      />
      </View>
    );
  }
}

//Restaurant tab
export class App extends Component {
//Inital states
  state = {
    region: null,
    restaurants: [],
    random: []
  };

  componentWillMount() {
  this.getLocationAsync();
}

//This method gets restaurants based on user's location
getRestaurants = async() => {
   const { latitude, longitude } = this.state.region;
   const userLocation = { latitude, longitude };
   const restaurants = await YelpService.getRestaurants(userLocation);
   this.setState({ restaurants });
 };

//This method selects a random restaurant based on user's location
 getRandom = async() => {
    const { latitude, longitude } = this.state.region;
    const userLocation = { latitude, longitude };
    const random = await YelpService.randomRestaurant(userLocation);
    this.setState({ random });
  };

//Check if user granted the application to access location
getLocationAsync = async() => {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') {
    this.setState({
    errorMessage: 'Permission to access location was denied'
  });
}

  let location = await Location.getCurrentPositionAsync({});
  const region = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    ...deltas
  };

  await this.setState({ region });
  await this.getRestaurants();
  await this.getRandom();
}

//Display restaurants with markers on map
render() {
    const { region, restaurants } = this.state;
    return(
      <SafeAreaView style = { styles.container }>
      <Map region = { region } places={ restaurants }/>
      <View style = {{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

      /*This button will select a random Restaurant for the user
        and display the result in Random tab*/
      <Button
        title = "Pick a Random Restaurant 🍽"
        onPress = {() => this.props.navigation.navigate('Random')}
      />
      </View>
      </SafeAreaView>
    );
  }
}

//Random tab
export class RandomPick extends Component{
  state = {
    region: null,
    random: []
  };

  componentWillMount() {
  this.getLocationAsync();
}

 getRandom = async() => {
    const { latitude, longitude } = this.state.region;
    const userLocation = { latitude, longitude };
    const random = await YelpService.randomRestaurant(userLocation);
    this.setState({ random });
  };

getLocationAsync = async() => {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') {
    this.setState({
    errorMessage: 'Permission to access location was denied'
  });
}

  let location = await Location.getCurrentPositionAsync({});
  const region = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    ...deltas
  };

  await this.setState({ region });
  await this.getRandom();
}

  //Display the random Restaurant Result
  render() {
    const { region, random } = this.state;
    return (
      <SafeAreaView style = { styles.container }>
      <Map region = { region } places = { random }/>
      <View style = {{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>ENJOY🍴🍺</Text>
      </View>
      </SafeAreaView>
    );
  }
}

//UI style
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		justifyContent: 'flex-start'
  },
  button: {
      borderRadius: 7,
      padding: 10,
      backgroundColor: '#4d9be3'
  }
})

//Tab navigation
export default createBottomTabNavigator({
  Home: HomeScreen,
  Restaurants: App,
  Random: RandomPick
});
