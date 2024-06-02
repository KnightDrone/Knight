import React, { useEffect, useState, useRef } from "react";
import { View, Image, ScrollView, Text } from "react-native";
import * as FileSystem from "expo-file-system";
import { OfflineStackParamList } from "./OfflineStack";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { Button } from "../../../ui/Button";
import Icon from "react-native-vector-icons/MaterialIcons";
import { twMerge } from "tailwind-merge";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

const TILE_SIZE = 256;
const TILES_PER_SIDE = 15;

interface OfflineMapProps {
  route: {
    params: {
      name: string;
      navigation: any;
    };
  };
}

export const OfflineMap = ({
  route,
}: {
  route: RouteProp<OfflineStackParamList, "OfflineMap">;
}) => {
  const { name } = route.params;
  const navigation = useNavigation();
  const [tiles, setTiles] = useState<{ base64: string; index: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const horizontalScrollViewRef = useRef<ScrollView>(null);
  const verticalScrollViewRef = useRef<ScrollView>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    loadTiles();
  }, []);

  const loadTiles = async () => {
    const tilesDir = `${FileSystem.documentDirectory}offline-maps/${name}`;
    try {
      const files = await FileSystem.readDirectoryAsync(tilesDir);
      const totalTiles = files.length;
      let loadedTiles = 0;

      const base64Tiles = await Promise.all(
        files.map(async (file) => {
          const index = getIndexFromFilename(file);
          const tilePath = `${tilesDir}/${file}`;
          const base64 = await FileSystem.readAsStringAsync(tilePath, {
            encoding: FileSystem.EncodingType.Base64,
          });
          loadedTiles++;
          setLoadingProgress(Math.floor((loadedTiles / totalTiles) * 100));
          return { base64: `data:image/png;base64,${base64}`, index };
        })
      );
      setTiles(base64Tiles);
      setIsLoading(false);
    } catch (error) {
      console.error("Error reading tiles directory:", error);
      setIsLoading(false);
    }
  };

  const getIndexFromFilename = (filename: string) => {
    const matches = filename.match(/(\d+)\.png$/);
    const ret = matches ? parseInt(matches[1], 10) : -1;
    return ret;
  };

  const renderTiles = () => {
    if (!tiles.length) return null;

    const tileImages = tiles.map(({ base64, index }) => {
      const col = Math.floor(index / TILES_PER_SIDE);
      const row = index % TILES_PER_SIDE;

      return (
        <Image
          key={index}
          source={{ uri: base64 }}
          className="absolute"
          style={{
            width: TILE_SIZE,
            height: TILE_SIZE,
            top: row * TILE_SIZE,
            left: col * TILE_SIZE,
          }}
        />
      );
    });

    return tileImages;
  };

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <View className="absolute top-[60px] left-[30px] flex-row items-center z-10">
        <Button
          testID="om-back-button"
          className="w-16 h-16 shadow-md bg-white rounded-full"
          onPress={() => {
            navigation.goBack();
          }}
          style="secondary"
        >
          <Icon name="keyboard-arrow-left" size={28} color={"#000"} />
        </Button>
      </View>
      <View
        className="absolute top-[68px] left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full shadow-md z-10"
        style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
      >
        <Text className="text-lg font-bold">
          {name.length > 15 ? `${name.slice(0, 17)}...` : name}
        </Text>
      </View>
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>
            {t("offline-map.render-map")} ({loadingProgress}%)
          </Text>
        </View>
      ) : (
        <ScrollView
          ref={verticalScrollViewRef}
          contentContainerStyle={{ height: TILE_SIZE * TILES_PER_SIDE }}
          maximumZoomScale={4}
          minimumZoomScale={0.3}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <ScrollView
            ref={horizontalScrollViewRef}
            contentContainerStyle={{ width: TILE_SIZE * TILES_PER_SIDE }}
            nestedScrollEnabled={true}
            maximumZoomScale={4}
            minimumZoomScale={0.3}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            horizontal={true}
          >
            <View className="w-full h-full bg-white">
              <View
                className="absolute top-0 left-0"
                style={{
                  width: TILE_SIZE * TILES_PER_SIDE,
                  height: TILE_SIZE * TILES_PER_SIDE,
                }}
              >
                {renderTiles()}
              </View>
            </View>
          </ScrollView>
        </ScrollView>
      )}
    </View>
  );
};

export default OfflineMap;
