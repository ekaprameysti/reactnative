# 🌊 Banara (Bantul Segara)

**Banara** adalah aplikasi mobile manajemen dan informasi wisata yang dikhususkan untuk wilayah pesisir Kabupaten Bantul. Aplikasi ini berfungsi sebagai dashboard monitoring wisatawan, pemetaan lokasi destinasi, serta manajemen data pengunjung.

## 📱 Deskripsi Produk

Banara hadir untuk mendigitalisasi pengelolaan wisata bahari di Bantul. Aplikasi ini membagi fitur utamanya ke dalam 5 navigasi utama untuk kemudahan akses:

* **🏠Home (Dashboard Statistik):**
Pusat pemantauan utama yang menyajikan ringkasan statistik pengunjung harian dan bulanan. Dilengkapi dengan Grafik Tren Kunjungan interaktif yang dapat difilter per bulan, serta visualisasi data demografi asal pengunjung.

* **👥Visitor (Manajemen Pengunjung):**
Fitur administrasi untuk mencatat dan mengelola data wisatawan. Memungkinkan pengguna untuk mencari, memfilter, menambah data pengunjung baru, serta melakukan ekspor data untuk kebutuhan laporan.

* **📸Destination (Informasi Destinasi):**
Katalog digital yang memuat daftar lengkap pantai populer di Bantul (dikelompokkan berdasarkan wilayah). Menampilkan informasi krusial seperti Jam Operasional, Harga Tiket, dan Kapasitas Daya Tampung area wisata.

* **📍Location (Manajemen Lokasi):**
Fitur CRUD (Create, Read, Update, Delete) untuk mengelola database titik koordinat penting. Terintegrasi langsung dengan Firebase Realtime Database dan sensor GPS perangkat untuk menyimpan data lokasi secara akurat.

* **🗺️Map (Peta Wisata):**
Visualisasi spasial seluruh titik lokasi yang tersimpan dalam bentuk peta interaktif (Google Maps). Dilengkapi dengan marker kustom dan pop-up informasi detail untuk memudahkan pemetaan wilayah wisata.

## 🛠️ Komponen Pembangun (Tech Stack)

Aplikasi ini dibangun menggunakan teknologi modern untuk memastikan performa yang cepat dan kompatibilitas lintas platform (Android & iOS).

* **Framework:** [React Native](https://reactnative.dev/) dengan [Expo](https://expo.dev/) (SDK 52).
* **Bahasa Pemrograman:** TypeScript.
* **Navigasi:** Expo Router (File-based routing).
* **Backend & Database:** [Firebase Realtime Database](https://firebase.google.com/) (untuk penyimpanan data lokasi dan user).
* **Peta & Lokasi:**
    * `react-native-maps`: Untuk tampilan peta interaktif.
    * `expo-location`: Untuk mengambil koordinat GPS pengguna secara akurat.
* **Visualisasi Data:** `react-native-chart-kit` & `react-native-svg` (untuk grafik tren kunjungan).
* **UI/UX:**
    * Custom Stylesheet dengan tema warna **Dark Green** (`#043915`).
    * `@expo/vector-icons` (Ionicons) untuk ikonografi yang konsisten.
    * `react-native-safe-area-context` untuk layout yang aman di berbagai ukuran layar device.

## 💾 Sumber Data

Data yang ditampilkan dalam aplikasi ini bersumber dari:

1.  **Firebase Realtime Database:** Menyimpan data dinamis seperti titik koordinat lokasi baru yang ditambahkan user dan data pengunjung.
2.  **Expo Location Services:** Mengambil data koordinat (*Latitude/Longitude*) dan akurasi secara langsung dari sensor GPS perangkat pengguna.
3.  **Static Data (Mockup):** Sebagian data awal (seperti daftar pantai default dan statistik historis) menggunakan data statis untuk keperluan inisialisasi aplikasi.

## 📸 Tangkapan Layar (Screenshots)

Berikut adalah tampilan antarmuka aplikasi Banara:

* **Tab Home:**
<p align="center">
<img src="https://github.com/user-attachments/assets/417154cb-e51e-4065-acb0-a3b59c8a5202" width="270" />
<img src="https://github.com/user-attachments/assets/0135ecb1-e1a0-4de2-8e82-26443013f416" width="270" />
</p>

* **Tab Visitor:**
<p align="center">
  <img src="https://github.com/user-attachments/assets/3818b836-1728-498c-863f-1d1fec31a1d3" width="270" />
  <img src="https://github.com/user-attachments/assets/c6f53b24-a176-4c5a-8281-fb6b524cfbf2" width="270" />
  <img src="https://github.com/user-attachments/assets/965b9c54-65b2-40e9-b1f6-6724b71e6396" width="270" />
</p>

* **Tab Destination:**
<p align="center">
  <img src="https://github.com/user-attachments/assets/ab1fec6d-dac7-48b7-9aec-26b1b336ff49" width="270" />
  <img src="https://github.com/user-attachments/assets/cbad1d39-dd1a-4054-a9a8-ec3169d19011" width="270" />
  <img src="https://github.com/user-attachments/assets/5fb3c710-1d8f-46c6-8775-1db1ec1105e6" width="270" />
</p>

* **Tab Location:**
<p align="center">
  <img src="https://github.com/user-attachments/assets/bd1a61b9-bb31-46fb-9ff4-638fa6ade8f6" width="170" />
  <img src="https://github.com/user-attachments/assets/0dca7e56-ee58-4233-a372-11e0c9be4847" width="170" />
  <img src="https://github.com/user-attachments/assets/cfb5af2e-b96e-4213-b971-d5bbaff08a4a" width="170" />
  <img src="https://github.com/user-attachments/assets/8ec6fcb3-9ee3-4023-93e0-74ebc3f130d7" width="170" />
  <img src="https://github.com/user-attachments/assets/b0827afc-f50c-4b1c-893d-9343e57cdb06" width="170" />
</p>

* **Tab Map:** 
<p align="center">
  <img src="https://github.com/user-attachments/assets/25ef332d-0179-4483-95eb-1404008d4726" width="270" />
  <img src="https://github.com/user-attachments/assets/dc753232-6a78-4c25-8507-79dac194a804" width="270" />
  <img src="https://github.com/user-attachments/assets/de6042bb-4203-4602-9c1d-296be40dc2ba" width="270" />
</p>

<br/>
<p align="center">
  <b>Aplikasi Banara Dikembangkan Oleh:</b><br/>
  Eka Nafi' Prameysti<br/>
  <br/>
  <a href="https://github.com/ekaprameysti" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
  </a>
  &nbsp; <a href="https://www.linkedin.com/in/eka-nafi-prameysti" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/>
  </a>
</p>
<p align="center">
  Copyright © 2025 Banara
</p>



---



# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
