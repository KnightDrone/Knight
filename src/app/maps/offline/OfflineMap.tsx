import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { OfflineStackParamList } from "./OfflineStack";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { Button } from "../../../ui/Button";
import Icon from "react-native-vector-icons/MaterialIcons";

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
          style={{
            width: TILE_SIZE,
            height: TILE_SIZE,
            position: "absolute",
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
          testID="user-drawer-button"
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
        <Text className="text-lg font-bold">{name}</Text>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading Map ({loadingProgress}%)</Text>
        </View>
      ) : (
        <ScrollView
          ref={verticalScrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          maximumZoomScale={4}
          minimumZoomScale={0.3}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <ScrollView
            ref={horizontalScrollViewRef}
            contentContainerStyle={styles.scrollContainer}
            maximumZoomScale={4}
            minimumZoomScale={0.3}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            horizontal
          >
            <View style={styles.map}>
              <View style={styles.tileContainer}>{renderTiles()}</View>
            </View>
          </ScrollView>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    width: TILE_SIZE * TILES_PER_SIDE,
    height: TILE_SIZE * TILES_PER_SIDE,
  },
  map: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
  tileContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: TILE_SIZE * TILES_PER_SIDE,
    height: TILE_SIZE * TILES_PER_SIDE,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OfflineMap;
