import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

// 1. IMPORT GUDANG DATA (VisitorContext)
// Pastikan path '../VisitorContext' ini sesuai dengan lokasi file VisitorContext.tsx kamu.
// Jika file context ada di dalam folder 'app', ganti jadi './VisitorContext'
import { VisitorProvider } from './VisitorContext'; 

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    // 2. BUNGKUS APLIKASI DENGAN VISITOR PROVIDER
    <VisitorProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          {/* Halaman Tab Utama */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          
          {/* Halaman Form Input (Kita daftarkan di sini agar bisa dibuka) */}
          <Stack.Screen
            name="forminput"
            options={{
              presentation: 'modal', // Agar muncul dari bawah (animasi slide up)
              headerShown: false, // Sembunyikan header default
            }}
          />
          
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </VisitorProvider>
  );
}