# Frontend - Aplikasi Nomor Ujian Mahasiswa

Frontend React dengan TypeScript untuk aplikasi manajemen alokasi ruang ujian mahasiswa.

## Teknologi yang Digunakan

- **React 18** - Library UI
- **TypeScript** - Type safety
- **Vite** - Build tool dan development server
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **React Query** - Data fetching dan caching
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Heroicons** - Icon library

## Fitur

### ✅ Sudah Diimplementasi
- [x] Layout responsif dengan sidebar navigation
- [x] Dashboard dengan statistik
- [x] Routing antar halaman
- [x] API service layer
- [x] TypeScript types
- [x] Tailwind CSS styling
- [x] Component structure

### 🚧 Dalam Pengembangan
- [ ] Halaman manajemen ruang ujian
- [ ] Halaman manajemen matakuliah
- [ ] Halaman alokasi otomatis
- [ ] Halaman laporan dan statistik
- [ ] Form input dan validasi
- [ ] Data table dengan sorting/filtering
- [ ] Chart dan visualisasi data
- [ ] Export PDF/Excel
- [ ] Upload CSV/Excel
- [ ] Authentication

## Instalasi

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Backend server berjalan di port 3001

### Setup
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build untuk production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

## Struktur Project

```
src/
├── components/          # Reusable components
│   ├── Layout.tsx      # Main layout dengan sidebar
│   ├── StatCard.tsx    # Dashboard statistik card
│   └── ...
├── pages/              # Page components
│   ├── Dashboard.tsx   # Dashboard utama
│   ├── Rooms.tsx       # Manajemen ruang
│   ├── Courses.tsx     # Manajemen matakuliah
│   ├── Allocation.tsx  # Alokasi ruang
│   ├── Reports.tsx     # Laporan
│   └── Settings.tsx    # Pengaturan
├── services/           # API services
│   └── api.ts         # Axios configuration & API calls
├── types/              # TypeScript type definitions
│   └── index.ts       # All application types
├── utils/              # Utility functions
├── App.tsx            # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## API Integration

Frontend terintegrasi dengan backend melalui:

- **Base URL**: `http://localhost:3001/api`
- **Proxy**: Vite proxy untuk development
- **Authentication**: Bearer token (akan diimplementasi)
- **Error Handling**: Global error interceptor

### Endpoints yang Digunakan

- `GET /api/ruang` - Daftar ruang
- `GET /api/ruang/statistics` - Statistik ruang
- `GET /api/matakuliah` - Daftar matakuliah
- `POST /api/allocation/auto` - Alokasi otomatis
- `GET /api/allocation/summary` - Ringkasan alokasi

## Styling

Menggunakan Tailwind CSS dengan custom design system:

### Colors
- **Primary**: Blue shades (600, 700, etc.)
- **Secondary**: Gray shades
- **Success**: Green shades
- **Warning**: Orange/Yellow shades
- **Danger**: Red shades

### Components
- `.btn` - Button base styles
- `.input` - Input field styles
- `.card` - Card container
- `.table` - Table styles
- `.badge` - Status badges

## Development Guidelines

### Code Style
- Gunakan TypeScript strict mode
- Prefer functional components dengan hooks
- Gunakan React Query untuk data fetching
- Implement proper error boundaries
- Write meaningful component names

### Component Structure
```tsx
// Component template
import { useState } from 'react';
import { useQuery } from 'react-query';

interface ComponentProps {
  // Props interface
}

export default function ComponentName({ prop }: ComponentProps) {
  // State and hooks
  const [state, setState] = useState();
  
  // Data fetching
  const { data, isLoading, error } = useQuery('key', fetchFunction);
  
  // Event handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // Render
  return (
    <div className="component-container">
      {/* JSX */}
    </div>
  );
}
```

### State Management
- **Local State**: useState untuk component state
- **Server State**: React Query untuk API data
- **Global State**: Context API jika diperlukan
- **Form State**: React Hook Form (akan diimplementasi)

## Deployment

### Build
```bash
npm run build
```

### Production
- Build files di `dist/` folder
- Serve dengan web server (nginx, Apache)
- Configure reverse proxy ke backend API

### Environment Variables
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Aplikasi Nomor Ujian
```

## Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

## Performance

### Optimization
- Code splitting dengan React.lazy()
- Image optimization
- Bundle analysis
- Caching strategies

### Monitoring
- Error tracking
- Performance metrics
- User analytics

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - lihat file LICENSE untuk detail.

## Support

Untuk bantuan dan pertanyaan:
- Buat issue di repository
- Hubungi tim development
- Dokumentasi lengkap di Wiki 