import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Modal,
    Pressable,
    FlatList,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useVisitor } from './VisitorContext'; // 1. Import useVisitor

const PRIMARY_COLOR = '#043915';

// --- Constants ---
const BEACH_LIST = [
    'Pantai Parangtritis', 'Pantai Parangkusumo', 'Pantai Depok', 'Pantai Cemara Sewu',
    'Pantai Goa Cemara', 'Pantai Samas', 'Pantai Pandansari', 'Pantai Kuwaru',
    'Pantai Baru', 'Pantai Baros'
];

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};


const AddVisitorScreen = () => {
    const router = useRouter();
    const { addVisitor } = useVisitor(); // Get addVisitor from context
    const insets = useSafeAreaInsets(); // Get safe area insets

    // Form state
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [beach, setBeach] = useState('');
    const [date, setDate] = useState(getTodayDate()); // Pre-fill with today's date

    // Modal state
    const [isBeachModalVisible, setBeachModalVisible] = useState(false);

    const handleSave = () => {
        // Basic Validation
        if (!name.trim() || !city.trim() || !beach.trim() || !date.trim()) {
            Alert.alert('Data Tidak Lengkap', 'Mohon isi semua kolom yang wajib diisi.');
            return;
        }

        const newVisitor = {
            id: Date.now().toString(), // Simple unique ID
            name: name.trim(),
            city: city.trim(),
            beach,
            date,
        };

        addVisitor(newVisitor); // 4. Call addVisitor from context
        router.back(); // 4. Go back to the previous screen
    };

    const handleSelectBeach = (selectedBeach: string) => {
        setBeach(selectedBeach);
        setBeachModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />

            {/* Custom Header */}
            <View style={[styles.headerContainer, { paddingTop: insets.top, paddingBottom: 20 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tambah Pengunjung</Text>
                <View style={{ width: 40 }} />{/* Spacer */}
            </View>

            <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 30 }}>
                <View style={styles.formContainer}>
                    {/* Nama Lengkap */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Nama Lengkap</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={22} color={PRIMARY_COLOR} style={styles.inputIcon} />
                            <TextInput
                                style={styles.textInput}
                                placeholder="cth: Eka Nafi' Prameysti"
                                placeholderTextColor="#888"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    </View>

                    {/* Asal Kota */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Asal Kota</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="location-outline" size={22} color={PRIMARY_COLOR} style={styles.inputIcon} />
                            <TextInput
                                style={styles.textInput}
                                placeholder="cth: Yogyakarta"
                                placeholderTextColor="#888"
                                value={city}
                                onChangeText={setCity}
                            />
                        </View>
                    </View>

                    {/* Pilih Pantai */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Pilih Pantai</Text>
                        <Pressable style={styles.inputContainer} onPress={() => setBeachModalVisible(true)}>
                            <Ionicons name="map-outline" size={22} color={PRIMARY_COLOR} style={styles.inputIcon} />
                            <View style={styles.touchableInput}>
                                <Text style={beach ? styles.inputTextSelected : styles.inputTextPlaceholder}>
                                    {beach || 'Pilih salah satu pantai'}
                                </Text>
                                <Ionicons name="chevron-down-outline" size={22} color="#888" />
                            </View>
                        </Pressable>
                    </View>

                    {/* Tanggal Kunjungan */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Tanggal Kunjungan</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="calendar-outline" size={22} color={PRIMARY_COLOR} style={styles.inputIcon} />
                            <TextInput
                                style={styles.textInput}
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor="#888"
                                value={date}
                                onChangeText={setDate}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Action Button */}
            <View style={styles.buttonWrapper}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Simpan Data</Text>
                </TouchableOpacity>
            </View>

            {/* Beach Selection Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isBeachModalVisible}
                onRequestClose={() => setBeachModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setBeachModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Pilih Pantai</Text>
                        <FlatList
                            data={BEACH_LIST}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <Pressable style={styles.modalItem} onPress={() => handleSelectBeach(item)}>
                                    <Text style={styles.modalItemText}>{item}</Text>
                                </Pressable>
                            )}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                        />
                    </View>
                </Pressable>
            </Modal>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    headerContainer: {
        backgroundColor: PRIMARY_COLOR,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,

        borderBottomLeftRadius: 30,  // Lengkungan kiri bawah
        borderBottomRightRadius: 30, // Lengkungan kanan bawah
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollContainer: {
        flex: 1,
    },
    formContainer: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
        marginBottom: 8,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        height: 55,
        paddingHorizontal: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    inputIcon: {
        marginRight: 10,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    touchableInput: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
    },
    inputTextPlaceholder: {
        fontSize: 16,
        color: '#888',
    },
    inputTextSelected: {
        fontSize: 16,
        color: '#333',
    },
    buttonWrapper: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#F8F9FA',
    },
    saveButton: {
        backgroundColor: PRIMARY_COLOR,
        height: 50,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: PRIMARY_COLOR,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        width: '90%',
        maxHeight: '70%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalItem: {
        paddingVertical: 15,
    },
    modalItemText: {
        fontSize: 18,
        textAlign: 'center',
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
    }
});

export default AddVisitorScreen;
