
import React, { Component } from 'react';
import {  Alert,Platform,  StyleSheet,  Text,  View, Dimensions ,TouchableOpacity} from 'react-native';
import MapView, { ProviderPropType, Marker, AnimatedRegion,Animated } from 'react-native-maps';



const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 27.143215;
const LONGITUDE = 49.564573;
const LATITUDE_DELTA = 0.05;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

type Props = {};
export default class Addmarker extends Component<Props> {
  constructor(props) {
    super(props);

    this.map = null;

    this.state = {
      loaded:false,
      region:{
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta:LONGITUDE_DELTA
      },
      markers: [],
      centerMarker: [],
      /*markers: [{
          id:1,
          location: 'hello',
          coordinates: {
            latitude: 27.1432151,
            longitude: 49.564573
            }
        },
        {
          id:2,
          location: 'hello',
          coordinates: {
            latitude: 27.142508,
            longitude: 49.545948
            }
        }],
      centerMarker:[{
          latitude: 27.1432151,
          longitude: 49.564573
        },
        {
          latitude: 27.142508,
          longitude: 49.545948
        }]*/
    };
  }

  componentDidMount(){
      this.plotLocations();
     
      
  }
  
  plotLocations(){
    this.setState({
      markers:[],
      centerMarker:[]
    })
    return fetch('http://api.findplace2stay.com/index.php/admin/getLocations')
    .then((response) => response.json())
    .then((locations) => {

      for(x=0;x<locations.length;x++){
        const coord = {
          id:locations[x].id,
          location:locations[x].location,
          coordinates:{
            latitude: locations[x].latitude,
            longitude: locations[x].longitude
          }
        };

        this.setState({ markers: this.state.markers.concat(coord) })
        this.setState({ centerMarker: this.state.centerMarker.concat(coord.coordinates) })
        

      }
      this.onLayout();
      this.setState({loaded:true});

    })
    .catch((error) => {
      console.error(error);
    });

  }
  addRamdomLocation(){
    this.setState({loaded:false});
     const coord = {
        coordinates:{
          latitude: LATITUDE + ((Math.random()- 0.5) * (LATITUDE_DELTA / 2)),
          longitude: LONGITUDE + ((Math.random() - 0.5) * (LONGITUDE_DELTA / 2)),
        }
    };
    


    fetch('http://api.findplace2stay.com/index.php/admin/insertLocation', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: 1,
        latitude: coord.coordinates.latitude,
        longitude: coord.coordinates.longitude,
      }),
      }).then((response) => response.json())
      .catch((error) => {
      })
      .then((data) => {
        this.plotLocations();
       
      });;
    
  }
  onLayout(){
    setTimeout(() => {
      this.map.fitToCoordinates(this.state.centerMarker, { edgePadding: { top: 10, right: 10, bottom: 10, left: 10 }, animated: true })  
    }, 100);
    
  }
  renderMap(){
    return (
      <View style={styles.container}>
        <MapView ref={map => {this.map = map}}
          showsUserLocation = {true}
          zoomEnabled = {true}
          style={styles.map}
          region={this.state.region}
         
          >
          {this.state.markers.map(marker => (
            <MapView.Marker key={marker.id}
              coordinate={marker.coordinates}
              title={marker.location}
            />
          ))}
            
        
        </MapView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.addRamdomLocation()}
            style={[styles.bubble, styles.button]}
          >
            <Text>Add Ramdom Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

  }

  loading(){
    return(<View><Text>Loading...</Text></View>)
  }


  render() {
    if(this.state.loaded){
      return this.renderMap();
    }

    return this.loading();
      
  }
}


  
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
  }
});
  