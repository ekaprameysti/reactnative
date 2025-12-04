import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Modal,
  Pressable,
  FlatList,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';

// --- Constants & Helpers ---
const PRIMARY_COLOR = '#043915';
const LIGHT_GREEN_BG = '#F2F7F4';
// Updated month array as per requirement
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

const BEACH_LIST = [
  'Pantai Parangtritis', 'Pantai Parangkusumo', 'Pantai Depok', 'Pantai Cemara Sewu',
  'Pantai Goa Cemara', 'Pantai Samas', 'Pantai Pandansari', 'Pantai Kuwaru',
  'Pantai Baru (Pandansimo)', 'Pantai Baros',
];

const generateMockStats = () => ({
  today: Math.floor(Math.random() * 2000 + 500).toLocaleString('id-ID'),
  thisMonth: Math.floor(Math.random() * 40000 + 10000).toLocaleString('id-ID'),
});

// Function to get different data for each month
const getDataForMonth = (month: string) => {
  const monthIndex = MONTHS.indexOf(month);
  const baseData = [850, 1200, 950, 1500];
  // Create varied data based on month index
  return baseData.map(val => Math.round(val + (monthIndex * 50) * (Math.random() - 0.5)));
};


// --- UI Components ---
const ProgressBar = ({ percentage }: { percentage: number }) => (
  <View style={styles.progressBarTrack}>
    <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
  </View>
);

const CustomHeader = ({ selectedBeach, onSelectPress }: { selectedBeach: string, onSelectPress: () => void }) => (
  <View style={styles.headerContainer}>
    <View style={styles.headerTopRow}>
      <View style={styles.appNameContainer}>
        <Ionicons name="water-outline" size={18} color="white" />
        <Text style={styles.appName}>Banara</Text>
      </View>
      <Ionicons name="notifications-outline" size={24} color="white" />
    </View>
    <View style={styles.headerContent}>
      <Text style={styles.headerTitle}>Dashboard Pariwisata</Text>
      <Text style={styles.headerSubtitle}>Wilayah Pesisir Kabupaten Bantul</Text>
      <Text style={styles.headerSlogan}>Jelajah destinasi wisata di Bantul Segara!</Text>
    </View>
    <Pressable style={styles.headerSelector} onPress={onSelectPress}>
      <Text style={styles.headerSelectorText}>{selectedBeach}</Text>
      <Ionicons name="chevron-down" size={20} color={PRIMARY_COLOR} />
    </Pressable>
  </View>
);

