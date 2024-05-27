import React, { useEffect, useState, useRef } from "react";
import { View, Image, StyleSheet, Dimensions, ScrollView } from "react-native";
import * as FileSystem from "expo-file-system";
import useLocation from "./hooks/useLocation"; // Adjust the import path as needed

const TILE_SIZE = 256;
const { width, height } = Dimensions.get("window");

const OfflineMap = () => {
  const {
    mapRef,
    currentRegion,
    setCurrentRegion,
    marker,
    loading,
    autoCenter,
    setAutoCenter,
    animateToRegion,
    toggleAutoCenter,
  } = useLocation();

  const [tiles, setTiles] = useState<string[]>([]);
  const horizontalScrollViewRef = useRef<ScrollView>(null);
  const verticalScrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadTiles();
  }, []);

  const loadTiles = async () => {
    const tilesDir = `${FileSystem.documentDirectory}offline-tiles/`;
    try {
      const files = await FileSystem.readDirectoryAsync(tilesDir);
      setTiles(files);
    } catch (error) {
      console.error("Error reading tiles directory:", error);
    }
  };

  const getTileUrl = (x: number, y: number, zoom: number) => {
    const filePath = `${FileSystem.documentDirectory}offline-tiles/${zoom}-${x}-${y}.png`;
    return filePath;
  };

  const renderTiles = () => {
    if (!marker) return null;

    const zoom = 16;
    const scale = Math.pow(2, zoom);
    const centerX = Math.floor(((marker.longitude + 180) / 360) * scale);
    const centerY = Math.floor(
      ((1 -
        Math.log(
          Math.tan((marker.latitude * Math.PI) / 180) +
            1 / Math.cos((marker.latitude * Math.PI) / 180)
        ) /
          Math.PI) /
        2) *
        scale
    );

    const tileRange = 1;

    let tileImages = [];
    for (let x = centerX - tileRange; x <= centerX + tileRange; x++) {
      for (let y = centerY - tileRange; y <= centerY + tileRange; y++) {
        const tileUrl = getTileUrl(x, y, zoom);
        tileImages.push(
          <Image
            key={`${zoom}-${x}-${y}`}
            source={{ uri: tileUrl }}
            style={{
              width: TILE_SIZE,
              height: TILE_SIZE,
              position: "absolute",
              top: (y - centerY + tileRange) * TILE_SIZE,
              left: (x - centerX + tileRange) * TILE_SIZE,
            }}
          />
        );
      }
    }

    return tileImages;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={horizontalScrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        maximumZoomScale={3}
        minimumZoomScale={1}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal
      >
        <ScrollView
          ref={verticalScrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          maximumZoomScale={3}
          minimumZoomScale={1}
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
    width: width * 2,
    height: height,
  },
  map: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
  tileContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    width: TILE_SIZE * 3,
    height: TILE_SIZE * 3,
  },
});

export default OfflineMap;
