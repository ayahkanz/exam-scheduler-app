# 🚀 Next Steps - Development Guide

Setelah setup aplikasi berhasil, berikut adalah langkah-langkah untuk melanjutkan pengembangan.

## 📋 Immediate Actions (Setelah Setup)

### 1. Verify Installation
```bash
# Check if everything is working
curl http://localhost:3001/api/health
curl http://localhost:3000

# Check database connection
psql -h localhost -U ujian_user -d ujian_mahasiswa -c "SELECT COUNT(*) FROM ruang;"
```

### 2. Explore Current Features
- **Dashboard**: http://localhost:3000
- **API Endpoints**: http://localhost:3001/api
- **Database**: Check sample data yang sudah di-seed

### 3. Test API Endpoints
```bash
# Test room endpoints
curl http://localhost:3001/api/ruang
curl http://localhost:3001/api/ruang/statistics

# Test course endpoints
curl http://localhost:3001/api/matakuliah

# Test allocation endpoints
curl -X POST http://localhost:3001/api/allocation/auto \
  -H "Content-Type: application/json" \
  -d '{
    "tanggal": "2024-01-15",
    "waktu_mulai": "08:00",
    "waktu_selesai": "10:00",
    "matakuliah_ids": [1, 2, 3]
  }'
```

## 🎯 Development Priorities

### Phase 1: Core Features (Week 1-2)

#### 1. Implement Rooms Management Page
**File**: `frontend/src/pages/Rooms.tsx`

**Features to implement:**
- [ ] Data table dengan CRUD operations
- [ ] Add/Edit room modal
- [ ] Delete confirmation
- [ ] Search dan filtering
- [ ] Bulk import dari CSV/Excel

**Components needed:**
```typescript
// New components to create
- RoomTable.tsx
- RoomForm.tsx
- RoomModal.tsx
- ImportModal.tsx
- SearchFilter.tsx
```

#### 2. Implement Courses Management Page
**File**: `frontend/src/pages/Courses.tsx`

**Features to implement:**
- [ ] Data table dengan CRUD operations
- [ ] Add/Edit course modal
- [ ] CSV/Excel import functionality
- [ ] Course status management
- [ ] Participant count validation

**Components needed:**
```typescript
// New components to create
- CourseTable.tsx
- CourseForm.tsx
- CourseModal.tsx
- ImportModal.tsx
- StatusBadge.tsx
```

#### 3. Implement Allocation Page
**File**: `frontend/src/pages/Allocation.tsx`

**Features to implement:**
- [ ] Date/time picker
- [ ] Course selection (multi-select)
- [ ] Real-time allocation preview
- [ ] Conflict detection display
- [ ] Manual adjustment interface
- [ ] Save/confirm allocation

**Components needed:**
```typescript
// New components to create
- AllocationForm.tsx
- CourseSelector.tsx
- AllocationPreview.tsx
- ConflictList.tsx
- ManualAdjustment.tsx
```

### Phase 2: Advanced Features (Week 3-4)

#### 1. Reports & Analytics
**File**: `frontend/src/pages/Reports.tsx`

**Features to implement:**
- [ ] Allocation reports dengan filters
- [ ] Room utilization charts
- [ ] Export functionality (PDF/Excel)
- [ ] Seating charts generation
- [ ] Statistics dashboard

#### 2. Charts & Visualizations
**Components to enhance:**
- [ ] `RoomUtilizationChart.tsx` - Implement dengan Recharts
- [ ] `RecentAllocations.tsx` - Real data dengan pagination
- [ ] New charts: Allocation trends, Room capacity usage

#### 3. Export Functionality
**Features to implement:**
- [ ] PDF generation dengan jsPDF
- [ ] Excel export dengan XLSX
- [ ] Seating chart generation
- [ ] Report templates

### Phase 3: Polish & Optimization (Week 5-6)

#### 1. User Experience
- [ ] Loading states dan error handling
- [ ] Form validation dengan React Hook Form
- [ ] Toast notifications untuk feedback
- [ ] Responsive design improvements
- [ ] Accessibility improvements

#### 2. Performance Optimization
- [ ] Code splitting dengan React.lazy()
- [ ] Memoization untuk expensive operations
- [ ] Optimistic updates
- [ ] Caching strategies

#### 3. Testing
- [ ] Unit tests dengan Vitest
- [ ] Component tests dengan React Testing Library
- [ ] E2E tests dengan Playwright
- [ ] API mocking untuk tests

## 🛠️ Development Workflow

