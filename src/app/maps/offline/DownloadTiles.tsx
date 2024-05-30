import * as FileSystem from "expo-file-system";

type LocationType = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

const ZOOM_LEVEL = 16;
const TILES_PER_SIDE = 15;

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

export const downloadTiles = async (
  location: LocationType,
  name: String,
  onProgress: (progress: number) => void
) => {
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
  let completedTiles = 0;
  let totalTiles = TILES_PER_SIDE * TILES_PER_SIDE;
  for (let dx = -halfSide; dx <= halfSide; dx++) {
    for (let dy = -halfSide; dy <= halfSide; dy++) {
      const x = centerX + dx;
      const y = centerY + dy;
      downloadPromises.push(
        downloadTile(x, y, index).then(() => {
          completedTiles++;
          const progress = completedTiles / totalTiles;
          onProgress(progress);
        })
      );
      index++;
    }
  }

  await Promise.all(downloadPromises);
};
