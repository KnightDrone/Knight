import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import * as FileSystem from "expo-file-system";
import TriangleBackground from "../../../components/TriangleBackground";
import { Button } from "../../../ui/Button";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import HeaderBackButton from "../../../components/buttons/BackButton";

const OfflineMapSettings: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [downloadedMaps, setDownloadedMaps] = useState<
    { name: string; size: number }[]
  >([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Downloaded Maps",
      headerLeft: () => (
        <View style={{ paddingLeft: 16 }}>
          <HeaderBackButton onPress={() => navigation.toggleDrawer()} />
        </View>
      ),
    });
  }, [navigation]);

  const fetchDownloadedMaps = async () => {
    const offlineMapsDir = `${FileSystem.documentDirectory}offline-maps/`;
    const files = await FileSystem.readDirectoryAsync(offlineMapsDir);
    const mapFolders = await Promise.all(
      files.map(async (file) => {
        const filePath = `${offlineMapsDir}${file}`;
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (fileInfo.isDirectory) {
          const folderSize = await calculateFolderSize(filePath);
          return { name: file, size: folderSize };
        }
        return null;
      })
    );

    const filteredMapFolders = mapFolders.filter(
      (folder) => folder !== null
    ) as { name: string; size: number }[];

    const sortedMapFolders = filteredMapFolders.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    setDownloadedMaps(sortedMapFolders);
  };

  const calculateFolderSize = async (folderPath: string) => {
    const files = await FileSystem.readDirectoryAsync(folderPath);
    let totalSize = 0;

    for (const file of files) {
      const filePath = `${folderPath}/${file}`;
      const fileInfo = (await FileSystem.getInfoAsync(filePath)) as {
        exists: boolean;
        uri: string;
        isDirectory: boolean;
        size?: number;
      };
      if (fileInfo.isDirectory) {
        totalSize += await calculateFolderSize(filePath);
      } else {
        totalSize += fileInfo.size || 0;
      }
    }

    return totalSize / (1024 * 1024);
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
        testID={`${mapName}-delete-button`}
      >
        <Icon name="delete" size={26} color="grey" />
      </TouchableOpacity>
    );
  };

  const renderMapItem = ({
    item,
  }: {
    item: { name: string; size: number };
  }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.name)}>
      <TouchableOpacity
        style={styles.mapItem}
        onPress={() => handleMapPress(item.name)}
      >
        <View style={styles.mapContent}>
          <Text style={styles.mapName}>{item.name}</Text>
          <Text style={styles.mapSize}>{item.size.toFixed(1)} MB</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View testID="offline-map-settings-screen" style={styles.container}>
      <TriangleBackground color="#A0D1E4" bottom={-100} />
      {downloadedMaps.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No downloaded maps</Text>
        </View>
      ) : (
        <FlatList
          className="mt-4 max-h-[95%] min-h-[95%]"
          data={downloadedMaps}
          renderItem={renderMapItem}
          keyExtractor={(item) => item.name}
          testID="offlineMapsFlatList"
          contentContainerStyle={{ paddingTop: 90 }}
        />
      )}
      <Button
        testID="add-map-button"
        className={`absolute bottom-[30px] right-[30px] w-16 h-16 shadow-md "bg-white"}`}
        style="primary"
        onPress={() => navigation.navigate("LocationPicker")}
      >
        <Icon name="add" size={28} color={"#FFF"} />
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mapName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  mapSize: {
    fontSize: 14,
    color: "#888",
  },
  deleteButton: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    marginVertical: 8,
    marginRight: 8,
    minWidth: 75,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
  },
});

export default OfflineMapSettings;