### 1. Feature Development Process
```bash
# 1. Create feature branch
git checkout -b feature/rooms-management

# 2. Implement feature
# - Create components
# - Add API integration
# - Add tests
# - Update documentation

# 3. Test locally
npm run dev
npm test

# 4. Commit changes
git add .
git commit -m "feat: implement rooms management page"

# 5. Create pull request
git push origin feature/rooms-management
```

### 2. Component Development Template
```typescript
// Component template
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';

interface ComponentProps {
  // Props interface
}

export default function ComponentName({ prop }: ComponentProps) {
  // State
  const [state, setState] = useState();
  const queryClient = useQueryClient();
  
  // Data fetching
  const { data, isLoading, error } = useQuery('key', fetchFunction);
  
  // Mutations
  const mutation = useMutation(apiFunction, {
    onSuccess: () => {
      queryClient.invalidateQueries('key');
      toast.success('Operation successful');
    },
    onError: (error) => {
      toast.error('Operation failed');
    },
  });
  
  // Event handlers
  const handleSubmit = (data: any) => {
    mutation.mutate(data);
  };
  
  // Loading state
  if (isLoading) return <div>Loading...</div>;
  
  // Error state
  if (error) return <div>Error: {error.message}</div>;
  
  // Render
  return (
    <div className="component-container">
      {/* JSX */}
    </div>
  );
}
```

### 3. API Integration Pattern
```typescript
// API service pattern
export const roomApi = {
  // GET requests
  getAll: () => api.get('/ruang'),
  getById: (id: number) => api.get(`/ruang/${id}`),
  
  // POST requests
  create: (data: RoomFormData) => api.post('/ruang', data),
  
  // PUT requests
  update: (id: number, data: Partial<RoomFormData>) => 
    api.put(`/ruang/${id}`, data),
  
  // DELETE requests
  delete: (id: number) => api.delete(`/ruang/${id}`),
};
```

## 📚 Learning Resources

### React & TypeScript
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Query Documentation](https://tanstack.com/query/latest)

### UI & Styling
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Headless UI Documentation](https://headlessui.com/)
- [Heroicons](https://heroicons.com/)

### Testing
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)

### Backend Integration
- [Axios Documentation](https://axios-http.com/)
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🔧 Development Tools

### Recommended VS Code Extensions
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### Useful Development Scripts
```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview build

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run type-check       # TypeScript checking

# Testing
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## 🎨 Design System Guidelines

### Color Usage
```css
/* Primary actions */
.btn-primary { @apply bg-primary-600 text-white; }

/* Secondary actions */
.btn-secondary { @apply bg-secondary-100 text-secondary-700; }

/* Success states */
.text-success { @apply text-success-600; }

/* Warning states */
.text-warning { @apply text-warning-600; }

/* Error states */
.text-danger { @apply text-danger-600; }
```

### Component Patterns
```typescript
// Form pattern
const [formData, setFormData] = useState(initialData);
const [errors, setErrors] = useState({});

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  try {
    await apiFunction(formData);
    toast.success('Success!');
  } catch (error) {
    setErrors(error.response?.data?.errors || {});
    toast.error('Error occurred');
  }
};

// Table pattern
const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
const [filters, setFilters] = useState({});

const sortedData = useMemo(() => {
  // Sorting logic
}, [data, sortConfig]);

const filteredData = useMemo(() => {
  // Filtering logic
}, [sortedData, filters]);
```

## 🚀 Deployment Preparation

### Environment Configuration
```env
# Production environment variables
NODE_ENV=production
VITE_API_URL=https://your-api-domain.com/api
VITE_APP_NAME=Aplikasi Nomor Ujian Mahasiswa
```

### Build Optimization
```bash
# Frontend build
npm run build

# Backend build
npm run build

# Docker setup (optional)
docker-compose up -d
```

## 📈 Success Metrics

### Development Goals
- [ ] **100% TypeScript coverage** untuk semua components
- [ ] **90% test coverage** untuk critical features
- [ ] **Lighthouse score > 90** untuk performance
- [ ] **Accessibility score > 95** untuk usability
- [ ] **Zero critical bugs** in production

### Feature Completion
- [ ] **Rooms Management**: CRUD + Import/Export
- [ ] **Courses Management**: CRUD + Bulk operations
- [ ] **Allocation System**: Auto + Manual adjustment
- [ ] **Reports**: Analytics + Export functionality
- [ ] **User Experience**: Responsive + Accessible

---

**Ready to build amazing features! 🚀** 