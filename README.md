# Aplikasi Nomor Ujian Mahasiswa

Aplikasi web untuk mengatur nomor ujian mahasiswa dengan sistem alokasi ruang yang otomatis dan optimal.

## 🚀 Fitur Utama

### 1. Manajemen Ruang Ujian
- **Kelas Besar**: Kapasitas 55 orang
- **Kelas Sedang**: Kapasitas 30 orang  
- **Kelas Kecil**: Kapasitas 25 orang
- CRUD operasi untuk ruang ujian
- Statistik penggunaan ruang

### 2. Manajemen Matakuliah
- Input data matakuliah dan jumlah peserta
- Import data dari CSV/Excel
- Tracking status matakuliah

### 3. Algoritma Alokasi Ruang
- Auto-assign ruang berdasarkan jumlah peserta
- Prioritas ruang berdekatan untuk satu matakuliah
- Optimasi penggunaan ruang untuk meminimalkan waste space
- Conflict detection untuk jadwal yang bentrok

### 4. Output & Laporan
- Generate nomor ujian untuk setiap mahasiswa
- Laporan alokasi ruang per matakuliah
- Denah tempat duduk per ruang
- Export ke PDF dan Excel

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js dengan TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Native PostgreSQL driver (pg)
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: React.js dengan TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **UI Components**: Headless UI, Heroicons
- **Export**: jsPDF untuk PDF generation
- **Charts**: Recharts untuk visualisasi data

## 📋 Prerequisites

Sebelum menjalankan aplikasi, pastikan sistem Anda memiliki:

1. **Node.js** (versi 16 atau lebih baru)
2. **PostgreSQL** (versi 12 atau lebih baru)
3. **npm** atau **yarn** package manager

## 🚀 Installation & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd myproject
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Database Setup

#### a. Buat Database PostgreSQL
```sql
CREATE DATABASE ujian_mahasiswa;
CREATE USER ujian_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ujian_mahasiswa TO ujian_user;
```

#### b. Konfigurasi Environment Variables
Copy file `env.example` ke `.env` dan sesuaikan konfigurasi:

```bash
cd backend
cp env.example .env
```

Edit file `.env`:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ujian_mahasiswa
DB_USER=ujian_user
DB_PASSWORD=your_password

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Run Database Migrations
```bash
cd backend
npm run migrate
```

### 5. Seed Sample Data (Optional)
```bash
npm run seed
```

### 6. Start Development Server
```bash
# Start backend server
npm run dev

# Start frontend server
cd ../frontend
npm run dev
```

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication
Saat ini API tidak memerlukan authentication. Untuk production, implementasi JWT authentication akan ditambahkan.

### Endpoints

#### Ruang (Rooms)

##### GET /api/ruang
Mendapatkan semua data ruang
```bash
curl http://localhost:3001/api/ruang
```

##### GET /api/ruang/:id
Mendapatkan data ruang berdasarkan ID
```bash
curl http://localhost:3001/api/ruang/1
```

##### POST /api/ruang
Membuat ruang baru
```bash
curl -X POST http://localhost:3001/api/ruang \
  -H "Content-Type: application/json" \
  -d '{
    "nama_ruang": "A101",
    "kapasitas": 55,
    "lokasi": "Gedung A",
    "lantai": 1,
    "gedung": "Gedung A",
    "status": "aktif"
  }'
```

##### PUT /api/ruang/:id
Update data ruang
```bash
curl -X PUT http://localhost:3001/api/ruang/1 \
  -H "Content-Type: application/json" \
  -d '{
    "kapasitas": 60
  }'
```

##### DELETE /api/ruang/:id
Hapus ruang
```bash
curl -X DELETE http://localhost:3001/api/ruang/1
```

##### GET /api/ruang/statistics
Mendapatkan statistik ruang
```bash
curl http://localhost:3001/api/ruang/statistics
```

##### GET /api/ruang/with-allocation
Mendapatkan ruang dengan informasi alokasi untuk waktu tertentu
```bash
curl "http://localhost:3001/api/ruang/with-allocation?tanggal=2024-01-15&waktu_mulai=08:00&waktu_selesai=10:00"
```

