// import React, { useEffect, useState, useRef } from "react";
// import { View, Image, StyleSheet, Dimensions, ScrollView } from "react-native";
// import * as FileSystem from "expo-file-system";
// import useLocation from "../hooks/useLocation";
// import { OfflineStackParamList } from "./OfflineStack";
// import { RouteProp } from "@react-navigation/native";

// const TILE_SIZE = 256;
// const { width, height } = Dimensions.get("window");

// interface OfflineMapProps {
//   route: {
//     params: {
//       name: string;
//     };
//   };
// }

// export const OfflineMap = ({ route }: { route: RouteProp<OfflineStackParamList, 'OfflineMap'> }) => {
//   const { name } = route.params;
//   const {
//     mapRef,
//     currentRegion,
//     setCurrentRegion,
//     marker,
//     loading,
//     autoCenter,
//     setAutoCenter,
//     animateToRegion,
//     toggleAutoCenter,
//   } = useLocation();

//   const [tiles, setTiles] = useState<string[]>([]);
//   const horizontalScrollViewRef = useRef<ScrollView>(null);
//   const verticalScrollViewRef = useRef<ScrollView>(null);

//   useEffect(() => {
//     loadTiles();
//   }, []);

//   const loadTiles = async () => {
//     const tilesDir = `${FileSystem.documentDirectory}offline-maps/${name}`;
//     try {
//       const files = await FileSystem.readDirectoryAsync(tilesDir);
//       setTiles(files);
//     } catch (error) {
//       console.error("Error reading tiles directory:", error);
//     }
//   };

//   const getTileUrl = (x: number, y: number, zoom: number) => {
//     const filePath = `${FileSystem.documentDirectory}offline-maps/${name}/${zoom}-${x}-${y}.png`;
//     return filePath;
//   };

//   const renderTiles = () => {
//     if (!marker) return null;

//     const zoom = 16;
//     const scale = Math.pow(2, zoom);
//     const centerX = Math.floor(((marker.longitude + 180) / 360) * scale);
//     const centerY = Math.floor(
//       ((1 -
//         Math.log(
//           Math.tan((marker.latitude * Math.PI) / 180) +
//             1 / Math.cos((marker.latitude * Math.PI) / 180)
//         ) /
//           Math.PI) /
//         2) *
//         scale
//     );

//     const tileRange = 1;

//     let tileImages = [];
//     for (let x = centerX - tileRange; x <= centerX + tileRange; x++) {
//       for (let y = centerY - tileRange; y <= centerY + tileRange; y++) {
//         const tileUrl = getTileUrl(x, y, zoom);
//         tileImages.push(
//           <Image
//             key={`${zoom}-${x}-${y}`}
//             source={{ uri: tileUrl }}
//             style={{
//               width: TILE_SIZE,
//               height: TILE_SIZE,
//               position: "absolute",
//               top: (y - centerY + tileRange) * TILE_SIZE,
//               left: (x - centerX + tileRange) * TILE_SIZE,
//             }}
//           />
//         );
//       }
//     }

//     return tileImages;
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         ref={horizontalScrollViewRef}
//         contentContainerStyle={styles.scrollContainer}
//         maximumZoomScale={3}
//         minimumZoomScale={1}
//         showsHorizontalScrollIndicator={false}
//         showsVerticalScrollIndicator={false}
//         horizontal
//       >
//         <ScrollView
//           ref={verticalScrollViewRef}
//           contentContainerStyle={styles.scrollContainer}
//           maximumZoomScale={3}
//           minimumZoomScale={1}
//           showsHorizontalScrollIndicator={false}
//           showsVerticalScrollIndicator={false}
//         >
//           <View style={styles.map}>
//             <View style={styles.tileContainer}>{renderTiles()}</View>
//           </View>
//         </ScrollView>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//   },
//   scrollContainer: {
//     width: width * 2,
//     height: height,
//   },
//   map: {
//     width: "100%",
//     height: "100%",
//     backgroundColor: "white",
//   },
//   tileContainer: {
//     position: "absolute",
//     top: 10,
//     left: 10,
//     width: TILE_SIZE * 3,
//     height: TILE_SIZE * 3,
//   },
// });

import React, { useEffect, useState, useRef } from "react";
import { View, Image, StyleSheet, Dimensions, ScrollView } from "react-native";
import * as FileSystem from "expo-file-system";
import useLocation from "../hooks/useLocation";
import { OfflineStackParamList } from "./OfflineStack";
import { RouteProp } from "@react-navigation/native";

const TILE_SIZE = 256;
const TILES_PER_SIDE = 15;
const { width, height } = Dimensions.get("window");

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
        maximumZoomScale={3}
        minimumZoomScale={0.3}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal
      >
        <ScrollView
          ref={verticalScrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          maximumZoomScale={3}
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
