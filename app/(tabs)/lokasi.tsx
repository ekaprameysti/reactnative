import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, remove } from 'firebase/database';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Linking,
    RefreshControl,
    SectionList,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LokasiScreen() {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const router = useRouter();
    const insets = useSafeAreaInsets();

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

    const handlePress = (coordinates) => {
        const [latitude, longitude] = coordinates.split(',').map(coord => coord.trim());
        const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        Linking.openURL(url);
    };

    const handleDelete = (id) => {
        Alert.alert(
            "Hapus Lokasi",
            "Apakah Anda yakin ingin menghapus lokasi ini?",
            [
                { text: "Batal", style: "cancel" },
                {
                    text: "Hapus",
                    onPress: () => {
                        const pointRef = ref(db, `points/${id}`);
                        remove(pointRef);
                    },
                    style: "destructive"
                }
            ]
        );
    }

    useEffect(() => {
        const pointsRef = ref(db, 'points/');
        const unsubscribe = onValue(pointsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const pointsArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                const formattedData = [{
                    title: 'Daftar Lokasi',
                    data: pointsArray
                }];
                setSections(formattedData);
            } else {
                setSections([]);
            }
            setLoading(false);
        }, (error) => {
            console.error(error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    const handleEdit = (item) => {
        router.push({
            pathname: "/formeditlocation",
            params: {
                id: item.id,
                name: item.name,
                coordinates: item.coordinates,
                accuration: item.accuration || ''
            }
        });
    };

    // --- RENDER COMPONENTS ---

    const renderHeader = () => (
        <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
            {/* Branding Row - Sekarang di Kanan */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
                {/* Container Ikon Transparan */}
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

            <Text style={styles.headerTitle}>Lokasi Tersimpan</Text>
            <Text style={styles.headerSubtitle}>Temukan lokasi wisata pesisir favoritmu</Text>
        </View>
    );

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => handlePress(item.coordinates)}
            >
                <Ionicons name="location" size={24} color="#043915" />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.contentContainer}
                onPress={() => handlePress(item.coordinates)}
            >
                <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                <View style={styles.coordinateRow}>
                    <Ionicons name="map-outline" size={12} color="#666" style={{ marginRight: 4 }} />
                    <Text style={styles.cardSubtitle} numberOfLines={1}>{item.coordinates}</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.actionContainer}>
                <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
                    <Ionicons name="pencil" size={20} color="#FFA000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={[styles.actionButton, { marginTop: 10 }]}>
                    <Ionicons name="trash-outline" size={20} color="#D32F2F" />
                </TouchableOpacity>
            </View>
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
            {renderHeader()}
            {sections.length > 0 ? (
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    stickySectionHeadersEnabled={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#043915']} />
                    }
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="map-outline" size={60} color="#ccc" />
                    <Text style={styles.emptyText}>Belum ada lokasi tersimpan.</Text>
                </View>
            )}
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
    listContent: {
        padding: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 12,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    coordinateRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardSubtitle: {
        fontSize: 12,
        color: '#777',
    },
    actionContainer: {
        marginLeft: 10,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    actionButton: {
        padding: 5,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
        marginTop: 10,
    }
});