import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system";
import TriangleBackground from "../../../components/TriangleBackground";
import { Button } from "../../../ui/Button";
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import Swipeable from "react-native-gesture-handler/Swipeable";

const OfflineMapSettings: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [downloadedMaps, setDownloadedMaps] = useState<string[]>([]);

  const fetchDownloadedMaps = async () => {
    const offlineMapsDir = `${FileSystem.documentDirectory}offline-maps/`;
    const files = await FileSystem.readDirectoryAsync(offlineMapsDir);
    const mapFolders = await Promise.all(
      files.map(async (file) => {
        const fileInfo = await FileSystem.getInfoAsync(
          `${offlineMapsDir}${file}`
        );
        return fileInfo.isDirectory ? file : null;
      })
    );
    const filteredMapFolders = mapFolders.filter(
      (folder) => folder !== null
    ) as string[];

    const sortedMapFolders = filteredMapFolders.sort((a, b) =>
      a.localeCompare(b)
    );

    setDownloadedMaps(sortedMapFolders);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchDownloadedMaps();
    }, [])
  );

  const handleMapPress = (mapName: string) => {
    navigation.navigate("OfflineMap", { name: mapName });
  };

  const handleDeleteMap = async (mapName: string) => {
    Alert.alert(
      "Delete Map",
      `Are you sure you want to delete the map "${mapName}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await FileSystem.deleteAsync(
              `${FileSystem.documentDirectory}offline-maps/${mapName}`,
              { idempotent: true }
            );
            fetchDownloadedMaps();
          },
        },
      ]
    );
  };

  const renderRightActions = (mapName: string) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteMap(mapName)}
      >
        <Icon name="delete" size={26} color="#FFF" />
      </TouchableOpacity>
    );
  };

  const renderMapItem = ({ item }: { item: string }) => (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteMap(item)}
        >
          <Icon name="delete" size={26} color="#FFF" />
        </TouchableOpacity>
      )}
    >
      <TouchableOpacity
        style={styles.mapItem}
        onPress={() => handleMapPress(item)}
      >
        <View style={styles.mapContent}>
          <Text style={styles.mapName}>{item}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View testID="offline-map-settings-screen">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TriangleBackground color="#A0D1E4" bottom={-800} />
      </KeyboardAvoidingView>
      <FlatList
        className="mt-4 max-h-[95%] min-h-[95%]"
        data={downloadedMaps}
        renderItem={renderMapItem}
        keyExtractor={(item) => item}
        testID="offlineMapsFlatList"
      />
      <Button
        testID="my-location-button"
        className={`absolute bottom-[0px] right-[30px] w-16 h-16 shadow-md "bg-white"}`}
        style="primary"
        onPress={() => navigation.navigate("LocationPicker")}
      >
        <Icon name="add" size={26} color={"#FFF"} />
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  mapItem: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    margin: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  mapContent: {
    justifyContent: "center",
  },
  mapName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    marginVertical: 8,
    marginRight: 8,
    minWidth: 75,
  },
});

export default OfflineMapSettings;
