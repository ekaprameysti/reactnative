import * as Location from 'expo-location';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, update } from "firebase/database";
import React, { useState, useEffect } from 'react';
import { 
    Alert, 
    StyleSheet, 
    Text, 
    TextInput, 
    View, 
    TouchableOpacity, 
    ScrollView, 
    ActivityIndicator,
    StatusBar // 1. Import StatusBar
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

// --- Theme Constants ---
const PRIMARY_COLOR = '#043915';
const ACCENT_COLOR = '#FFA000';
const BG_COLOR = '#F2F7F4';

const App = () => {

    const router = useRouter();
    const params = useLocalSearchParams();
    const { id, name: initialName, coordinates: initialCoordinates, accuration: initialAccuration } = params;

    const [name, setName] = useState(initialName);
    const [location, setLocation] = useState(initialCoordinates);
    const [accuration, setAccuration] = useState(initialAccuration);
    const [loadingLoc, setLoadingLoc] = useState(false);

    // State untuk Map
    const [mapRegion, setMapRegion] = useState({
        latitude: -7.7956,
        longitude: 110.3695,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    });

    // EFFECT: Parse koordinat awal
    useEffect(() => {
        if (initialCoordinates) {
            const [lat, long] = initialCoordinates.split(',').map(coord => parseFloat(coord.trim()));
            if (!isNaN(lat) && !isNaN(long)) {
                setMapRegion({
                    latitude: lat,
                    longitude: long,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                });
            }
        }
    }, [initialCoordinates]);

    // Handle Geser Pin
    const handleDragEnd = (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setLocation(`${latitude},${longitude}`);
    };

    // Get current location
    const getCoordinates = async () => {
        setLoadingLoc(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            setLoadingLoc(false);
            return;
        }

        try {
            let locationRes = await Location.getCurrentPositionAsync({});
            const lat = locationRes.coords.latitude;
            const long = locationRes.coords.longitude;
            
            const coords = lat + ',' + long;
            setLocation(coords);
            
            const accuracy = locationRes.coords.accuracy;
            setAccuration(accuracy + ' m');

            setMapRegion({
                latitude: lat,
                longitude: long,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });

        } catch (error) {
            console.log(error);
        } finally {
            setLoadingLoc(false);
        }
    };

    // Firebase Config
    const firebaseConfig = {
        apiKey: "AIzaSyAR2BB6JQmnn81l10gTqg_T2rm5dX9Y7ro",
        authDomain: "reactnative2025-ekanafi.firebaseapp.com",
        databaseURL: "https://reactnative2025-ekanafi-default-rtdb.firebaseio.com",
        projectId: "reactnative2025-ekanafi",
        storageBucket: "reactnative2025-ekanafi.firebasestorage.app",
        messagingSenderId: "818194084897",
        appId: "1:818194084897:web:e51f1b14f2b5a470489f60"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    const createOneButtonAlert = (callback) =>
        Alert.alert('Success', 'Berhasil memperbarui data', [
            { text: 'OK', onPress: callback },
        ]);

    const handleUpdate = () => {
        if (!id) {
            Alert.alert("Error", "ID lokasi tidak ditemukan.");
            return;
        }
        const pointRef = ref(db, `points/${id}`);
        update(pointRef, {
            name: name,
            coordinates: location,
            accuration: accuration,
        }).then(() => {
            createOneButtonAlert(() => {
                router.back();
            });
        }).catch((e) => {
            console.error("Error updating document: ", e);
            Alert.alert("Error", "Gagal memperbarui data");
        });
    };

    return (
        <SafeAreaProvider style={{ backgroundColor: BG_COLOR }}>
            {/* 2. Set Status Bar jadi Putih di atas Hijau */}
            <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />
            <Stack.Screen options={{ headerShown: false }} />

            <View style={{ flex: 1 }}>
                
                {/* 3. UBAH VIEW BIASA JADI SAFEAREAVIEW KHUSUS HEADER */}
                {/* edges=['top'] memastikan padding otomatis hanya di atas (poni HP) */}
                <SafeAreaView edges={['top']} style={styles.headerContainer}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Edit Data Lokasi</Text>
                    </View>
                </SafeAreaView>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    
                    {/* --- FORM CARD --- */}
                    <View style={styles.formCard}>
                        
                        {/* MAP VIEW */}
                        <Text style={styles.inputLabel}>Posisi di Peta</Text>
                        <View style={styles.mapContainer}>
                            <MapView
                                style={styles.map}
                                region={mapRegion}
                                onRegionChangeComplete={(region) => setMapRegion(region)}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: mapRegion.latitude,
                                        longitude: mapRegion.longitude
                                    }}
                                    draggable
                                    onDragEnd={handleDragEnd}
                                    pinColor={PRIMARY_COLOR}
                                />
                            </MapView>
                            <View style={styles.mapOverlay}>
                                <Text style={styles.mapOverlayText}>Geser Pin untuk Update</Text>
                            </View>
                        </View>

                        {/* Name Input */}
                        <Text style={styles.inputLabel}>Nama Lokasi</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="create-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder='Isikan nama objek'
                                value={name}
                                onChangeText={setName}
                                placeholderTextColor="#999"
                            />
                        </View>

                        {/* Coordinates Input */}
                        <View style={styles.labelRow}>
                            <Text style={styles.inputLabel}>Koordinat</Text>
                            <TouchableOpacity onPress={getCoordinates} disabled={loadingLoc}>
                                <Text style={styles.getLocationText}>
                                    {loadingLoc ? "Sedang mengambil..." : "📍 Reset ke Lokasi Saya"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputContainer}>
                            <Ionicons name="map-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Lat, Long"
                                value={location}
                                onChangeText={setLocation}
                                placeholderTextColor="#999"
                            />
                            {loadingLoc && <ActivityIndicator size="small" color={PRIMARY_COLOR} />}
                        </View>

                        {/* Accuration Input */}
                        <Text style={styles.inputLabel}>Akurasi</Text>
                        <View style={[styles.inputContainer, { backgroundColor: '#F5F5F5' }]}>
                            <Ionicons name="locate-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: '#555' }]}
                                placeholder="Akurasi GPS"
                                value={accuration}
                                onChangeText={setAccuration}
                                placeholderTextColor="#999"
                                editable={false} 
                            />
                        </View>

                    </View>

                    {/* --- ACTION BUTTON --- */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                        <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
                        <Ionicons name="save-outline" size={20} color="white" style={{marginLeft: 8}} />
                    </TouchableOpacity>

                </ScrollView>
            </View>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    // Header
    headerContainer: {
        backgroundColor: PRIMARY_COLOR,
        paddingBottom: 20, // Padding bawah agar tidak mepet
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        zIndex: 10,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    backButton: {
        padding: 5,
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },

    // Content
    scrollContent: {
        padding: 20,
    },
    formCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        elevation: 3,
        shadowColor: PRIMARY_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        marginBottom: 25,
    },

    // Map Styles
    mapContainer: {
        height: 180,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        position: 'relative',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    mapOverlay: {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    mapOverlayText: {
        color: 'white',
        fontSize: 11,
        fontWeight: 'bold',
    },

    // Inputs
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        marginTop: 15,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
        marginBottom: 8,
        marginTop: 10,
    },
    getLocationText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: ACCENT_COLOR,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        backgroundColor: '#FAFAFA',
        height: 50,
        paddingHorizontal: 10,
    },
    inputIcon: {
        marginRight: 10,
        marginLeft: 5,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        height: '100%',
    },

    // Button
    saveButton: {
        backgroundColor: PRIMARY_COLOR,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 16,
        elevation: 4,
        shadowColor: PRIMARY_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default App;