#### Alokasi (Allocation)

##### POST /api/allocation/auto
Auto alokasi ruang untuk matakuliah
```bash
curl -X POST http://localhost:3001/api/allocation/auto \
  -H "Content-Type: application/json" \
  -d '{
    "tanggal": "2024-01-15",
    "waktu_mulai": "08:00",
    "waktu_selesai": "10:00",
    "matakuliah_ids": [1, 2, 3]
  }'
```

##### GET /api/allocation/summary
Mendapatkan ringkasan alokasi untuk waktu tertentu
```bash
curl "http://localhost:3001/api/allocation/summary?tanggal=2024-01-15&waktu_mulai=08:00&waktu_selesai=10:00"
```

##### POST /api/allocation/check-conflicts
Cek konflik alokasi
```bash
curl -X POST http://localhost:3001/api/allocation/check-conflicts \
  -H "Content-Type: application/json" \
  -d '{
    "tanggal": "2024-01-15",
    "waktu_mulai": "08:00",
    "waktu_selesai": "10:00"
  }'
```

##### POST /api/allocation/preview
Preview alokasi tanpa menyimpan ke database
```bash
curl -X POST http://localhost:3001/api/allocation/preview \
  -H "Content-Type: application/json" \
  -d '{
    "tanggal": "2024-01-15",
    "waktu_mulai": "08:00",
    "waktu_selesai": "10:00"
  }'
```

## 🧪 Testing

