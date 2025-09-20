import React, { useEffect, useState } from 'react';
import {
  Settings,
  User,
  Building2,
  Bell,
  Shield,
  Database,
  Download,
  Upload,
  Save,
  Eye,
  EyeOff,
  AlertTriangle,
  Info,
} from 'lucide-react';
import type { CompanyProfile } from '../utils/pdfGenerator';

type BankAccount = {
  id: string;
  bankName: string;
  accountName: string;
  iban: string;
};

interface SettingsPageProps {
  user?: { name: string; email: string };
  company?: CompanyProfile;
  bankAccounts?: BankAccount[];
  onUserUpdate?: (user: any) => void;
  onCompanyUpdate?: (company: CompanyProfile) => void;
  onExportData?: () => void;
  onImportData?: (data: any) => void;
}

// Yalnızca ekranda önizleme için (CompanyProfile + logoFile)
type LocalCompanyState = CompanyProfile & { logoFile?: File | null };

export default function SettingsPage({
  user = { name: 'Demo User', email: 'demo@moneyflow.com' },
  company,
  bankAccounts = [],
  onUserUpdate,
  onCompanyUpdate,
  onExportData,
  onImportData,
}: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Profile
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: '+90 555 123 45 67',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Company (App’ten gelen company ile senkron)
  const [companyData, setCompanyData] = useState<LocalCompanyState>(() => ({
    name: company?.name ?? 'MoneyFlow Muhasebe',
    address: company?.address ?? 'İstanbul, Türkiye',
    taxNumber: company?.taxNumber ?? '1234567890',
    taxOffice: company?.taxOffice ?? '',
    phone: company?.phone ?? '+90 212 123 45 67',
    email: company?.email ?? 'info@moneyflow.com',
    website: company?.website ?? 'www.moneyflow.com',
    logoDataUrl: company?.logoDataUrl ?? '',
    iban: company?.iban ?? '',
    bankAccountId: company?.bankAccountId ?? undefined,
    bankName: company?.bankName ?? undefined,
    bankAccountName: company?.bankAccountName ?? undefined,
    manualBankName: company?.manualBankName ?? '',
    logoFile: null,
  }));

  // Props.company değişirse formu güncelle
  useEffect(() => {
    setCompanyData(prev => ({
      ...prev,
      name: company?.name ?? prev.name,
      address: company?.address ?? prev.address,
      taxNumber: company?.taxNumber ?? prev.taxNumber,
      taxOffice: company?.taxOffice ?? prev.taxOffice,
      phone: company?.phone ?? prev.phone,
      email: company?.email ?? prev.email,
      website: company?.website ?? prev.website,
      logoDataUrl: company?.logoDataUrl ?? prev.logoDataUrl,
      iban: company?.iban ?? prev.iban,
      bankAccountId: company?.bankAccountId ?? prev.bankAccountId,
      bankName: company?.bankName ?? prev.bankName,
      bankAccountName: company?.bankAccountName ?? prev.bankAccountName,
      manualBankName: company?.manualBankName ?? prev.manualBankName,
    }));
    setUnsavedChanges(false);
  }, [company]);

  const formatIban = (v?: string) =>
    (v || '').replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim();

  // Notifications
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    invoiceReminders: true,
    expenseAlerts: true,
    paymentNotifications: true,
    weeklyReports: false,
    monthlyReports: true,
  });

  // System
  const [systemSettings, setSystemSettings] = useState({
    language: 'tr',
    currency: 'TRY',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Europe/Istanbul',
    theme: 'light',
    autoBackup: true,
    backupFrequency: 'daily',
  });

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'company', label: 'Şirket', icon: Building2 },
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
    { id: 'system', label: 'Sistem', icon: Settings },
    { id: 'security', label: 'Güvenlik', icon: Shield },
    { id: 'data', label: 'Veri Yönetimi', icon: Database },
  ];

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const handleCompanyChange = (field: keyof LocalCompanyState, value: string) => {
    setCompanyData(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Lütfen sadece resim dosyası seçin.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Dosya boyutu 5MB'dan küçük olmalıdır.");
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      setCompanyData(prev => ({
        ...prev,
        logoDataUrl: e.target?.result as string,
        logoFile: file,
      }));
      setUnsavedChanges(true);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setCompanyData(prev => ({ ...prev, logoDataUrl: '', logoFile: null }));
    setUnsavedChanges(true);
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const handleSystemChange = (field: string, value: string | boolean) => {
    setSystemSettings(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const handleSave = () => {
    if (onUserUpdate) onUserUpdate(profileData);

    if (onCompanyUpdate) {
      // Banka seçimine göre adları ayarla
      const selected = bankAccounts.find(b => b.id === companyData.bankAccountId);
      const cleaned: CompanyProfile = {
        ...companyData,
        logoFile: undefined, // dışarı göndermeyelim
        iban: (companyData.iban ?? '').replace(/\s+/g, ''),
        bankName: companyData.bankAccountId ? selected?.bankName : (companyData.manualBankName || undefined),
        bankAccountName: companyData.bankAccountId ? selected?.accountName : undefined,
      };
      onCompanyUpdate(cleaned);
    }

    setUnsavedChanges(false);
    alert('Ayarlar başarıyla kaydedildi!');
  };

  const handleExport = () => {
    if (onExportData) {
      onExportData();
      return;
    }
    const data = {
      profile: profileData,
      company: companyData,
      notifications: notificationSettings,
      system: systemSettings,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moneyflow-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Kişisel Bilgiler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
            <input
              type="text"
              value={profileData.name}
              onChange={e => handleProfileChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
            <input
              type="email"
              value={profileData.email}
              onChange={e => handleProfileChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={e => handleProfileChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Şifre Değiştir</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mevcut Şifre</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={profileData.currentPassword}
                onChange={e => handleProfileChange('currentPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={profileData.newPassword}
              onChange={e => handleProfileChange('newPassword', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Şifre Tekrar</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={profileData.confirmPassword}
              onChange={e => handleProfileChange('confirmPassword', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompanyTab = () => {
    const hasBanks = bankAccounts.length > 0;
    const selectedBank = bankAccounts.find(b => b.id === companyData.bankAccountId);

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Şirket Bilgileri</h3>

          {/* Logo */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Şirket Logosu</label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                {companyData.logoDataUrl ? (
                  <img
                    src={companyData.logoDataUrl}
                    alt="Şirket Logosu"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-gray-400" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Logo Yükle
                    </span>
                  </label>

                  {companyData.logoDataUrl && (
                    <button
                      onClick={handleRemoveLogo}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Kaldır
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG veya GIF formatında, maksimum 5MB boyutunda dosya yükleyebilirsiniz.
                </p>
                {companyData.logoFile && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ {companyData.logoFile.name} ({(companyData.logoFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Temel alanlar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Şirket Adı</label>
              <input
                type="text"
                value={companyData.name ?? ''}
                onChange={e => handleCompanyChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* IBAN Kaynağı */}
            <div className="md:col-span-2 mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Faturalarda Kullanılacak IBAN</label>

              {/* 1) Kayıtlı bankalardan seç */}
              <div className="p-3 border border-gray-200 rounded-lg mb-3">
                <div className="flex items-center mb-3">
                  <input
                    type="radio"
                    id="iban-source-bank"
                    name="iban-source"
                    className="mr-2"
                    disabled={!hasBanks}
                    checked={!!companyData.bankAccountId}
                    onChange={() => {
                      if (!hasBanks) return;
                      const first = selectedBank ?? bankAccounts[0];
                      setCompanyData(prev => ({
                        ...prev,
                        bankAccountId: first.id,
                        iban: first.iban,
                        bankName: first.bankName,
                        bankAccountName: first.accountName,
                      }));
                      setUnsavedChanges(true);
                    }}
                  />
                  <label htmlFor="iban-source-bank" className="font-medium text-gray-900">
                    Kayıtlı bankalardan seç
                  </label>
                  {!hasBanks && (
                    <span className="ml-2 text-xs text-gray-500">(Kayıtlı banka yok)</span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <select
                    disabled={!companyData.bankAccountId}
                    value={companyData.bankAccountId ?? ''}
                    onChange={e => {
                      const sel = bankAccounts.find(b => b.id === e.target.value);
                      setCompanyData(prev => ({
                        ...prev,
                        bankAccountId: sel?.id,
                        iban: sel?.iban ?? '',
                        bankName: sel?.bankName,
                        bankAccountName: sel?.accountName,
                      }));
                      setUnsavedChanges(true);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {!companyData.bankAccountId && <option value="">Banka seçin</option>}
                    {bankAccounts.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.bankName} — {b.accountName}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    readOnly
                    disabled={!companyData.bankAccountId}
                    value={formatIban(companyData.iban)}
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    placeholder="TR.. .. .."
                  />
                </div>
              </div>

              {/* 2) Elle IBAN gir */}
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-3">
                  <input
                    type="radio"
                    id="iban-source-manual"
                    name="iban-source"
                    className="mr-2"
                    checked={!companyData.bankAccountId}
                    onChange={() => {
                      setCompanyData(prev => ({
                        ...prev,
                        bankAccountId: undefined,
                        bankName: undefined,
                        bankAccountName: undefined,
                      }));
                      setUnsavedChanges(true);
                    }}
                  />
                  <label htmlFor="iban-source-manual" className="font-medium text-gray-900">
                    Elle IBAN gir
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    disabled={!!companyData.bankAccountId}
                    value={companyData.bankAccountId ? '' : (companyData.iban ?? '')}
                    onChange={e => {
                      setCompanyData(prev => ({ ...prev, iban: e.target.value }));
                      setUnsavedChanges(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="TR00 0000 0000 0000 0000 0000 00"
                  />
                  <input
                    type="text"
                    disabled={!!companyData.bankAccountId}
                    value={companyData.bankAccountId ? '' : (companyData.manualBankName ?? '')}
                    onChange={e => {
                      setCompanyData(prev => ({ ...prev, manualBankName: e.target.value }));
                      setUnsavedChanges(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Banka adı (ör. Ziraat Bankası)"
                  />
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {companyData.iban
                    ? `Önizleme: ${formatIban(companyData.iban)}`
                    : 'Örn: TRxx xxxx xxxx xxxx xxxx xxxx xx'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vergi Numarası</label>
              <input
                type="text"
                value={companyData.taxNumber ?? ''}
                onChange={e => handleCompanyChange('taxNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
              <input
                type="tel"
                value={companyData.phone ?? ''}
                onChange={e => handleCompanyChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
              <input
                type="email"
                value={companyData.email ?? ''}
                onChange={e => handleCompanyChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                type="url"
                value={companyData.website ?? ''}
                onChange={e => handleCompanyChange('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
            <textarea
              value={companyData.address ?? ''}
              onChange={e => handleCompanyChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bildirim Tercihleri</h3>
        <div className="space-y-4">
          {Object.entries(notificationSettings).map(([key, value]) => {
            const labels = {
              emailNotifications: 'E-posta Bildirimleri',
              invoiceReminders: 'Fatura Hatırlatmaları',
              expenseAlerts: 'Gider Uyarıları',
              paymentNotifications: 'Ödeme Bildirimleri',
              weeklyReports: 'Haftalık Raporlar',
              monthlyReports: 'Aylık Raporlar',
            } as const;

            return (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{labels[key as keyof typeof labels]}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={e => handleNotificationChange(key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistem Ayarları</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dil</label>
            <select
              value={systemSettings.language}
              onChange={e => handleSystemChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Para Birimi</label>
            <select
              value={systemSettings.currency}
              onChange={e => handleSystemChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="TRY">₺ Türk Lirası</option>
              <option value="USD">$ Amerikan Doları</option>
              <option value="EUR">€ Euro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tarih Formatı</label>
            <select
              value={systemSettings.dateFormat}
              onChange={e => handleSystemChange('dateFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Saat Dilimi</label>
            <select
              value={systemSettings.timezone}
              onChange={e => handleSystemChange('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Europe/Istanbul">İstanbul</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">New York</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Yedekleme</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Otomatik Yedekleme</div>
              <div className="text-sm text-gray-500">Verilerinizi otomatik olarak yedekle</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={systemSettings.autoBackup}
                onChange={e => handleSystemChange('autoBackup', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {systemSettings.autoBackup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Yedekleme Sıklığı</label>
              <select
                value={systemSettings.backupFrequency}
                onChange={e => handleSystemChange('backupFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Günlük</option>
                <option value="weekly">Haftalık</option>
                <option value="monthly">Aylık</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">Güvenlik Önerileri</h4>
            <ul className="text-sm text-yellow-700 mt-2 space-y-1">
              <li>• Güçlü bir şifre kullanın (en az 8 karakter, büyük/küçük harf, sayı)</li>
              <li>• Şifrenizi düzenli olarak değiştirin</li>
              <li>• İki faktörlü kimlik doğrulamayı etkinleştirin</li>
              <li>• Şüpheli aktiviteleri takip edin</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Güvenlik Ayarları</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">İki Faktörlü Kimlik Doğrulama</div>
              <div className="text-sm text-gray-500">Hesabınız için ek güvenlik katmanı</div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Etkinleştir
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Oturum Geçmişi</div>
              <div className="text-sm text-gray-500">Son giriş aktivitelerinizi görüntüleyin</div>
            </div>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Görüntüle
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Aktif Oturumlar</div>
              <div className="text-sm text-gray-500">Diğer cihazlardaki oturumları yönetin</div>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Tümünü Sonlandır
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Veri İçe/Dışa Aktarma</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Download className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-medium text-gray-900">Veri Dışa Aktarma</h4>
                <p className="text-sm text-gray-500">Tüm verilerinizi JSON formatında indirin</p>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Verileri Dışa Aktar
            </button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Upload className="w-6 h-6 text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-900">Veri İçe Aktarma</h4>
                <p className="text-sm text-gray-500">JSON dosyasından veri yükleyin</p>
              </div>
            </div>
            <input
              type="file"
              accept=".json"
              onChange={e => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = event => {
                  try {
                    const data = JSON.parse(event.target?.result as string);
                    if (onImportData) onImportData(data);
                    alert('Veriler başarıyla içe aktarıldı!');
                  } catch {
                    alert('Dosya formatı hatalı!');
                  }
                };
                reader.readAsText(file);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-800">Tehlikeli Bölge</h4>
            <p className="text-sm text-red-700 mt-1">Bu işlemler geri alınamaz. Lütfen dikkatli olun.</p>
            <div className="mt-4 space-y-2">
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Tüm Verileri Sil
              </button>
              <button className="ml-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Hesabı Kapat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Settings className="w-8 h-8 text-blue-600 mr-3" />
              Ayarlar
            </h1>
            <p className="text-gray-600">Sistem ve hesap ayarlarınızı yönetin</p>
          </div>
          {unsavedChanges && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-orange-600">
                <Info className="w-4 h-4" />
                <span className="text-sm">Kaydedilmemiş değişiklikler var</span>
              </div>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Kaydet</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200">
            <nav className="p-4 space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Body */}
          <div className="flex-1 p-6">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'company' && renderCompanyTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'system' && renderSystemTab()}
            {activeTab === 'security' && renderSecurityTab()}
            {activeTab === 'data' && renderDataTab()}
          </div>
        </div>
      </div>
    </div>
  );
}
