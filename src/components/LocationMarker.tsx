import React, { useState, useEffect } from "react";
import { View, Animated } from "react-native";
import * as Location from "expo-location";
import { Marker } from "react-native-maps";

interface LocationMarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

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
      <View className="items-center justify-center w-12 h-12">
        <View className="w-4 h-4 rounded-full bg-blue-500" />
        <Animated.View
          testID="marker"
          className="absolute w-9 h-9 bg-blue-300 rounded-full"
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        />
        <Animated.View
          className="absolute w-0 h-0 border-l-[3px] border-r-[3px] border-b-[8px] border-solid bg-transparent border-l-transparent border-r-transparent border-b-blue-500"
          style={{
            transform: [{ rotate: `${heading}deg` }, { translateY: -16 }],
          }}
        />
      </View>
    </Marker>
  );
};

export default LocationMarker;
