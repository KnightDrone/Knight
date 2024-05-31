import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  Text,
} from "react-native";
import MapView, { Region } from "react-native-maps";
import { downloadTiles } from "./DownloadTiles";
import { Button } from "../../../ui/Button";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as FileSystem from "expo-file-system";
import { DEFAULT_LOCATION, LocationType } from "../hooks/useLocation";

const LocationPicker: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [region, setRegion] = useState<LocationType>(DEFAULT_LOCATION);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleRegionChangeComplete = (region: Region) => {
    setRegion(region);
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const fileUri = `${FileSystem.documentDirectory}location.json`;
        const fileExists = await FileSystem.getInfoAsync(fileUri);

        if (fileExists.exists) {
          const fileContent = await FileSystem.readAsStringAsync(fileUri);
          const location = JSON.parse(fileContent);
          setRegion(location);
        }
      } catch (error) {}
    };

    fetchLocation();
  }, []);

  const handleSaveLocation = async () => {
    if (Platform.OS === "ios") {
      Alert.prompt("Enter name", "Enter a name for this map", async (name) => {
        if (name) {
          setIsLoading(true);
          await downloadTiles(region, `${name}`, (progress) => {
            setDownloadProgress(progress);
          });
          setIsLoading(false);
          navigation.goBack();
        }
      });
    } else {
      Alert.alert("Enter name", "Enter a name for this map", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async (name) => {
            if (name) {
              setIsLoading(true);
              await downloadTiles(region, `${name}`, (progress) => {
                setDownloadProgress(progress);
              });
              setIsLoading(false);
              navigation.goBack();
            }
          },
        },
      ]);
    }
  };

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={region}
        onRegionChangeComplete={handleRegionChangeComplete}
      />
      <View style={styles.markerFixed}>
        <Icon name="location-on" size={48} color="black" />
      </View>
      <Button
        testID="user-drawer-button"
        className={`absolute top-[60px] left-[30px] w-20 h-12 shadow-md bg-white`}
        onPress={() => {
          navigation.goBack();
        }}
        style="secondary"
      >
        <Text>Cancel</Text>
      </Button>
      <Button
        text="Save Map"
        onPress={handleSaveLocation}
        style="primary"
        className={`absolute bottom-[40px] right-[30px] w-[120px] h-16 shadow-md`}
      />
      {isLoading && <LoadingScreen progress={downloadProgress} />}
    </View>
  );
};

const LoadingScreen = ({ progress }: { progress: number }) => {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Downloading tiles...</Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>
      <Text
        style={styles.progressText}
      >{`${Math.round(progress * 100)}%`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerFixed: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -24,
    marginTop: -48,
  },
  // buttonContainer: {
  //   position: "absolute",
  //   bottom: 20,
  //   right: 20,
  //   backgroundColor: "rgba(255, 255, 255, 0.8)",
  //   borderRadius: 20,
  //   padding: 10,
  // },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 18,
    marginBottom: 10,
  },
  progressBarContainer: {
    width: "80%",
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginBottom: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4caf50",
    borderRadius: 5,
  },
  progressText: {
    color: "#ffffff",
    fontSize: 16,
  },
});

export default LocationPicker;