// --- ADVANCED INTERACTIVE CHART COMPONENT ---
const TrendChart = () => {
  // Default month set to 'Mei' as requested
  const [selectedMonth, setSelectedMonth] = useState('Mei');
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; value: number } | null>(null);

  // Calculate width dynamically as requested
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 100;

  const handleDataPointClick = ({ value, x, y }: { value: number; x: number; y: number }) => {
    setTooltip({ visible: true, x, y: y - 5, value });
  };

  const chartConfig = {
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(4, 57, 21, ${opacity})`, // Primary green
    labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    propsForDots: { r: '5', strokeWidth: '2', stroke: '#b5dcc9' },
    withInnerLines: false,
    withOuterLines: true,
  };

  const TooltipDecorator = () => {
    if (!tooltip || !tooltip.visible) {
      return null;
    }
    const tooltipWidth = 65;
    const tooltipHeight = 30;
    return (
      <Svg>
        <Rect
          x={tooltip.x - (tooltipWidth / 2)}
          y={tooltip.y - tooltipHeight - 10} // Position above the dot
          width={tooltipWidth}
          height={tooltipHeight}
          rx={8} // Rounded corners
          fill="rgba(0, 0, 0, 0.8)"
        />
        <SvgText
          x={tooltip.x}
          y={tooltip.y - tooltipHeight / 2 - 5}
          fill="white"
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle">
          {tooltip.value.toLocaleString('id-ID')}
        </SvgText>
      </Svg>
    );
  };

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthSelectorContainer}>
        {MONTHS.map((month) => (
          <TouchableOpacity
            key={month}
            style={[styles.monthButton, selectedMonth === month && styles.monthButtonActive]}
            onPress={() => {
              setSelectedMonth(month);
              setTooltip(null); // Hide tooltip when month changes
            }}>
            <Text style={[styles.monthButtonText, selectedMonth === month && styles.monthButtonTextActive]}>
              {month}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View>
        <LineChart
          data={{
            labels: ['M1', 'M2', 'M3', 'M4'],
            datasets: [{ data: getDataForMonth(selectedMonth) }],
          }}
          width={chartWidth}
          height={250}
          chartConfig={chartConfig}
          bezier
          style={styles.chartStyle} // Critical style for padding
          onDataPointClick={handleDataPointClick}
          decorator={TooltipDecorator}
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
        />
        {/* Pressable overlay to hide tooltip on chart click */}
        {tooltip?.visible && <Pressable style={StyleSheet.absoluteFill} onPress={() => setTooltip(null)} />}
      </View>
    </View>
  );
};


// --- Main Screen ---
export default function DashboardScreen() {
  const [selectedBeach, setSelectedBeach] = useState('Pantai Parangkusumo');
  const [modalVisible, setModalVisible] = useState(false);
  const [visitorStats, setVisitorStats] = useState(generateMockStats());

  useEffect(() => {
    setVisitorStats(generateMockStats());
  }, [selectedBeach]);

  const visitorOrigin = [
    { city: 'Yogyakarta', percentage: 45 }, { city: 'Jakarta', percentage: 25 },
    { city: 'Bandung', percentage: 15 }, { city: 'Surabaya', percentage: 10 },
    { city: 'Lainnya', percentage: 5 },
  ];
  
  const favoriteSpot = 'Gumuk Pasir';
  const notifications = [
    { id: 1, text: 'Festival Layang-layang akan diadakan pada tanggal 10-12 Desember.' },
    { id: 2, text: 'Cuaca hari ini cerah, cocok untuk menikmati sunset.' },
  ];

  const handleSelectBeach = (beach: string) => {
    setSelectedBeach(beach);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />
      
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Pilih Pantai</Text>
            <FlatList
              data={BEACH_LIST}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable style={styles.modalItem} onPress={() => handleSelectBeach(item)}>
                  <Text style={styles.modalItemText}>{item}</Text>
                </Pressable>
              )}
              style={styles.modalList}
            />
          </View>
        </View>
      </Modal>

      <CustomHeader selectedBeach={selectedBeach} onSelectPress={() => setModalVisible(true)} />

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Ringkasan Statistik */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ringkasan Statistik</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={24} color={PRIMARY_COLOR} />
              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Pengunjung Hari Ini</Text>
                <Text style={styles.statValue}>{visitorStats.today}</Text>
              </View>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="calendar-outline" size={24} color={PRIMARY_COLOR} />
              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Pengunjung Bulan Ini</Text>
                <Text style={styles.statValue}>{visitorStats.thisMonth}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tren Kunjungan */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Tren Kunjungan</Text>
            <View style={styles.liveBadgeInCard}>
              <View style={styles.liveBadgeDotInCard} />
              <Text style={styles.liveBadgeTextInCard}>Update Setiap Tanggal 1</Text>
            </View>
          </View>
          <TrendChart />
        </View>

        {/* Asal Pengunjung */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Asal Pengunjung</Text>
          {visitorOrigin.map((item, index) => (
            <View key={index} style={styles.originItem}>
              <View style={styles.originTextContainer}>
                <Text style={styles.originCity}>{item.city}</Text>
                <Text style={styles.originPercentage}>{item.percentage}%</Text>
              </View>
              <ProgressBar percentage={item.percentage} />
            </View>
          ))}
        </View>

        {/* Lokasi Terfavorit */}
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Lokasi Terfavorit</Text>
            <View style={styles.favoriteContainer}>
                <Ionicons name="star" size={20} color="#FFD700" />
                <Text style={styles.favoriteText}>{favoriteSpot} di {selectedBeach}</Text>
            </View>
        </View>
        
        {/* Highlight Informasi */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Highlight Informasi</Text>
          {notifications.map((item) => (
            <View key={item.id} style={styles.notificationItem}>
              <Ionicons name="information-circle-outline" size={20} color={PRIMARY_COLOR} />
              <Text style={styles.notificationText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: LIGHT_GREEN_BG,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
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
  headerContent: {
    marginTop: 8,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
    marginTop: 4,
  },
  headerSlogan: {
    color: 'white',
    fontSize: 12,
    opacity: 0.7,
    fontStyle: 'italic',
    marginTop: 4,
  },
  headerSelector: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerSelectorText: {
    color: PRIMARY_COLOR,
    fontSize: 16,
    fontWeight: '600',
  },
  // Cards
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign:'center',
  },
  liveBadgeInCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveBadgeDotInCard: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 5,
  },
  liveBadgeTextInCard: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  // Stats Card
  statsContainer: {
    flexDirection: 'column', 
    gap: 15, 
  },
  statItem: {
    flexDirection: 'row', 
    alignItems: 'center',
    width: '100%', 
    backgroundColor: '#F5F5F5', 
    padding: 12, 
    borderRadius: 12, 
  },
  statTextContainer: {
    marginLeft: 15, 
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 20, 
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  // Origin Card
  originItem: {
    marginBottom: 12,
  },
  originTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  originCity: {
    fontSize: 15,
    color: '#444',
  },
  originPercentage: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
  },
  progressBarTrack: {
    backgroundColor: '#E0E0E0',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    backgroundColor: PRIMARY_COLOR,
    height: '100%',
    borderRadius: 4,
  },
  // Favorite Card
  favoriteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: LIGHT_GREEN_BG,
    borderRadius: 12,
  },
  favoriteText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  // Notification/Highlight Card
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  notificationText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#555',
    flexShrink: 1,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    paddingTop: 25,
    alignItems: 'center',
    width: '90%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalList: {
    width: '100%',
  },
  modalItem: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    width: '100%',
  },
  modalItemText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
  },
  // Styles for TrendChart
  monthSelectorContainer: {
    marginBottom: 16,
  },
  monthButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0', // Light gray for inactive
    marginRight: 10,
  },
  monthButtonActive: {
    backgroundColor: PRIMARY_COLOR, // Dark green for active
  },
  monthButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  monthButtonTextActive: {
    color: '#FFFFFF',
  },
  // CRITICAL: Added padding to prevent label clipping
  chartStyle: {
    borderRadius: 16,
    paddingRight: 50,
    paddingLeft: 30,
  },
});