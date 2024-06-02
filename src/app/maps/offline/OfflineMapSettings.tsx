import React, { useState, useLayoutEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import TriangleBackground from "../../../components/TriangleBackground";
import { Button } from "../../../ui/Button";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import HeaderBackButton from "../../../components/buttons/BackButton";
import { twMerge } from "tailwind-merge";

const OfflineMapSettings: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [downloadedMaps, setDownloadedMaps] = useState<
    { name: string; size: number }[]
  >([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Downloaded Maps",
      headerLeft: () => (
        <View className="pl-4">
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
        className="bg-transparent justify-center items-center px-3 rounded-tr-lg rounded-br-lg my-2 mr-2 min-w-[75px]"
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
        style={{
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
        }}
        onPress={() => handleMapPress(item.name)}
      >
        <View className="flex-row justify-between items-center">
          <Text className="text-base font-bold">{item.name}</Text>
          <Text className="text-sm text-gray-500">
            {item.size.toFixed(1)} MB
          </Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View testID="offline-map-settings-screen" className="flex-1">
      <TriangleBackground color="#A0D1E4" bottom={-100} />
      {downloadedMaps.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-500">No downloaded maps</Text>
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

export default OfflineMapSettings;
