import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TextInput, Pressable, FlatList, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useVisitor, Visitor } from '../VisitorContext'; 

// --- Constants ---
const PRIMARY_COLOR = '#043915';
const LIGHT_GREEN_BG = '#F2F7F4';
const SOFT_SHADOW = {
  shadowColor: PRIMARY_COLOR,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.05,
  shadowRadius: 12,
  elevation: 3,
};

const BEACH_LIST = [
  'Pantai Parangtritis', 'Pantai Parangkusumo', 'Pantai Depok', 'Pantai Cemara Sewu',
  'Pantai Goa Cemara', 'Pantai Samas', 'Pantai Pandansari', 'Pantai Kuwaru',
  'Pantai Baru', 'Pantai Baros'
];

// --- 20 DATA DUMMY (Agar List Terlihat Penuh) ---
const MOCK_VISITORS: Visitor[] = [
  { id: 'm1', name: 'Ahmad Subarjo', city: 'Yogyakarta', beach: 'Pantai Parangtritis', date: '2025-12-04' },
  { id: 'm2', name: 'Bunga Citra', city: 'Jakarta', beach: 'Pantai Depok', date: '2025-12-04' },
  { id: 'm3', name: 'Cahyo Nugroho', city: 'Sleman', beach: 'Pantai Parangkusumo', date: '2025-12-03' },
  { id: 'm4', name: 'Dewi Lestari', city: 'Bantul', beach: 'Pantai Goa Cemara', date: '2025-12-03' },
  { id: 'm5', name: 'Eko Prasetyo', city: 'Surabaya', beach: 'Pantai Baru', date: '2025-12-02' },
  { id: 'm6', name: 'Fajar Shodiq', city: 'Solo', beach: 'Pantai Parangtritis', date: '2025-12-02' },
  { id: 'm7', name: 'Gita Gutawa', city: 'Bandung', beach: 'Pantai Cemara Sewu', date: '2025-12-01' },
  { id: 'm8', name: 'Hesti Purwanti', city: 'Semarang', beach: 'Pantai Depok', date: '2025-12-01' },
  { id: 'm9', name: 'Indra Bekti', city: 'Jakarta', beach: 'Pantai Kuwaru', date: '2025-11-30' },
  { id: 'm10', name: 'Joko Anwar', city: 'Medan', beach: 'Pantai Baros', date: '2025-11-30' },
  { id: 'm11', name: 'Kurnia Meiga', city: 'Malang', beach: 'Pantai Parangtritis', date: '2025-11-29' },
  { id: 'm12', name: 'Lina Marlina', city: 'Tasikmalaya', beach: 'Pantai Samas', date: '2025-11-29' },
  { id: 'm13', name: 'Miko Wijaya', city: 'Yogyakarta', beach: 'Pantai Pandansari', date: '2025-11-28' },
  { id: 'm14', name: 'Nina Zatulini', city: 'Padang', beach: 'Pantai Parangkusumo', date: '2025-11-28' },
  { id: 'm15', name: 'Oscar Lawalata', city: 'Surabaya', beach: 'Pantai Baru', date: '2025-11-27' },
  { id: 'm16', name: 'Putri Titian', city: 'Palembang', beach: 'Pantai Goa Cemara', date: '2025-11-27' },
  { id: 'm17', name: 'Qori Sandioriva', city: 'Aceh', beach: 'Pantai Depok', date: '2025-11-26' },
  { id: 'm18', name: 'Rina Nose', city: 'Bandung', beach: 'Pantai Parangtritis', date: '2025-11-26' },
  { id: 'm19', name: 'Surya Saputra', city: 'Jakarta', beach: 'Pantai Cemara Sewu', date: '2025-11-25' },
  { id: 'm20', name: 'Tono Sudirjo', city: 'Klaten', beach: 'Pantai Kuwaru', date: '2025-11-25' },
];

