# 🚀 Setup Guide - Aplikasi Nomor Ujian Mahasiswa

Panduan lengkap untuk setup dan menjalankan aplikasi nomor ujian mahasiswa.

## 📋 Prerequisites

Sebelum memulai, pastikan sistem Anda memiliki:

### 1. Node.js & npm
**Versi yang dibutuhkan**: Node.js 18+ dan npm 8+

#### Install Node.js di macOS:
```bash
# Menggunakan Homebrew (recommended)
brew install node

# Atau download dari official website
# https://nodejs.org/en/download/
```

#### Install Node.js di Ubuntu/Debian:
```bash
# Menggunakan NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verifikasi instalasi
node --version
npm --version
```

#### Install Node.js di Windows:
1. Download dari https://nodejs.org/
2. Run installer dan follow wizard
3. Restart terminal/command prompt

### 2. PostgreSQL
**Versi yang dibutuhkan**: PostgreSQL 12+

#### Install PostgreSQL di macOS:
```bash
# Menggunakan Homebrew
brew install postgresql
brew services start postgresql

# Atau menggunakan Postgres.app
# https://postgresapp.com/
```

#### Install PostgreSQL di Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Install PostgreSQL di Windows:
1. Download dari https://www.postgresql.org/download/windows/
2. Run installer dan follow wizard
3. Set password untuk user postgres

### 3. Git (Optional)
```bash
# macOS
brew install git

# Ubuntu/Debian
sudo apt install git

# Windows
# Download dari https://git-scm.com/
```

## 🚀 Installation Steps

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd myproject
```

### Step 2: Database Setup

#### a. Buat Database PostgreSQL
```bash
# Login ke PostgreSQL
sudo -u postgres psql

# Buat database dan user
CREATE DATABASE ujian_mahasiswa;
CREATE USER ujian_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE ujian_mahasiswa TO ujian_user;
\q
```

#### b. Konfigurasi Environment Variables
```bash
# Backend
cd backend
cp env.example .env

# Edit file .env dengan konfigurasi database Anda
nano .env
```

**Contoh konfigurasi .env:**
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ujian_mahasiswa
DB_USER=root
DB_PASSWORD=bismillah

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

### Step 3: Install Dependencies

#### Backend Dependencies
```bash
cd backend
npm install
```

#### Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 4: Database Migration & Seeding

```bash
cd backend

# Run migrations
node backend/migrations/run-migrations.js

# Seed sample data (optional)
npm run seed
```

### Step 5: Start Development Servers

#### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```

**Expected output:**
```
Server running on port 3001
Database connected successfully
```

#### Terminal 2 - Frontend Server
```bash
cd frontend
npm run dev
```

**Expected output:**
```
  VITE v4.5.0  ready in 300 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## 🌐 Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **API Documentation**: http://localhost:3001/api/docs (akan diimplementasi)

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests (akan diimplementasi)
```bash
cd frontend
npm test
```

## 📁 Project Structure

```
myproject/
├── backend/              # Node.js/Express Backend
│   ├── src/
│   │   ├── config/       # Database & app config
│   │   ├── controllers/  # API controllers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── index.ts      # Server entry point
│   ├── migrations/       # Database migrations
│   ├── tests/           # Unit tests
│   └── package.json
├── frontend/             # React/TypeScript Frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript types
│   │   ├── App.tsx       # Main app component
│   │   └── main.tsx      # Entry point
│   ├── public/           # Static assets
│   └── package.json
├── README.md
└── SETUP_GUIDE.md
```

## 🔧 Development Commands

### Backend Commands
```bash
cd backend

# Development
npm run dev          # Start dev server with hot reload
npm run build        # Build TypeScript
npm start            # Start production server

# Database
npm run migrate      # Run migrations
npm run seed         # Seed sample data

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

### Frontend Commands
```bash
cd frontend

# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
npm run type-check   # TypeScript type checking
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Node.js not found
```bash
# Install Node.js first
# macOS: brew install node
# Ubuntu: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
# Windows: Download from https://nodejs.org/
```

#### 2. PostgreSQL connection failed
```bash
# Check if PostgreSQL is running
# macOS: brew services list | grep postgresql
# Ubuntu: sudo systemctl status postgresql
# Windows: Check Services app

# Check connection
psql -h localhost -U ujian_user -d ujian_mahasiswa
```

#### 3. Port already in use
```bash
# Check what's using the port
lsof -i :3000  # Frontend
lsof -i :3001  # Backend

# Kill process if needed
kill -9 <PID>
```

#### 4. Permission denied
```bash
# Fix npm permissions
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

#### 5. Dependencies installation failed
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Issues

#### Reset Database
```bash
# Drop and recreate database
sudo -u postgres psql
DROP DATABASE ujian_mahasiswa;
CREATE DATABASE ujian_mahasiswa;
GRANT ALL PRIVILEGES ON DATABASE ujian_mahasiswa TO ujian_user;
\q

# Run migrations again
cd backend
npm run migrate
npm run seed
```

#### Check Database Connection
```bash
# Test connection
psql -h localhost -U ujian_user -d ujian_mahasiswa -c "SELECT version();"
```

## 🔒 Security Considerations

### Production Setup
1. **Environment Variables**: Never commit .env files
2. **Database**: Use strong passwords and SSL connections
3. **JWT Secret**: Use cryptographically secure random strings
4. **CORS**: Configure properly for production domains
5. **Rate Limiting**: Adjust based on expected traffic

### Environment Variables Template
```env
# Production .env example
NODE_ENV=production
DB_HOST=your_production_db_host
DB_PORT=5432
DB_NAME=ujian_mahasiswa
DB_USER=your_db_user
DB_PASSWORD=your_very_secure_password
JWT_SECRET=your_very_secure_jwt_secret_key
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📚 Additional Resources

### Documentation
- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
- [API Documentation](README.md#api-documentation)

### Useful Commands
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check PostgreSQL version
psql --version

# Check if services are running
brew services list  # macOS
systemctl status postgresql  # Linux
```

## 🆘 Getting Help

Jika mengalami masalah:

1. **Check logs** dari server (backend/frontend)
2. **Verify prerequisites** (Node.js, PostgreSQL)
3. **Check environment variables** configuration
4. **Review troubleshooting** section di atas
5. **Create issue** di repository dengan detail error

## 🎯 Next Steps

Setelah setup berhasil:

1. **Explore the application** di http://localhost:3000
2. **Test API endpoints** menggunakan Postman atau curl
3. **Review code structure** dan documentation
4. **Start implementing** additional features
5. **Set up testing** environment

---

**Happy Coding! 🚀** 