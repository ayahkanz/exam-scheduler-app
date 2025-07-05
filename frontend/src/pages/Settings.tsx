import React, { useState } from 'react';
import { 
  CogIcon, 
  UserIcon, 
  ShieldCheckIcon, 
  BellIcon,
  DocumentTextIcon,
  ServerIcon,
  GlobeAltIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
}

const settingsSections: SettingsSection[] = [
  {
    id: 'general',
    title: 'Pengaturan Umum',
    icon: CogIcon,
    description: 'Konfigurasi dasar aplikasi'
  },
  {
    id: 'allocation',
    title: 'Pengaturan Alokasi',
    icon: ServerIcon,
    description: 'Parameter algoritma alokasi ruang'
  },
  {
    id: 'notifications',
    title: 'Notifikasi',
    icon: BellIcon,
    description: 'Pengaturan notifikasi dan alert'
  },
  {
    id: 'security',
    title: 'Keamanan',
    icon: ShieldCheckIcon,
    description: 'Pengaturan keamanan dan privasi'
  },
  {
    id: 'backup',
    title: 'Backup & Restore',
    icon: DocumentTextIcon,
    description: 'Manajemen backup data'
  }
];

interface GeneralSettings {
  appName: string;
  timezone: string;
  dateFormat: string;
  language: string;
  theme: 'light' | 'dark' | 'auto';
}

interface AllocationSettings {
  maxWastePercentage: number;
  preferSameBuilding: boolean;
  allowMultipleRooms: boolean;
  minRoomCapacity: number;
  maxAllocationTime: number;
}

