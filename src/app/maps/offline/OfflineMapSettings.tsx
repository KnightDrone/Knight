// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Modal,
//   TextInput,
//   StyleSheet,
// } from "react-native";
// import * as FileSystem from "expo-file-system";
// import {downloadTiles} from "./DownloadTiles";

// const OfflineMapSettings = () => {
//   const [downloadedMaps, setDownloadedMaps] = useState<string[]>([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [latitude, setLatitude] = useState("");
//   const [longitude, setLongitude] = useState("");

//   useEffect(() => {
//     const fetchDownloadedMaps = async () => {
//       const offlineMapsDir = `${FileSystem.documentDirectory}offline-maps/`;
//       const files = await FileSystem.readDirectoryAsync(offlineMapsDir);
//       const mapFolders = await Promise.all(
//         files.map(async (file) => {
//           const fileInfo = await FileSystem.getInfoAsync(
//             `${offlineMapsDir}${file}`
//           );
//           return fileInfo.isDirectory ? file : null;
//         })
//       );
//       const filteredMapFolders = mapFolders.filter(
//         (folder) => folder !== null
//       ) as string[];
//       setDownloadedMaps(filteredMapFolders);
//     };

//     fetchDownloadedMaps();
//   }, []);

//   const handleAddMap = async () => {
//     if (latitude && longitude) {
//       const location = {
//         latitude: parseFloat(latitude),
//         longitude: parseFloat(longitude),
//         latitudeDelta: 0.005,
//         longitudeDelta: 0.005,
//       };
//       await downloadTiles(location, "name 1");
//       setModalVisible(false);
//       setLatitude("");
//       setLongitude("");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={downloadedMaps}
//         keyExtractor={(item) => item}
//         renderItem={({ item }) => (
//           <View style={styles.mapItem}>
//             <Text>{item}</Text>
//           </View>
//         )}
//       />
//       <TouchableOpacity
//         style={styles.addButton}
//         onPress={() => setModalVisible(true)}
//       >
//         <Text style={styles.addButtonText}>+</Text>
//       </TouchableOpacity>
//       <Modal visible={modalVisible} animationType="slide">
//         <View style={styles.modalContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Latitude"
//             value={latitude}
//             onChangeText={setLatitude}
//             keyboardType="numeric"
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Longitude"
//             value={longitude}
//             onChangeText={setLongitude}
//             keyboardType="numeric"
//           />
//           <TouchableOpacity style={styles.addMapButton} onPress={handleAddMap}>
//             <Text style={styles.addMapButtonText}>Add Map</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   mapItem: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//   },
//   addButton: {
//     position: "absolute",
//     bottom: 16,
//     right: 16,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: "blue",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   addButtonText: {
//     color: "white",
//     fontSize: 24,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 16,
//   },
//   input: {
//     height: 40,
//     borderColor: "gray",
//     borderWidth: 1,
//     marginBottom: 16,
//     paddingHorizontal: 8,
//   },
//   addMapButton: {
//     backgroundColor: "blue",
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   addMapButtonText: {
//     color: "white",
//     fontSize: 16,
//   },
// });

// export default OfflineMapSettings;

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Modal,
//   TextInput,
//   StyleSheet,
// } from "react-native";
// import * as FileSystem from "expo-file-system";
// import { downloadTiles } from "./DownloadTiles";
// import OfflineMap from "./OfflineMap";

// const OfflineMapSettings = () => {
//   const [downloadedMaps, setDownloadedMaps] = useState<string[]>([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [latitude, setLatitude] = useState("");
//   const [longitude, setLongitude] = useState("");
//   const [name, setName] = useState("");
//   const [selectedMap, setSelectedMap] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchDownloadedMaps = async () => {
//       const offlineMapsDir = `${FileSystem.documentDirectory}offline-maps/`;
//       const files = await FileSystem.readDirectoryAsync(offlineMapsDir);
//       const mapFolders = await Promise.all(
//         files.map(async (file) => {
//           const fileInfo = await FileSystem.getInfoAsync(
//             `${offlineMapsDir}${file}`
//           );
//           return fileInfo.isDirectory ? file : null;
//         })
//       );
//       const filteredMapFolders = mapFolders.filter(
//         (folder) => folder !== null
//       ) as string[];
//       setDownloadedMaps(filteredMapFolders);
//     };

//     fetchDownloadedMaps();
//   }, []);

//   const handleAddMap = async () => {
//     if (latitude && longitude && name) {
//       const location = {
//         latitude: parseFloat(latitude),
//         longitude: parseFloat(longitude),
//         latitudeDelta: 0.005,
//         longitudeDelta: 0.005,
//       };
//       await downloadTiles(location, name);
//       setModalVisible(false);
//       setLatitude("");
//       setLongitude("");
//     }
//   };

//   const handleMapPress = (mapName: string) => {
//     setSelectedMap(mapName);
//   };

//   if (selectedMap) {
//     return <OfflineMap name={selectedMap} />;
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={downloadedMaps}
//         keyExtractor={(item) => item}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.mapItem}
//             onPress={() => handleMapPress(item)}
//           >
//             <Text>{item}</Text>
//           </TouchableOpacity>
//         )}
//       />
//       <TouchableOpacity
//         style={styles.addButton}
//         onPress={() => setModalVisible(true)}
//       >
//         <Text style={styles.addButtonText}>+</Text>
//       </TouchableOpacity>
//       <Modal visible={modalVisible} animationType="slide">
//         <View style={styles.modalContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Name"
//             value={name}
//             onChangeText={setName}
//             keyboardType="default"
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Latitude"
//             value={latitude}
//             onChangeText={setLatitude}
//             keyboardType="numeric"
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Longitude"
//             value={longitude}
//             onChangeText={setLongitude}
//             keyboardType="numeric"
//           />
//           <TouchableOpacity style={styles.addMapButton} onPress={handleAddMap}>
//             <Text style={styles.addMapButtonText}>Add Map</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   mapItem: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//   },
//   addButton: {
//     position: "absolute",
//     bottom: 16,
//     right: 16,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: "blue",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   addButtonText: {
//     color: "white",
//     fontSize: 24,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 16,
//   },
//   input: {
//     height: 40,
//     borderColor: "gray",
//     borderWidth: 1,
//     marginBottom: 16,
//     paddingHorizontal: 8,
//   },
//   addMapButton: {
//     backgroundColor: "blue",
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   addMapButtonText: {
//     color: "white",
//     fontSize: 16,
//   },
// });

// export default OfflineMapSettings;

// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Modal,
//   TextInput,
//   StyleSheet,
//   ScrollView,
//   KeyboardAvoidingView,
// } from "react-native";
// import * as FileSystem from "expo-file-system";
// import { downloadTiles } from "./DownloadTiles";
// import OfflineMap from "./OfflineMap";

// const OfflineMapSettings: React.FC<{ navigation: any }> = ({ navigation }) => {
//   const [downloadedMaps, setDownloadedMaps] = useState<string[]>([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [latitude, setLatitude] = useState("");
//   const [longitude, setLongitude] = useState("");
//   const [name, setName] = useState("");
//   const [selectedMap, setSelectedMap] = useState<string | null>(null);
//   const scrollViewRef = useRef(null);

//   const fetchDownloadedMaps = async () => {
//     const offlineMapsDir = `${FileSystem.documentDirectory}offline-maps/`;
//     const files = await FileSystem.readDirectoryAsync(offlineMapsDir);
//     const mapFolders = await Promise.all(
//       files.map(async (file) => {
//         const fileInfo = await FileSystem.getInfoAsync(
//           `${offlineMapsDir}${file}`
//         );
//         return fileInfo.isDirectory ? file : null;
//       })
//     );
//     const filteredMapFolders = mapFolders.filter(
//       (folder) => folder !== null
//     ) as string[];
//     setDownloadedMaps(filteredMapFolders);
//   };

//   useEffect(() => {
//     fetchDownloadedMaps();
//   }, []);

//   const handleAddMap = async () => {
//     if (latitude && longitude && name) {
//       const location = {
//         latitude: parseFloat(latitude),
//         longitude: parseFloat(longitude),
//         latitudeDelta: 0.005,
//         longitudeDelta: 0.005,
//       };
//       await downloadTiles(location, name);
//       setModalVisible(false);
//       setLatitude("");
//       setLongitude("");
//       setName("");
//       fetchDownloadedMaps();
//     }
//   };

//   const handleMapPress = (mapName: string) => {
//     setSelectedMap(mapName);
//   };

//   const handleScroll = (event: any) => {
//     if (event.nativeEvent.contentOffset.y > 0) {
//       setModalVisible(false);
//     }
//   };

//   if (selectedMap) {
//     navigation.navigate("OfflineMap", { name: selectedMap });
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={downloadedMaps}
//         keyExtractor={(item) => item}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.mapItem}
//             onPress={() => handleMapPress(item)}
//           >
//             <Text>{item}</Text>
//           </TouchableOpacity>
//         )}
//       />
//       <TouchableOpacity
//         style={styles.addButton}
//         onPress={
//           () => navigation.navigate("LocationPicker")

//           //setModalVisible(true)
//         }
//       >
//         <Text style={styles.addButtonText}>+</Text>
//       </TouchableOpacity>
//       <Modal
//         visible={modalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <KeyboardAvoidingView behavior="padding" style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <ScrollView
//               style={styles.scrollView}
//               ref={scrollViewRef}
//               onScroll={handleScroll}
//               scrollEventThrottle={16}
//             >
//               <TextInput
//                 style={styles.input}
//                 placeholder="Name"
//                 value={name}
//                 onChangeText={setName}
//                 keyboardType="default"
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Latitude"
//                 value={latitude}
//                 onChangeText={setLatitude}
//                 keyboardType="numeric"
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Longitude"
//                 value={longitude}
//                 onChangeText={setLongitude}
//                 keyboardType="numeric"
//               />
//               <TouchableOpacity
//                 style={styles.addMapButton}
//                 onPress={handleAddMap}
//               >
//                 <Text style={styles.addMapButtonText}>Add Map</Text>
//               </TouchableOpacity>
//             </ScrollView>
//           </View>
//         </KeyboardAvoidingView>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   mapItem: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//   },
//   addButton: {
//     position: "absolute",
//     bottom: 16,
//     right: 16,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: "blue",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   addButtonText: {
//     color: "white",
//     fontSize: 24,
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: "flex-end",
//     backgroundColor: "rgba(0, 0, 0, 0.2)",
//   },
//   modalContainer: {
//     height: "50%",
//     backgroundColor: "white",
//     padding: 16,
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   input: {
//     height: 40,
//     borderColor: "gray",
//     borderWidth: 1,
//     marginBottom: 16,
//     paddingHorizontal: 8,
//   },
//   addMapButton: {
//     backgroundColor: "blue",
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   addMapButtonText: {
//     color: "white",
//     fontSize: 16,
//   },
// });

// export default OfflineMapSettings;

// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Modal,
//   TextInput,
//   StyleSheet,
//   ScrollView,
//   KeyboardAvoidingView,
// } from "react-native";
// import * as FileSystem from "expo-file-system";
// import { downloadTiles } from "./DownloadTiles";
// import HeaderBackButton from "../../../components/buttons/BackButton";

// const OfflineMapSettings: React.FC<{ navigation: any }> = ({ navigation }) => {
//   const [downloadedMaps, setDownloadedMaps] = useState<string[]>([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [latitude, setLatitude] = useState("");
//   const [longitude, setLongitude] = useState("");
//   const [name, setName] = useState("");
//   const [selectedMap, setSelectedMap] = useState<string | null>(null);
//   const scrollViewRef = useRef(null);

//   const fetchDownloadedMaps = async () => {
//     const offlineMapsDir = `${FileSystem.documentDirectory}offline-maps/`;
//     const files = await FileSystem.readDirectoryAsync(offlineMapsDir);
//     const mapFolders = await Promise.all(
//       files.map(async (file) => {
//         const fileInfo = await FileSystem.getInfoAsync(
//           `${offlineMapsDir}${file}`
//         );
//         return fileInfo.isDirectory ? file : null;
//       })
//     );
//     const filteredMapFolders = mapFolders.filter(
//       (folder) => folder !== null
//     ) as string[];
//     setDownloadedMaps(filteredMapFolders);
//   };

//   useEffect(() => {
//     fetchDownloadedMaps();
//   }, []);

//   const handleAddMap = async () => {
//     if (latitude && longitude && name) {
//       const location = {
//         latitude: parseFloat(latitude),
//         longitude: parseFloat(longitude),
//         latitudeDelta: 0.005,
//         longitudeDelta: 0.005,
//       };
//       await downloadTiles(location, name);
//       setModalVisible(false);
//       setLatitude("");
//       setLongitude("");
//       setName("");
//       fetchDownloadedMaps();
//     }
//   };

//   const handleMapPress = (mapName: string) => {
//     setSelectedMap(mapName);
//     navigation.navigate("OfflineMap", { name: mapName });
//   };

//   const handleScroll = (event: any) => {
//     if (event.nativeEvent.contentOffset.y > 0) {
//       setModalVisible(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={downloadedMaps}
//         keyExtractor={(item) => item}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.mapItem}
//             onPress={() => handleMapPress(item)}
//           >
//             <Text>{item}</Text>
//           </TouchableOpacity>
//         )}
//       />
//       <TouchableOpacity
//         style={styles.addButton}
//         onPress={() => navigation.navigate("LocationPicker")}
//       >
//         <Text style={styles.addButtonText}>+</Text>
//       </TouchableOpacity>
//       <Modal
//         visible={modalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <KeyboardAvoidingView behavior="padding" style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <ScrollView
//               style={styles.scrollView}
//               ref={scrollViewRef}
//               onScroll={handleScroll}
//               scrollEventThrottle={16}
//             >
//               <TextInput
//                 style={styles.input}
//                 placeholder="Name"
//                 value={name}
//                 onChangeText={setName}
//                 keyboardType="default"
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Latitude"
//                 value={latitude}
//                 onChangeText={setLatitude}
//                 keyboardType="numeric"
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Longitude"
//                 value={longitude}
//                 onChangeText={setLongitude}
//                 keyboardType="numeric"
//               />
//               <TouchableOpacity
//                 style={styles.addMapButton}
//                 onPress={handleAddMap}
//               >
//                 <Text style={styles.addMapButtonText}>Add Map</Text>
//               </TouchableOpacity>
//             </ScrollView>
//           </View>
//         </KeyboardAvoidingView>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   mapItem: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//   },
//   addButton: {
//     position: "absolute",
//     bottom: 16,
//     right: 16,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: "blue",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   addButtonText: {
//     color: "white",
//     fontSize: 24,
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: "flex-end",
//     backgroundColor: "rgba(0, 0, 0, 0.2)",
//   },
//   modalContainer: {
//     height: "50%",
//     backgroundColor: "white",
//     padding: 16,
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   input: {
//     height: 40,
//     borderColor: "gray",
//     borderWidth: 1,
//     marginBottom: 16,
//     paddingHorizontal: 8,
//   },
//   addMapButton: {
//     backgroundColor: "blue",
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   addMapButtonText: {
//     color: "white",
//     fontSize: 16,
//   },
// });

// export default OfflineMapSettings;

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as FileSystem from "expo-file-system";
import TriangleBackground from "../../../components/TriangleBackground";
import { Button } from "../../../ui/Button";
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

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
    setDownloadedMaps(filteredMapFolders);
  };

  useEffect(() => {
    fetchDownloadedMaps();
  }, []);

  const handleMapPress = (mapName: string) => {
    navigation.navigate("OfflineMap", { name: mapName });
  };

  const renderMapItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.mapItem}
      onPress={() => handleMapPress(item)}
    >
      <View style={styles.mapContent}>
        <Text style={styles.mapName}>{item}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="mt-28" testID="offline-map-settings-screen">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TriangleBackground color="#A0D1E4" bottom={-800} />
      </KeyboardAvoidingView>

      <FlatList
        className="mt-4 max-h-[90%] min-h-[90%]"
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
    backgroundColor: "white",
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
    padding: 8,
    borderWidth: 2,
    borderColor: "#CBD5E0",
    minHeight: 55,
  },
  mapContent: {
    flex: 1,
    justifyContent: "center",
  },
  mapName: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OfflineMapSettings;
