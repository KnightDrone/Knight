// import * as FileSystem from "expo-file-system";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// type LocationType = {
//   latitude: number;
//   longitude: number;
//   latitudeDelta: number;
//   longitudeDelta: number;
// };

// export const downloadTiles = async (location: LocationType, name: String) => {
//     const zoomLevels = [16];
//     const radius = 10;
//     const tileSize = 256;
//     const positionThreshold = 500;

//     const offlineTilesDir = `${FileSystem.documentDirectory}offline-maps/${name}`;

//     try {
//       await FileSystem.makeDirectoryAsync(offlineTilesDir, {
//         intermediates: true,
//       });
//     } catch (error) {
//       console.error("Error creating offline-tiles directory:", error);
//       return;
//     }

//     const currentPositionKey = `${location.latitude},${location.longitude}`;
//     const lastPositionKey = await AsyncStorage.getItem("lastPositionKey");

//     if (lastPositionKey === currentPositionKey) {
//       return;
//     }

//     if (lastPositionKey) {
//       const [lastLatitude, lastLongitude] = lastPositionKey
//         .split(",")
//         .map(parseFloat);
//       const distance = haversineDistance(
//         location.latitude,
//         location.longitude,
//         lastLatitude,
//         lastLongitude
//       );

//       if (distance < positionThreshold) {
//         return;
//       }
//     }

//     await AsyncStorage.setItem("lastPositionKey", currentPositionKey);

//     for (const zoom of zoomLevels) {
//       console.log(`Downloading tiles for zoom level ${zoom}`);
//       const scale = Math.pow(2, zoom);
//       const centerX = Math.floor(((location.longitude + 180) / 360) * scale);
//       const centerY = Math.floor(
//         ((1 -
//           Math.log(
//             Math.tan((location.latitude * Math.PI) / 180) +
//               1 / Math.cos((location.latitude * Math.PI) / 180)
//           ) /
//             Math.PI) /
//           2) *
//           scale
//       );

//       const tileRange = Math.ceil(
//         radius /
//           ((tileSize *
//             156543.03392 *
//             Math.cos((location.latitude * Math.PI) / 180)) /
//             (scale * tileSize))
//       );

//       for (let x = centerX - tileRange; x <= centerX + tileRange; x++) {
//         for (let y = centerY - tileRange; y <= centerY + tileRange; y++) {
//           const url = `https://a.tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
//           const fileName = `${FileSystem.documentDirectory}offline-maps/${name}/${zoom}-${x}-${y}.png`;

//           try {
//             const { exists } = await FileSystem.getInfoAsync(fileName);
//             if (!exists) {
//               const downloadResult = await FileSystem.downloadAsync(
//                 url,
//                 fileName
//               );
//               if (downloadResult.status !== 200) {
//                 console.error("Error downloading tile:", url);
//               }
//             }
//           } catch (error) {
//             console.error("Error downloading tile:", url, error);
//           }
//         }
//       }
//     }
//   };

//   const haversineDistance = (
//     lat1: number,
//     lon1: number,
//     lat2: number,
//     lon2: number
//   ) => {
//     const R = 6371e3;
//     const phi1 = (lat1 * Math.PI) / 180;
//     const phi2 = (lat2 * Math.PI) / 180;
//     const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
//     const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

//     const a =
//       Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
//       Math.cos(phi1) *
//         Math.cos(phi2) *
//         Math.sin(deltaLambda / 2) *
//         Math.sin(deltaLambda / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c;
//   };

import * as FileSystem from "expo-file-system";

type LocationType = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

const TILE_SIZE = 256;
const ZOOM_LEVEL = 16;
const TILES_PER_SIDE = 15; // 225 tiles total (15x15)

const latLngToTile = (lat: any, lng: any, zoom: any) => {
  const tileCount = Math.pow(2, zoom);
  const x = Math.floor(((lng + 180) / 360) * tileCount);
  const y = Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      tileCount
  );
  return { x, y };
};

export const downloadTiles = async (location: LocationType, name: String) => {
  const tilesDir = `${FileSystem.documentDirectory}offline-maps/${name}`;
  await FileSystem.makeDirectoryAsync(tilesDir, { intermediates: true });

  const { latitude, longitude } = location;
  const { x: centerX, y: centerY } = latLngToTile(
    latitude,
    longitude,
    ZOOM_LEVEL
  );

  const downloadTile = async (x: any, y: any, index: any) => {
    const url = `https://tile.openstreetmap.org/${ZOOM_LEVEL}/${x}/${y}.png`;
    const path = `${tilesDir}/${ZOOM_LEVEL}-${x}-${y}-${index}.png`;
    const { exists } = await FileSystem.getInfoAsync(path);
    if (!exists) {
      await FileSystem.downloadAsync(url, path);
    }
  };

  const halfSide = Math.floor(TILES_PER_SIDE / 2);
  const downloadPromises = [];

  let index = 0;
  for (let dx = -halfSide; dx <= halfSide; dx++) {
    for (let dy = -halfSide; dy <= halfSide; dy++) {
      const x = centerX + dx;
      const y = centerY + dy;
      console.log(`Downloading tile ${x}, ${y}`);
      downloadPromises.push(downloadTile(x, y, index));
      index++;
    }
  }

  await Promise.all(downloadPromises);
};
