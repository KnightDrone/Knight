import React, { useState, useEffect } from "react";
import { StyleSheet, View, Animated } from "react-native";
import * as Location from "expo-location";
import { Marker } from "react-native-maps";

interface LocationMarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

/**
 * LocationMarker component displays a marker on a map at a specific coordinate.
 *
 * @component
 * @param {LocationMarkerProps} props - The props for the LocationMarker component.
 * @param {Coordinate} props.coordinate - The coordinate where the marker should be placed.
 * @returns {JSX.Element} The LocationMarker component.
 */
const LocationMarker: React.FC<LocationMarkerProps> = ({ coordinate }) => {
  const [heading, setHeading] = useState(0);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const subscribeHeading = async () => {
      subscription = await Location.watchHeadingAsync((headingData) => {
        setHeading(headingData.magHeading);
      });
    };

    subscribeHeading();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };

    animate();
  }, []);

  return (
    <Marker coordinate={coordinate}>
      <View style={styles.container}>
        <View style={styles.innerCircle} />
        <Animated.View
          testID="marker"
          style={[
            styles.directionalLight,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.arrow,
            {
              transform: [{ rotate: `${heading}deg` }, { translateY: -16 }],
            },
          ]}
        />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  directionalLight: {
    position: "absolute",
    width: 35,
    height: 35,
    backgroundColor: "rgba(0,122,255,0.3)",
    borderRadius: 20,
  },
  innerCircle: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: "rgb(0, 122, 255)",
  },
  arrow: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 8,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "rgb(0, 122, 255)",
  },
});

export default LocationMarker;
