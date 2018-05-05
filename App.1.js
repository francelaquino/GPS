
import React, { Component } from 'react';
import {  Alert,Platform,  StyleSheet,  Text,  View, Dimensions ,TouchableOpacity} from 'react-native';
import MapView, { ProviderPropType, Marker, AnimatedRegion } from 'react-native-maps';


const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.05;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
     
      region:{
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta:LONGITUDE_DELTA
      },
    };
  }

  componentDidMount(){
    setTimeout(() => {
      this.animate();
    }, 10);
  }

  animate() {
    const { coordinate } = this.state;
  

    navigator.geolocation.getCurrentPosition((position) => {
      var lat= position.coords.latitude * (LATITUDE_DELTA / 2);
      var lon= position.coords.longitude * (LONGITUDE_DELTA / 2);

      lon=49.564259;
      lat=27.142310;
      
      const newCoordinate = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
        
        //latitude:lat,
        //longitude: lon
      };

      this.setState({
        region:{
          latitude:lat,
          longitude:lon,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        },
        
      })
      
      const { latitude, longitude, latitudeDelta, longitudeDelta } = this.state.region;
      this.map.animateToRegion({
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta
      },100)

        if (Platform.OS === 'android') {
          if (this.marker) {
            this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
          }
        } else {
          coordinate.timing(newCoordinate).start();
        }
      
    }, (error) => {
      alert(JSON.stringify(error))
    }, {
      enableHighAccuracy: true,
    });

    

/*
    const newCoordinate = {
      latitude: LATITUDE + ((Math.random() - 0.5) * (LATITUDE_DELTA / 2)),
      longitude: LONGITUDE + ((Math.random() - 0.5) * (LONGITUDE_DELTA / 2)),
    };*/
/*
    if (Platform.OS === 'android') {
      if (this.marker) {
        this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
      }
    } else {
      coordinate.timing(newCoordinate).start();
    }*/
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView ref={map => {this.map = map}}
          showsUserLocation = {true}
          zoomEnabled = {true}
          style={styles.map}
          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
        
          <MapView.Marker
          coordinate={{latitude: Number(this.state.region.latitude), longitude: Number(this.state.region.longitude)}}/>

        </MapView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.animate()}
            style={[styles.bubble, styles.button]}
          >
            <Text>Animate</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

App.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});