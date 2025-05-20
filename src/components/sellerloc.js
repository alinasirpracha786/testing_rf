import React, { Component } from 'react';

import { StyleSheet, Text, View, PermissionsAndroid, Alert, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
//import { PermissionsAndroid } from 'react-native';
//import * as Permissions from "expo-permissions";
//import * as Location from "expo-location";

Geolocation.getCurrentPosition(info => console.log(info));
//Geolocation.setRNConfiguration(config);
export async function request_device_location_runtime_permission() {
 
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'ReactNativeCode Location Permission',
        'message': 'ReactNativeCode App needs access to your location '
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
 
      Alert.alert("Location Permission Granted.");
    }
    else {
 
      Alert.alert("Location Permission Not Granted");
 
    }
  } catch (err) {
    console.warn(err)
  }
}
//navigator.geolocation = require('@react-native-community/geolocation');
class sellerloc extends Component {

  constructor(){

    super()

    this.state={

      latitude : 0,
      longitude : 0,
      error : null

    }
  }

  async componentDidMount() {
 
    if(Platform.OS === 'android')
    {

    await request_device_location_runtime_permission();

    }
   // 
    this.getLongLat = navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 2000, maximumAge: 100, distanceFilter: 10 },
    );
 
  }

  componentWillUnmount() {

    navigator.geolocation.clearWatch(this.getLongLat);

  }

  render() {

    return (

      <View style={styles.MainContainer}>

        <Text style={styles.text}> Latitude = {this.state.latitude}</Text>

        <Text style={styles.text}> Longitude = {this.state.longitude}</Text>

      </View>
    );
  }
}

const styles = StyleSheet.create({

  MainContainer: {

    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5fcff',
    padding: 11

  },

  text:
  {
    fontSize: 22,
    color: '#000',
    textAlign: 'center',
    marginBottom: 10
  },

});


//export default sellerloc;