//project1/RandomFoodie/components/Map.js
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { MapView } from 'expo';
//import { PROVIDER_GOOGLE } from 'react-native-maps' // If Google map is preferred

const Marker = MapView.Marker;

//Create class map with markers to display restaurants
export default class Map extends Component {
  renderMarkers() {
    return this.props.places.map((place, i) => (
      <Marker key = { i }  title = { place.name } coordinate = { place.coords }/>
    ));
  }

  render() {
    const { region } = this.props

    return(
      <MapView
      //provider={PROVIDER_GOOGLE} //google map
      style = { styles.container }
      region = { region}
      showsUserLocation
      showsMyLocationButton
      >
        {this.renderMarkers()}
      </MapView>
    );
  }
}

const styles = {
  container: {
    width: '100%',
    height: '80%'
  }
}