// --- UI Components ---
const CustomHeader = () => (
  <View style={styles.headerContainer}>
    <View style={styles.headerTopRow}>
      <View style={styles.appNameContainer}>
        <Ionicons name="water-outline" size={20} color="white" />
        <Text style={styles.appName}>Banara</Text>
      </View>
      <Pressable style={styles.importButton}>
        {/* ICON EXPORT (Share Outline) */}
        <Ionicons name="share-outline" size={16} color="white" />
        <Text style={styles.importButtonText}>Export</Text>
      </Pressable>
    </View>
    <View style={styles.headerContent}>
      <Text style={styles.headerTitle}>Kelola Data</Text>
      <Text style={styles.headerSubtitle}>Riwayat kunjungan wisatawan terkini</Text>
    </View>
  </View>
);

const VisitorCard = ({ item }: { item: Visitor }) => (
  <View style={styles.card}>
    <View style={styles.cardAvatar}>
      <Ionicons name="person-outline" size={24} color={PRIMARY_COLOR} />
    </View>
    <View style={styles.cardBody}>
      <Text style={styles.cardName}>{item.name}</Text>
      <Text style={styles.cardLocation}>{item.beach}</Text>
      <View style={styles.cardDateContainer}>
        <Ionicons name="calendar-outline" size={14} color="#888" />
        <Text style={styles.cardDate}>{item.date}</Text>
      </View>
    </View>
    <Pressable style={styles.cardMoreButton}>
      <Ionicons name="ellipsis-vertical" size={22} color="#888" />
    </Pressable>
  </View>
);

