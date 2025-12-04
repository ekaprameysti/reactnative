import React, { useState, useEffect } from 'react';
import { 
    Alert, 
    StyleSheet, 
    Text, 
    TextInput, 
    View, 
    TouchableOpacity, 
    ActivityIndicator,
    ScrollView,
    Dimensions // Tambahan untuk ukuran map
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; // 1. Import Map

// --- Theme Constants ---
const PRIMARY_COLOR = '#043915';
const SECONDARY_COLOR = '#FFA000'; 
const BG_COLOR = '#F2F7F4';

const App = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [accuration, setAccuration] = useState('');
    const [loadingLoc, setLoadingLoc] = useState(false); 

    // 2. State untuk Map Region (Default posisi awal, misal Jogja)
    const [mapRegion, setMapRegion] = useState({
        latitude: -8.0000,
        longitude: 110.2600,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const router = useRouter();

    // 3. Fungsi saat Marker digeser (Drag End)
    const handleDragEnd = (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        // Update input text koordinat otomatis
        setLocation(`${latitude},${longitude}`);
        // Update region map biar smooth
        setMapRegion({
            ...mapRegion,
            latitude: latitude,
            longitude: longitude
        });
    };

    // Get current location (Update tombol Ambil Lokasi)
    const getCoordinates = async () => {
        setLoadingLoc(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Izin Ditolak', 'Izin untuk mengakses lokasi diperlukan.');
            setLoadingLoc(false);
            return;
        }

        try {
            let locationRaw = await Location.getCurrentPositionAsync({});
            const lat = locationRaw.coords.latitude;
            const long = locationRaw.coords.longitude;
            
            const coordsString = lat + ',' + long;
            
            // Update Form Inputs
            setLocation(coordsString);
            setAccuration(locationRaw.coords.accuracy.toString());

            // 4. Update Posisi Map ke lokasi user
            setMapRegion({
                latitude: lat,
                longitude: long,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });

        } catch (error) {
            Alert.alert('Error', 'Gagal mengambil lokasi.');
        } finally {
            setLoadingLoc(false);
        }
    };

    // Firebase Config (Tetap sama)
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

    const handleSave = () => {
        if (!name || !location) {
            Alert.alert("Data Belum Lengkap", "Harap isi nama dan koordinat.");
            return;
        }

        const locationsRef = ref(db, 'points/');
        push(locationsRef, {
            name: name,
            coordinates: location,
            accuration: accuration,
        }).then(() => {
            Alert.alert("Berhasil", "Data lokasi berhasil disimpan!", [
                { text: "OK", onPress: () => router.back() } 
            ]);
            setName('');
            setLocation('');
            setAccuration('');
        }).catch((e) => {
            console.error("Error adding document: ", e);
            Alert.alert("Error", "Gagal menyimpan data");
        });
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* --- CUSTOM HEADER --- */}
            <SafeAreaView edges={['top']} style={styles.headerContainer}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Tambah Destinasi Wisata</Text>
                </View>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* --- FORM CARD --- */}
                <View style={styles.formCard}>
                    
                    {/* 5. MAP INTEGRATION (Disisipkan di sini) */}
                    <Text style={styles.inputLabel}>Pilih Lokasi di Peta</Text>
                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            region={mapRegion}
                            // Jika ingin map ikut bergerak saat di-drag:
                            onRegionChangeComplete={(region) => setMapRegion(region)} 
                        >
                            <Marker
                                coordinate={{
                                    latitude: mapRegion.latitude,
                                    longitude: mapRegion.longitude
                                }}
                                draggable // Bikin marker bisa digeser
                                onDragEnd={handleDragEnd} // Panggil fungsi saat lepas geseran
                                title="Geser Saya"
                                description="Tahan dan geser pin ini ke lokasi tepat"
                                pinColor={PRIMARY_COLOR}
                            />
                        </MapView>
                        {/* Overlay text helper */}
                        <View style={styles.mapOverlay}>
                            <Text style={styles.mapOverlayText}>Tahan & Geser Pin Hijau</Text>
                        </View>
                    </View>

                    {/* INPUT: NAMA */}
                    <Text style={styles.inputLabel}>Nama Lokasi</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="camera-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder='Contoh: Gumuk Pasir'
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* INPUT: KOORDINAT & TOMBOL GET */}
                    <View style={styles.labelRow}>
                        <Text style={styles.inputLabel}>Koordinat</Text>
                        <TouchableOpacity onPress={getCoordinates} disabled={loadingLoc}>
                            <Text style={styles.getLocationText}>
                                {loadingLoc ? "Mengambil..." : "📍 Reset ke Lokasi Saya"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.inputContainer}>
                        <Ionicons name="map-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="-7.12345, 110.12345"
                            value={location}
                            // Biarkan user edit manual juga kalau mau
                            onChangeText={(text) => setLocation(text)}
                            placeholderTextColor="#999"
                        />
                        {loadingLoc && <ActivityIndicator size="small" color={PRIMARY_COLOR} style={{marginRight: 10}}/>}
                    </View>

                    {/* INPUT: AKURASI */}
                    <Text style={styles.inputLabel}>Akurasi (Meter)</Text>
                    <View style={[styles.inputContainer, { backgroundColor: '#f0f0f0' }]}>
                        <Ionicons name="locate-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { color: '#555' }]}
                            placeholder="Akurasi GPS / Manual"
                            value={accuration ? `${accuration} meter` : ''}
                            editable={false} 
                        />
                    </View>

                </View>

                {/* --- SAVE BUTTON --- */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Simpan Lokasi</Text>
                    <Ionicons name="checkmark-circle-outline" size={20} color="white" style={{marginLeft: 8}} />
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG_COLOR,
    },
    // Header Styles
    headerContainer: {
        backgroundColor: PRIMARY_COLOR,
        paddingBottom: 20,
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
    
    // Content Styles
    scrollContent: {
        padding: 20,
    },
    formCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: PRIMARY_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 25,
    },
    
    // Map Styles (BARU)
    mapContainer: {
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    mapOverlay: {
        position: 'absolute',
        bottom: 5,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    mapOverlayText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },

    // Input Styles
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
        color: '#043915',
        marginBottom: 8,
        marginTop: 10,
    },
    getLocationText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: SECONDARY_COLOR, 
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        backgroundColor: '#FAFAFA',
        height: 50,
    },
    inputIcon: {
        marginLeft: 15,
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        height: '100%',
    },

    // Button Styles
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