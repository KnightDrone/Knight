import React, { useEffect, useState, useRef } from "react";
import { View, Image, StyleSheet, Dimensions, ScrollView } from "react-native";
import * as FileSystem from "expo-file-system";
import { OfflineStackParamList } from "./OfflineStack";
import { RouteProp } from "@react-navigation/native";

const TILE_SIZE = 256;
const TILES_PER_SIDE = 15;

interface OfflineMapProps {
  route: {
    params: {
      name: string;
    };
  };
}

export const OfflineMap = ({
  route,
}: {
  route: RouteProp<OfflineStackParamList, "OfflineMap">;
}) => {
  const { name } = route.params;

  const [tiles, setTiles] = useState<string[]>([]);
  const horizontalScrollViewRef = useRef<ScrollView>(null);
  const verticalScrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadTiles();
  }, []);

  const loadTiles = async () => {
    const tilesDir = `${FileSystem.documentDirectory}offline-maps/${name}`;
    try {
      const files = await FileSystem.readDirectoryAsync(tilesDir);
      setTiles(files);
    } catch (error) {
      console.error("Error reading tiles directory:", error);
    }
  };

  const getIndexFromFilename = (filename: string) => {
    const matches = filename.match(/(\d+)\.png$/);
    return matches ? parseInt(matches[1], 10) : -1;
  };

  const renderTiles = () => {
    if (!tiles.length) return null;

    const tileImages = tiles.map((tile) => {
      const index = getIndexFromFilename(tile);
      const col = Math.floor(index / TILES_PER_SIDE);
      const row = index % TILES_PER_SIDE;
      const tilePath = `${FileSystem.documentDirectory}offline-maps/${name}/${tile}`;

      return (
        <Image
          key={tile}
          source={{ uri: tilePath }}
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
    <View style={styles.container}>
      <ScrollView
        ref={horizontalScrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        maximumZoomScale={4}
        minimumZoomScale={0.3}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal
      >
        <ScrollView
          ref={verticalScrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          maximumZoomScale={4}
          minimumZoomScale={0.3}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.map}>
            <View style={styles.tileContainer}>{renderTiles()}</View>
          </View>
        </ScrollView>
      </ScrollView>
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
});

export default OfflineMap;
