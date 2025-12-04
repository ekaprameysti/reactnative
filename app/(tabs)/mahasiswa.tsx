import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    SectionList,
    Image,
    Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- Constants ---
const PRIMARY_COLOR = '#043915';
const LIGHT_GREEN_BG = '#F2F7F4';

// Data Structure
const DATA = [
    {
        title: '📍 Wilayah Timur (Zona Populer)',
        data: [
            { id: '1', name: 'Pantai Parangtritis', openingHours: '24 Jam', price: 10000, capacity: 15000, visitors: 8500, image: 'https://panduanwisata.b-cdn.net/wp-content/uploads/2021/05/Pemandangan-Pantai-Parangtritis-by-GMap.jpg' },
            { id: '2', name: 'Pantai Parangkusumo', openingHours: '24 Jam', price: 10000, capacity: 5000, visitors: 1200, image: 'https://seringjalan.com/wp-content/uploads/2020/05/WhatsApp-Image-2020-05-12-at-1.41.21-PM-816x459.jpeg' },
            { id: '3', name: 'Pantai Depok', openingHours: '06.00 - 18.00', price: 7500, capacity: 8000, visitors: 4500, image: 'https://travelspromo.com/wp-content/uploads/2019/09/Kungfu-Baik-Pesaing-Pantai-Parngtritis-e1570093803621-1536x960.jpg' },
        ]
    },
    {
        title: '🌲 Wilayah Tengah (Zona Cemara)',
        data: [
            { id: '4', name: 'Pantai Cemara Sewu', openingHours: '05.00 - 19.00', price: 5000, capacity: 3000, visitors: 800, image: 'https://travelspromo.com/wp-content/uploads/2020/04/2-Pantai-Seribu-Cemara-indrasmara-ilham-1536x864.jpg' },
            { id: '5', name: 'Pantai Goa Cemara', openingHours: '06.00 - 18.00', price: 5000, capacity: 3500, visitors: 1500, image: 'https://www.simplyhomy-guesthouse.com/wp-content/uploads/2017/08/cemara-1.jpg' },
            { id: '6', name: 'Pantai Samas', openingHours: '05.00 - 18.00', price: 4000, capacity: 2000, visitors: 500, image: 'https://nagantour.com/wp-content/uploads/2023/03/Pesona-Pengklik-Pantai-Samas.webp' },
            { id: '7', name: 'Pantai Pandansari', openingHours: '05.00 - 18.00', price: 5000, capacity: 2500, visitors: 600, image: 'https://yukdolan.com/wp-content/uploads/2023/09/Pantai-Pandansari-Jogja.jpg' },
        ]
    },
    {
        title: '⚓ Wilayah Barat (Zona Muara)',
        data: [
            { id: '8', name: 'Pantai Kuwaru', openingHours: '06.00 - 17.00', price: 5000, capacity: 2000, visitors: 450, image: 'https://travelspromo.com/wp-content/uploads/2019/10/Pantai-Kuwaru-Bantul-Alfian-Solihin.jpg' },
            { id: '9', name: 'Pantai Baru', openingHours: '05.00 - 19.00', price: 4000, capacity: 4000, visitors: 2100, image: 'https://homestaydijogja.net/wp-content/uploads/2023/09/Pantai-baru-bantul-jogja.jpg' },
            { id: '10', name: 'Pantai Baros', openingHours: '08.00 - 17.00', price: 3000, capacity: 1500, visitors: 300, image: 'https://widyalokawisata.com/wp-content/uploads/2020/03/Pantai-Baros.webp' },
        ]
    }
];

// Helpers
const getVisitorPercentage = (visitors, capacity) => {
    if (capacity === 0) return 0;
    return (visitors / capacity) * 100;
};

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

// --- COMPONENTS ---

const Item = ({ item }) => {
    const percentage = getVisitorPercentage(item.visitors, item.capacity);

    return (
        <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                
                {/* Meta Info: Hours & Price */}
                <View style={styles.metaInfoContainer}>
                    <View style={styles.metaRow}>
                        <Ionicons name="time-outline" size={14} color="#043915" />
                        <Text style={styles.metaText}>{item.openingHours}</Text>
                    </View>
                    <View style={styles.metaRow}>
                        <Ionicons name="pricetag-outline" size={14} color="#043915" />
                        <Text style={styles.metaText}>{formatRupiah(item.price)}</Text>
                    </View>
                </View>

                {/* Visitor Capacity Bar */}
                <View style={styles.visitorSection}>
                    <View style={styles.visitorInfo}>
                        <Ionicons name="people-outline" size={14} color="#666" />
                        <Text style={styles.visitorText}>
                            {item.visitors.toLocaleString()} / {item.capacity.toLocaleString()}
                        </Text>
                    </View>
                    <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
                    </View>
                </View>
            </View>
        </View>
    );
};

const CustomHeader = () => {
    const insets = useSafeAreaInsets();
    
    return (
        <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
            <View style={styles.headerTopRow}>
                {/* Branding Banara dengan Kotak Transparan */}
                <View style={styles.appNameContainer}>
                    <Ionicons name="water-outline" size={18} color="white" />
                    <Text style={styles.appName}>Banara</Text>
                </View>
                
                <Pressable style={styles.headerIcon}>
                    <Ionicons name="notifications-outline" size={22} color="white" />
                </Pressable>
            </View>
            
            <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>Destinasi Populer</Text>
                <Text style={styles.headerSubtitle}>Temukan pantai favoritmu di Bantul</Text>
            </View>
        </View>
    );
};

// --- MAIN SCREEN ---
const DestinasiScreen = () => {
    return (
        <View style={styles.container}>
            <StatusBar style="light" backgroundColor={PRIMARY_COLOR} />
            
            <CustomHeader />
            
            <SectionList
                sections={DATA}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Item item={item} />}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                )}
                contentContainerStyle={styles.listContentContainer}
                style={styles.sectionList}
            />
        </View>
    );
};

// --- STYLES ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LIGHT_GREEN_BG,
    },
    sectionList: {
        backgroundColor: LIGHT_GREEN_BG,
    },
    // HEADER STYLES
    headerContainer: {
        backgroundColor: PRIMARY_COLOR,
        paddingHorizontal: 20,
        paddingBottom: 25,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        // Shadow for depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    // INI BAGIAN YANG DIPERBAIKI (Kotak Transparan)
    appNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparan Putih
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    appName: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 6,
    },
    headerIcon: {
        padding: 5,
    },
    headerContent: {
        alignItems: 'flex-start',
    },
    headerTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: 'white',
        fontSize: 14,
        opacity: 0.8,
        marginTop: 4,
    },

    // LIST STYLES
    listContentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 10,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
        paddingVertical: 15,
        backgroundColor: LIGHT_GREEN_BG,
    },
    
    // CARD ITEM STYLES
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        height: 130,
    },
    itemImage: {
        width: 110,
        height: '100%',
        resizeMode: 'cover',
    },
    itemDetails: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222',
    },
    metaInfoContainer: {
        marginTop: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    metaText: {
        fontSize: 13,
        color: '#444',
        marginLeft: 6,
        fontWeight: '500',
    },
    visitorSection: {
        marginTop: 'auto',
    },
    visitorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        justifyContent: 'flex-end',
    },
    visitorText: {
        marginLeft: 6,
        fontSize: 12,
        color: '#666',
    },
    progressBarBackground: {
        height: 6,
        backgroundColor: '#E0E0E0',
        borderRadius: 3,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 3,
    },
});

export default DestinasiScreen;