interface NotificationSettings {
  emailNotifications: boolean;
  browserNotifications: boolean;
  allocationAlerts: boolean;
  conflictWarnings: boolean;
  dailyReports: boolean;
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState('general');
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    appName: 'Exam Scheduler App',
    timezone: 'Asia/Jakarta',
    dateFormat: 'DD/MM/YYYY',
    language: 'id',
    theme: 'light'
  });

  const [allocationSettings, setAllocationSettings] = useState<AllocationSettings>({
    maxWastePercentage: 20,
    preferSameBuilding: true,
    allowMultipleRooms: true,
    minRoomCapacity: 10,
    maxAllocationTime: 30
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    browserNotifications: true,
    allocationAlerts: true,
    conflictWarnings: true,
    dailyReports: false
  });

  const handleSaveGeneral = () => {
    // Placeholder for save functionality
    alert('Pengaturan umum berhasil disimpan');
  };

  const handleSaveAllocation = () => {
    // Placeholder for save functionality
    alert('Pengaturan alokasi berhasil disimpan');
  };

  const handleSaveNotifications = () => {
    // Placeholder for save functionality
    alert('Pengaturan notifikasi berhasil disimpan');
  };

  const handleBackup = () => {
    // Placeholder for backup functionality
    alert('Fitur backup akan segera tersedia');
  };

  const handleRestore = () => {
    // Placeholder for restore functionality
    alert('Fitur restore akan segera tersedia');
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Konfigurasi Aplikasi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Aplikasi
            </label>
            <input
              type="text"
              value={generalSettings.appName}
              onChange={(e) => setGeneralSettings({ ...generalSettings, appName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zona Waktu
            </label>
            <select
              value={generalSettings.timezone}
              onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
              <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
              <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Format Tanggal
            </label>
            <select
              value={generalSettings.dateFormat}
              onChange={(e) => setGeneralSettings({ ...generalSettings, dateFormat: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bahasa
            </label>
            <select
              value={generalSettings.language}
              onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tema
            </label>
            <select
              value={generalSettings.theme}
              onChange={(e) => setGeneralSettings({ ...generalSettings, theme: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Terang</option>
              <option value="dark">Gelap</option>
              <option value="auto">Otomatis</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveGeneral}
          className="btn btn-primary"
        >
          Simpan Pengaturan
        </button>
      </div>
    </div>
  );

  const renderAllocationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Parameter Alokasi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maksimal Waste Percentage (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={allocationSettings.maxWastePercentage}
              onChange={(e) => setAllocationSettings({ ...allocationSettings, maxWastePercentage: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Persentase maksimal kursi yang tidak terpakai</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kapasitas Minimum Ruang
            </label>
            <input
              type="number"
              min="1"
              value={allocationSettings.minRoomCapacity}
              onChange={(e) => setAllocationSettings({ ...allocationSettings, minRoomCapacity: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Kapasitas minimum ruang yang akan digunakan</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Waktu Maksimal Alokasi (detik)
            </label>
            <input
              type="number"
              min="1"
              value={allocationSettings.maxAllocationTime}
              onChange={(e) => setAllocationSettings({ ...allocationSettings, maxAllocationTime: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Waktu maksimal untuk proses alokasi</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="preferSameBuilding"
              checked={allocationSettings.preferSameBuilding}
              onChange={(e) => setAllocationSettings({ ...allocationSettings, preferSameBuilding: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="preferSameBuilding" className="ml-3 text-sm text-gray-700">
              Prioritaskan ruang dalam gedung yang sama
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="allowMultipleRooms"
              checked={allocationSettings.allowMultipleRooms}
              onChange={(e) => setAllocationSettings({ ...allocationSettings, allowMultipleRooms: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="allowMultipleRooms" className="ml-3 text-sm text-gray-700">
              Izinkan alokasi ke beberapa ruang
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveAllocation}
          className="btn btn-primary"
        >
          Simpan Pengaturan
        </button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Pengaturan Notifikasi</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Notifikasi Email</h4>
              <p className="text-sm text-gray-500">Kirim notifikasi melalui email</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.emailNotifications}
              onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Notifikasi Browser</h4>
              <p className="text-sm text-gray-500">Tampilkan notifikasi di browser</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.browserNotifications}
              onChange={(e) => setNotificationSettings({ ...notificationSettings, browserNotifications: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Alert Alokasi</h4>
              <p className="text-sm text-gray-500">Notifikasi ketika alokasi berhasil/gagal</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.allocationAlerts}
              onChange={(e) => setNotificationSettings({ ...notificationSettings, allocationAlerts: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Peringatan Konflik</h4>
              <p className="text-sm text-gray-500">Notifikasi ketika ada konflik alokasi</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.conflictWarnings}
              onChange={(e) => setNotificationSettings({ ...notificationSettings, conflictWarnings: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Laporan Harian</h4>
              <p className="text-sm text-gray-500">Kirim laporan harian via email</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.dailyReports}
              onChange={(e) => setNotificationSettings({ ...notificationSettings, dailyReports: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveNotifications}
          className="btn btn-primary"
        >
          Simpan Pengaturan
        </button>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Pengaturan Keamanan</h3>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Sesi Pengguna</h4>
            <p className="text-sm text-gray-500 mb-3">Kelola sesi pengguna yang sedang aktif</p>
            <button className="btn btn-secondary">
              Lihat Sesi Aktif
            </button>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Log Aktivitas</h4>
            <p className="text-sm text-gray-500 mb-3">Lihat log aktivitas sistem</p>
            <button className="btn btn-secondary">
              Lihat Log
            </button>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Ubah Password</h4>
            <p className="text-sm text-gray-500 mb-3">Ubah password akun Anda</p>
            <button className="btn btn-secondary">
              Ubah Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Backup & Restore</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg text-center">
            <ServerIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h4 className="font-medium text-gray-900 mb-2">Backup Data</h4>
            <p className="text-sm text-gray-500 mb-4">Buat backup data aplikasi</p>
            <button
              onClick={handleBackup}
              className="btn btn-primary w-full"
            >
              Buat Backup
            </button>
          </div>

          <div className="p-6 border rounded-lg text-center">
            <DocumentTextIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h4 className="font-medium text-gray-900 mb-2">Restore Data</h4>
            <p className="text-sm text-gray-500 mb-4">Pulihkan data dari backup</p>
            <button
              onClick={handleRestore}
              className="btn btn-secondary w-full"
            >
              Restore Data
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <ShieldCheckIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Peringatan
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Backup dan restore akan mempengaruhi seluruh data aplikasi. 
                  Pastikan Anda telah membuat backup sebelum melakukan restore.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'allocation':
        return renderAllocationSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'backup':
        return renderBackupSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
        <p className="mt-1 text-sm text-gray-500">
          Konfigurasi aplikasi dan preferensi sistem
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div>{section.title}</div>
                    <div className="text-xs text-gray-500">{section.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            <div className="card-body">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 