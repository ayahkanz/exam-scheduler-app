-- Seed data for ujian mahasiswa application
-- Created: 2024-01-01
-- Database: MySQL

-- Insert sample ruang (rooms) data
INSERT IGNORE INTO ruang (nama_ruang, kapasitas, lokasi, lantai, gedung, status) VALUES
-- Kelas Besar (55 orang)
('A101', 55, 'Gedung A', 1, 'Gedung A', 'aktif'),
('A102', 55, 'Gedung A', 1, 'Gedung A', 'aktif'),
('A201', 55, 'Gedung A', 2, 'Gedung A', 'aktif'),
('A202', 55, 'Gedung A', 2, 'Gedung A', 'aktif'),
('B101', 55, 'Gedung B', 1, 'Gedung B', 'aktif'),
('B102', 55, 'Gedung B', 1, 'Gedung B', 'aktif'),

-- Kelas Sedang (30 orang)
('A103', 30, 'Gedung A', 1, 'Gedung A', 'aktif'),
('A104', 30, 'Gedung A', 1, 'Gedung A', 'aktif'),
('A203', 30, 'Gedung A', 2, 'Gedung A', 'aktif'),
('A204', 30, 'Gedung A', 2, 'Gedung A', 'aktif'),
('B103', 30, 'Gedung B', 1, 'Gedung B', 'aktif'),
('B104', 30, 'Gedung B', 1, 'Gedung B', 'aktif'),

-- Kelas Kecil (25 orang)
('A105', 25, 'Gedung A', 1, 'Gedung A', 'aktif'),
('A106', 25, 'Gedung A', 1, 'Gedung A', 'aktif'),
('A205', 25, 'Gedung A', 2, 'Gedung A', 'aktif'),
('A206', 25, 'Gedung A', 2, 'Gedung A', 'aktif'),
('B105', 25, 'Gedung B', 1, 'Gedung B', 'aktif'),
('B106', 25, 'Gedung B', 1, 'Gedung B', 'aktif');

-- Insert sample matakuliah (courses) data
INSERT IGNORE INTO matakuliah (kode_mk, nama_mk, jumlah_peserta, dosen, semester, tahun_ajaran, status) VALUES
('MTK101', 'Matematika Dasar', 75, 'Dr. Ahmad Suryadi', 'Ganjil', '2024/2025', 'aktif'),
('FIS101', 'Fisika Dasar', 45, 'Dr. Budi Santoso', 'Ganjil', '2024/2025', 'aktif'),
('KIM101', 'Kimia Dasar', 28, 'Dr. Citra Dewi', 'Ganjil', '2024/2025', 'aktif'),
('BIO101', 'Biologi Dasar', 35, 'Dr. Dedi Kurniawan', 'Ganjil', '2024/2025', 'aktif'),
('ING101', 'Bahasa Inggris', 60, 'Dr. Eka Putri', 'Ganjil', '2024/2025', 'aktif'),
('IND101', 'Bahasa Indonesia', 22, 'Dr. Fajar Ramadhan', 'Ganjil', '2024/2025', 'aktif'),
('ALG101', 'Algoritma dan Pemrograman', 40, 'Dr. Gita Safitri', 'Ganjil', '2024/2025', 'aktif'),
('STA101', 'Statistika', 32, 'Dr. Hadi Prasetyo', 'Ganjil', '2024/2025', 'aktif');

-- Insert sample mahasiswa (students) data
INSERT IGNORE INTO mahasiswa (nim, nama, email, program_studi, angkatan) VALUES
('2024001', 'Ahmad Fauzi', 'ahmad.fauzi@email.com', 'Teknik Informatika', 2024),
('2024002', 'Budi Santoso', 'budi.santoso@email.com', 'Teknik Informatika', 2024),
('2024003', 'Citra Dewi', 'citra.dewi@email.com', 'Sistem Informasi', 2024),
('2024004', 'Dedi Kurniawan', 'dedi.kurniawan@email.com', 'Teknik Informatika', 2024),
('2024005', 'Eka Putri', 'eka.putri@email.com', 'Sistem Informasi', 2024),
('2024006', 'Fajar Ramadhan', 'fajar.ramadhan@email.com', 'Teknik Informatika', 2024),
('2024007', 'Gita Safitri', 'gita.safitri@email.com', 'Sistem Informasi', 2024),
('2024008', 'Hadi Prasetyo', 'hadi.prasetyo@email.com', 'Teknik Informatika', 2024),
('2024009', 'Indah Permata', 'indah.permata@email.com', 'Sistem Informasi', 2024),
('2024010', 'Joko Widodo', 'joko.widodo@email.com', 'Teknik Informatika', 2024); 