### Run Tests
```bash
cd backend
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

## 📊 Database Schema

### Tabel Ruang
```sql
CREATE TABLE ruang (
    id SERIAL PRIMARY KEY,
    nama_ruang VARCHAR(50) NOT NULL UNIQUE,
    kapasitas INTEGER NOT NULL CHECK (kapasitas > 0),
    lokasi VARCHAR(100),
    lantai INTEGER,
    gedung VARCHAR(50),
    status VARCHAR(20) DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel Matakuliah
```sql
CREATE TABLE matakuliah (
    id SERIAL PRIMARY KEY,
    kode_mk VARCHAR(20) NOT NULL UNIQUE,
    nama_mk VARCHAR(100) NOT NULL,
    jumlah_peserta INTEGER NOT NULL CHECK (jumlah_peserta > 0),
    dosen VARCHAR(100),
    semester VARCHAR(10),
    tahun_ajaran VARCHAR(10),
    status VARCHAR(20) DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel Alokasi
```sql
CREATE TABLE alokasi (
    id SERIAL PRIMARY KEY,
    matakuliah_id INTEGER NOT NULL REFERENCES matakuliah(id),
    ruang_id INTEGER NOT NULL REFERENCES ruang(id),
    tanggal DATE NOT NULL,
    waktu_mulai TIME NOT NULL,
    waktu_selesai TIME NOT NULL,
    nomor_urut INTEGER DEFAULT 1,
    jumlah_peserta_dialokasikan INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'direncanakan',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Development

### Project Structure
```
myproject/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & app configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   ├── migrations/          # Database migrations
│   ├── tests/               # Test files
│   └── package.json
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   └── package.json
└── README.md
```

### Available Scripts

#### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed sample data

## 🚀 Deployment

### Production Build
```bash
cd backend
npm run build
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
DB_HOST=your_production_db_host
DB_PORT=5432
DB_NAME=ujian_mahasiswa
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
JWT_SECRET=your_very_secure_jwt_secret
CORS_ORIGIN=https://yourdomain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

Jika Anda mengalami masalah atau memiliki pertanyaan:

1. Periksa [Issues](../../issues) untuk solusi yang sudah ada
2. Buat [Issue](../../issues/new) baru dengan detail masalah Anda
3. Hubungi tim development

## 🔄 Roadmap

### Phase 1: Backend Core ✅
- [x] Database schema design
- [x] API endpoints for CRUD operations
- [x] Room allocation algorithm
- [x] Basic validation and error handling

### Phase 2: Frontend Interface ✅
- [x] Dashboard dan navigation
- [x] Layout responsif dengan sidebar
- [x] API service layer
- [x] TypeScript types dan components
- [ ] Form input matakuliah dan ruang
- [ ] Real-time allocation preview
- [ ] Manual adjustment interface

### Phase 3: Advanced Features 📋
- [ ] PDF export functionality
- [ ] Drag & drop manual override
- [ ] Conflict resolution system
- [ ] Analytics dan reporting
- [ ] User authentication & authorization
- [ ] Email notifications
- [ ] Mobile responsive design

## 📱 Setup Environment React Native (Aplikasi Mahasiswa)

Berikut langkah-langkah untuk menyiapkan environment React Native di Mac (Android):

1. **Install Prasyarat**
   - Node.js & Watchman:
     ```sh
     brew install node
     brew install watchman
     ```
   - Android Studio: [Download](https://developer.android.com/studio), install SDK & emulator.
   - JDK:
     ```sh
     brew install openjdk@17
     ```

2. **Install React Native CLI**
   ```sh
   npm install -g react-native-cli
   ```

3. **Inisialisasi Project**
   ```sh
   npx react-native init examSchedulerStudent
   cd examSchedulerStudent
   ```

4. **Jalankan di Emulator/Device**
   - Buka Android Studio → Device Manager → Buat & jalankan emulator.
   - Jalankan app:
     ```sh
     npx react-native run-android
     ```

5. **Troubleshooting**
   - Jika error SDK, tambahkan ke ~/.zshrc:
     ```sh
     export ANDROID_HOME=$HOME/Library/Android/sdk
     export PATH=$PATH:$ANDROID_HOME/emulator
     export PATH=$PATH:$ANDROID_HOME/tools
     export PATH=$PATH:$ANDROID_HOME/tools/bin
     export PATH=$PATH:$ANDROID_HOME/platform-tools
     ```

6. **Siap untuk koding fitur mobile!**

> Lihat README ini untuk update selanjutnya terkait pengembangan aplikasi mobile mahasiswa berbasis React Native.

## 🔔 Notifikasi WhatsApp ke Mahasiswa

Aplikasi ini dapat diintegrasikan dengan WhatsApp untuk mengirim notifikasi otomatis ke mahasiswa (misal: jadwal ujian, reminder, perubahan jadwal, dsb).

### Opsi Integrasi WhatsApp
1. **WhatsApp Business Cloud API (Resmi dari Meta)**
   - Cocok untuk skala besar, legal, perlu verifikasi bisnis dan ada biaya per pesan.
2. **Gateway Pihak Ketiga**
   - Contoh: Wablas, Twilio, Qontak, Zenziva, dll.
   - Mudah setup, cocok untuk kebutuhan kampus/skala menengah.
3. **WhatsApp Web Automation**
   - Contoh: whatsapp-web.js (Node.js). Tidak direkomendasikan untuk production.

### Contoh Implementasi Sederhana (Wablas)
Tambahkan fungsi di backend (Node.js):

```js
const axios = require('axios');

async function sendWhatsAppMessage(phone, message) {
  await axios.post('https://console.wablas.com/api/send-message', {
    phone, // nomor HP mahasiswa, format 628xxxx
    message,
  }, {
    headers: {
      'Authorization': 'API_KEY_WABLAS_KAMU',
      'Content-Type': 'application/json'
    }
  });
}
```

Panggil fungsi ini di backend saat perlu notifikasi ke mahasiswa.

### Langkah Integrasi di Project
1. Pilih provider WhatsApp API (resmi/gateway).
2. Daftarkan nomor bisnis dan dapatkan API key.
3. Tambahkan fungsi di backend untuk kirim pesan.
4. Trigger fungsi ini saat event penting (jadwal, reminder, dsb).

> Pastikan mahasiswa sudah mendaftarkan nomor WhatsApp mereka di sistem.

---

**dibuat oleh 4h3 untuk memudahkan pengelolaan ujian mahasiswa** 