// --- Main Screen ---
export default function ExploreScreen() {
  const { visitors } = useVisitor(); // Data dari Context (Inputan User)
  
  const [searchText, setSearchText] = useState('');
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  // Filter states
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [selectedBeach, setSelectedBeach] = useState<string | 'all'>('all');

  // Temporary states for modal interaction
  const [tempSortBy, setTempSortBy] = useState(sortBy);
  const [tempSelectedBeach, setTempSelectedBeach] = useState(selectedBeach);

  const filteredVisitors = useMemo(() => {
    // GABUNGKAN DATA: Mock Data (20 orang) + Visitors (Data Inputan Baru)
    // Agar list terlihat penuh tapi fitur tambah data tetap jalan.
    let data = [...visitors, ...MOCK_VISITORS]; 

    // Filter by beach
    if (selectedBeach !== 'all') {
      data = data.filter(v => v.beach === selectedBeach);
    }

    // Filter by search text
    if (searchText) {
      data = data.filter(v => v.name.toLowerCase().includes(searchText.toLowerCase()));
    }

    // Sort by date
    data.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return data;
  }, [searchText, sortBy, selectedBeach, visitors]);

  const openFilterModal = () => {
    setTempSortBy(sortBy);
    setTempSelectedBeach(selectedBeach);
    setFilterModalVisible(true);
  };

  const applyFilters = () => {
    setSortBy(tempSortBy);
    setSelectedBeach(tempSelectedBeach);
    setFilterModalVisible(false);
  };

  const resetFilters = () => {
    setTempSortBy('newest');
    setTempSelectedBeach('all');
  };

  const isFilterActive = sortBy !== 'newest' || selectedBeach !== 'all';

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader />

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            placeholder="Cari nama pengunjung..."
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <Pressable style={styles.filterButton} onPress={openFilterModal}>
          <Ionicons name="options-outline" size={24} color={PRIMARY_COLOR} />
          {isFilterActive && <View style={styles.filterActiveDot} />}
        </Pressable>
      </View>

      <FlatList
        data={filteredVisitors}
        renderItem={({ item }) => <VisitorCard item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<View style={styles.emptyListContainer}><Text>Data tidak ditemukan.</Text></View>}
      />

      <Link href="/forminput" asChild>
        <Pressable style={styles.fab}>
          <Ionicons name="add-outline" size={32} color="white" />
        </Pressable>
      </Link>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Data</Text>
              <Pressable onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close-circle" size={26} color="#ccc" />
              </Pressable>
            </View>

            {/* Sort Options */}
            <Text style={styles.filterSectionTitle}>Urutkan Berdasarkan</Text>
            <View style={styles.sortOptionsContainer}>
              <Pressable
                style={[styles.sortButton, tempSortBy === 'newest' && styles.sortButtonActive]}
                onPress={() => setTempSortBy('newest')}
              >
                <Text style={[styles.sortButtonText, tempSortBy === 'newest' && styles.sortButtonTextActive]}>Terbaru</Text>
              </Pressable>
              <Pressable
                style={[styles.sortButton, tempSortBy === 'oldest' && styles.sortButtonActive]}
                onPress={() => setTempSortBy('oldest')}
              >
                <Text style={[styles.sortButtonText, tempSortBy === 'oldest' && styles.sortButtonTextActive]}>Terlama</Text>
              </Pressable>
            </View>

            {/* Beach Filter */}
            <Text style={styles.filterSectionTitle}>Jenis Pantai</Text>
            <ScrollView style={styles.beachFilterContainer}>
              <Pressable
                style={[styles.beachOption, tempSelectedBeach === 'all' && styles.beachOptionActive]}
                onPress={() => setTempSelectedBeach('all')}
              >
                <Text style={[styles.beachOptionText, tempSelectedBeach === 'all' && styles.beachOptionTextActive]}>Semua Pantai</Text>
              </Pressable>
              {BEACH_LIST.map(beach => (
                <Pressable
                  key={beach}
                  style={[styles.beachOption, tempSelectedBeach === beach && styles.beachOptionActive]}
                  onPress={() => setTempSelectedBeach(beach)}
                >
                  <Text style={[styles.beachOptionText, tempSelectedBeach === beach && styles.beachOptionTextActive]}>{beach}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <Pressable style={[styles.footerButton, styles.resetButton]} onPress={resetFilters}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </Pressable>
              <Pressable style={[styles.footerButton, styles.applyButton]} onPress={applyFilters}>
                <Text style={styles.applyButtonText}>Terapkan</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: LIGHT_GREEN_BG,
  },
  // Header
  headerContainer: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  appName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  importButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  headerContent: {
    marginTop: 12,
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
  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: LIGHT_GREEN_BG,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    ...SOFT_SHADOW,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  filterButton: {
    marginLeft: 10,
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    ...SOFT_SHADOW,
  },
  filterActiveDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E53935', // Red dot
    borderWidth: 2,
    borderColor: 'white',
  },
  // List
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Space for FAB
  },
  emptyListContainer: {
    flex: 1,
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    ...SOFT_SHADOW,
  },
  cardAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: LIGHT_GREEN_BG,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardBody: {
    flex: 1,
  },
  cardName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  cardLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  cardDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  cardDate: {
    fontSize: 13,
    color: '#888',
    marginLeft: 4,
  },
  cardMoreButton: {
    padding: 8,
  },
  // FAB
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 30,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 30,
    elevation: 8,
    shadowColor: PRIMARY_COLOR,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginTop: 10,
    marginBottom: 12,
  },
  sortOptionsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  sortButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  sortButtonActive: {
    backgroundColor: LIGHT_GREEN_BG,
    borderColor: PRIMARY_COLOR,
  },
  sortButtonText: {
    fontSize: 16,
    color: '#555',
  },
  sortButtonTextActive: {
    color: PRIMARY_COLOR,
    fontWeight: 'bold',
  },
  beachFilterContainer: {
    maxHeight: 200, 
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
  },
  beachOption: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  beachOptionActive: {
    backgroundColor: LIGHT_GREEN_BG,
  },
  beachOptionText: {
    fontSize: 16,
  },
  beachOptionTextActive: {
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  modalFooter: {
    flexDirection: 'row',
    marginTop: 24,
    justifyContent: 'space-between',
  },
  footerButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#f1f1f1',
    marginRight: 10,
  },
  resetButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: PRIMARY_COLOR,
    marginLeft: 10,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});