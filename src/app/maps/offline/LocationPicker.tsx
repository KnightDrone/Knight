import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Modal, TextInput } from "react-native";
import MapView, { Region } from "react-native-maps";
import { downloadTiles } from "./DownloadTiles";
import { Button } from "../../../ui/Button";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as FileSystem from "expo-file-system";
import { LocationType, DEFAULT_LOCATION } from "../hooks/useLocation";
import { twMerge } from "tailwind-merge";

const LocationPicker: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [region, setRegion] = useState<LocationType>(DEFAULT_LOCATION);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [initialLocationLoaded, setInitialLocationLoaded] = useState(false);
  const [mapName, setMapName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const fileUri = `${FileSystem.documentDirectory}/location.json`;
        const fileExists = await FileSystem.getInfoAsync(fileUri);

        if (fileExists.exists) {
          const fileContent = await FileSystem.readAsStringAsync(fileUri);
          const location = JSON.parse(fileContent);
          setRegion(location);
        }
        setInitialLocationLoaded(true);
      } catch (error) {
        console.error("Error reading location file:", error);
        setInitialLocationLoaded(true);
      }
    };

    fetchLocation();
  }, []);

  const handleRegionChangeComplete = (region: Region) => {
    setRegion(region);
  };

  const handleSaveLocation = async (name: string) => {
    setIsLoading(true);
    await downloadTiles(region, `${name}`, (progress) => {
      setDownloadProgress(progress);
    });
    setIsLoading(false);
    navigation.goBack();
  };

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {initialLocationLoaded && (
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={region}
          onRegionChangeComplete={handleRegionChangeComplete}
        />
      )}
      <View style={styles.markerFixed}>
        <Icon name="location-on" size={48} color="black" />
      </View>
      <Button
        testID="user-drawer-button"
        className={`absolute top-[60px] left-[30px] w-24 h-12 shadow-md bg-white`}
        onPress={() => {
          navigation.goBack();
        }}
        style="secondary"
      >
        <Text
          className={twMerge("text-lg text-center", "text-black font-bold")}
        >
          {"Cancel"}
        </Text>
      </Button>
      <Button
        text="Save Map"
        onPress={() => setModalVisible(true)}
        style="primary"
        className={`absolute bottom-[40px] right-[30px] w-[120px] h-16 shadow-md`}
      />
      {isLoading && <LoadingScreen progress={downloadProgress} />}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter a name for this map"
              value={mapName}
              onChangeText={setMapName}
              maxLength={30}
            />
            <Text style={styles.characterCount}>{`${mapName.length}/30`}</Text>
            <View style={styles.modalButtons}>
              <Button
                text="Cancel"
                onPress={() => setModalVisible(false)}
                style="secondary"
                className="mr-4"
              />
              <Button
                text="OK"
                onPress={async () => {
                  if (mapName) {
                    setModalVisible(false);
                    await handleSaveLocation(mapName);
                  }
                }}
                style="primary"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const LoadingScreen = ({ progress }: { progress: number }) => {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Downloading Map Tiles...</Text>
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
  characterCount: {
    alignSelf: "flex-end",
    marginBottom: 10,
    fontSize: 12,
    color: "gray",
  },
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textInput: {
    width: "100%",
    padding: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    width: "50%",
  },
});

export default LocationPicker;
