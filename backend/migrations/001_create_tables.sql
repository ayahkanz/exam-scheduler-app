-- Migration: Create database tables for ujian mahasiswa application
-- Created: 2024-01-01
-- Database: MySQL

-- Create ruang (rooms) table
CREATE TABLE IF NOT EXISTS ruang (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_ruang VARCHAR(50) NOT NULL UNIQUE,
    kapasitas INT NOT NULL CHECK (kapasitas > 0),
    lokasi VARCHAR(100),
    lantai INT,
    gedung VARCHAR(50),
    status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif', 'maintenance')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create matakuliah (courses) table
CREATE TABLE IF NOT EXISTS matakuliah (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_mk VARCHAR(20) NOT NULL UNIQUE,
    nama_mk VARCHAR(100) NOT NULL,
    jumlah_peserta INT NOT NULL CHECK (jumlah_peserta > 0),
    dosen VARCHAR(100),
    semester VARCHAR(10),
    tahun_ajaran VARCHAR(10),
    status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'selesai', 'dibatalkan')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create alokasi (allocations) table
CREATE TABLE IF NOT EXISTS alokasi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matakuliah_id INT NOT NULL,
    ruang_id INT NOT NULL,
    tanggal DATE NOT NULL,
    waktu_mulai TIME NOT NULL,
    waktu_selesai TIME NOT NULL,
    nomor_urut INT DEFAULT 1,
    jumlah_peserta_dialokasikan INT NOT NULL,
    status VARCHAR(20) DEFAULT 'direncanakan' CHECK (status IN ('direncanakan', 'berlangsung', 'selesai', 'dibatalkan')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (matakuliah_id) REFERENCES matakuliah(id) ON DELETE CASCADE,
    FOREIGN KEY (ruang_id) REFERENCES ruang(id) ON DELETE CASCADE,
    UNIQUE KEY unique_allocation (ruang_id, tanggal, waktu_mulai, waktu_selesai)
);

-- Create mahasiswa (students) table
CREATE TABLE IF NOT EXISTS mahasiswa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nim VARCHAR(20) NOT NULL UNIQUE,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    program_studi VARCHAR(50),
    angkatan INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create peserta_ujian (exam participants) table
CREATE TABLE IF NOT EXISTS peserta_ujian (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mahasiswa_id INT NOT NULL,
    matakuliah_id INT NOT NULL,
    alokasi_id INT NOT NULL,
    nomor_ujian VARCHAR(20) NOT NULL,
    nomor_kursi INT NOT NULL,
    status VARCHAR(20) DEFAULT 'terdaftar' CHECK (status IN ('terdaftar', 'hadir', 'tidak_hadir', 'dibatalkan')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa(id) ON DELETE CASCADE,
    FOREIGN KEY (matakuliah_id) REFERENCES matakuliah(id) ON DELETE CASCADE,
    FOREIGN KEY (alokasi_id) REFERENCES alokasi(id) ON DELETE CASCADE,
    UNIQUE KEY unique_mahasiswa_matakuliah (mahasiswa_id, matakuliah_id),
    UNIQUE KEY unique_alokasi_kursi (alokasi_id, nomor_kursi)
);

-- Create indexes for better performance
CREATE INDEX idx_ruang_kapasitas ON ruang(kapasitas);
CREATE INDEX idx_ruang_lokasi ON ruang(lokasi, lantai, gedung);
CREATE INDEX idx_matakuliah_peserta ON matakuliah(jumlah_peserta);
CREATE INDEX idx_alokasi_tanggal ON alokasi(tanggal);
CREATE INDEX idx_alokasi_ruang_tanggal ON alokasi(ruang_id, tanggal);
CREATE INDEX idx_peserta_ujian_nomor ON peserta_ujian(nomor_ujian);
CREATE INDEX idx_peserta_ujian_alokasi ON peserta_ujian(alokasi_id); 