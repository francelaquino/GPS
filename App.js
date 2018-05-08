
import React, { Component } from 'react';
import {  Alert,Platform,  StyleSheet,  Text,  View, Dimensions ,TouchableOpacity} from 'react-native';
import Addmarker from './Addmarker';
import BackgroundFetch from "react-native-background-fetch";
import { MapView } from 'react-native-maps';

type Props = {};
export default class App extends Component<Props> {

  addLocation(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude=position.coords.latitude;
        longitude=position.coords.longitude;
        
          fetch('http://api.findplace2stay.com/index.php/admin/insertLocation', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userid: 1,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
          }).then((response) => response.json())
          .catch((error) => {
          })
          .then((data) => {
          
          });
      },
      (error) => console.log(error),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    );

  }

  componentDidMount() {
    // Configure it.
    BackgroundFetch.configure({
      minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
      stopOnTerminate: false,   // <-- Android-only,
      startOnBoot: true         // <-- Android-only
    }, () => {

     

      console.log("[js] Received background-fetch event");
      this.addLocation();
      // Required: Signal completion of your task to native code
      // If you fail to do this, the OS can terminate your app
      // or assign battery-blame for consuming too much background-time
      BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
    }, (error) => {
      console.log("[js] RNBackgroundFetch failed to start");
    });

    // Optional: Query the authorization status.
    BackgroundFetch.status((status) => {
      switch(status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.log("BackgroundFetch restricted");
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.log("BackgroundFetch denied");
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
       
          console.log("BackgroundFetch is enabled");
          break;
      }
    });
  
  }


  render() {
    return (
        <Addmarker></Addmarker>
    );
  }
}


const styles = StyleSheet.create({
  
});