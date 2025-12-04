import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity, StatusBar } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAR2BB6JQmnn81l10gTqg_T2rm5dX9Y7ro",
    authDomain: "reactnative2025-ekanafi.firebaseapp.com",
    databaseURL: "https://reactnative2025-ekanafi-default-rtdb.firebaseio.com",
    projectId: "reactnative2025-ekanafi",
    storageBucket: "reactnative2025-ekanafi.firebasestorage.app",
    messagingSenderId: "818194084897",
    appId: "1:818194084897:web:e51f1b14f2b5a470489f60"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function MapScreen() {
    const [markers, setMarkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const pointsRef = ref(db, 'points/');

        const unsubscribe = onValue(pointsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const parsedMarkers = Object.keys(data)
                    .map(key => {
                        const point = data[key];
                        // Ensure coordinates is a string and not empty
                        if (typeof point.coordinates !== 'string' || point.coordinates.trim() === '') {
                            return null;
                        }
                        const [latitude, longitude] = point.coordinates.split(',').map(Number);

                        // Validate that parsing was successful
                        if (isNaN(latitude) || isNaN(longitude)) {
                            console.warn(`Invalid coordinates for point ${key}:`, point.coordinates);
                            return null;
                        }

                        return {
                            id: key,
                            name: point.name,
                            latitude,
                            longitude,
                        };
                    })
                    .filter(Boolean); // Filter out any null entries from invalid data

                setMarkers(parsedMarkers);
            } else {
                setMarkers([]);
            }
            setLoading(false);
        }, (error) => {
            console.error(error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const renderHeader = () => (
        <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12
                }}>
                    <Ionicons name="water-outline" size={18} color="white" />
                    <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold', marginLeft: 6 }}>
                        Banara
                    </Text>
                </View>
            </View>
            <Text style={styles.headerTitle}>Peta Interaktif</Text>
            <Text style={styles.headerSubtitle}>Lihat semua lokasi wisata pesisir yang tersimpan</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#043915" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#043915" />
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: -7.987076832933547, // Initial center (e.g., Yogyakarta)
                    longitude: 110.27347073097134, 
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                zoomControlEnabled={true}
            >
                {markers.map(marker => (
                    <Marker
                        key={marker.id}
                        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                        title={marker.name}
                        description={`Coords: ${marker.latitude}, ${marker.longitude}`}
                    />
                ))}
            </MapView>
            {renderHeader()}
            <TouchableOpacity style={styles.fab} onPress={() => router.push('/forminputlocation')}>
                <FontAwesome name="plus" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7F9',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F4F7F9',
    },
    headerContainer: {
        backgroundColor: '#043915',
        paddingHorizontal: 20,
        paddingBottom: 25,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 4,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        left: 20,
        bottom: 20,
        backgroundColor: '#043915',
        borderRadius: 30,
        elevation: 8,
    },
});