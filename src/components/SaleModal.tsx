import React, { useState } from 'react';
import { X, TrendingUp, User, Package, DollarSign, Calendar, CreditCard, Search, Check } from 'lucide-react';

interface Sale {
  id: string;
  saleNumber: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  status: 'completed' | 'pending' | 'cancelled';
  saleDate: string;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'check';
  notes?: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxNumber: string;
  company: string;
  createdAt: string;
}

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sale: Sale) => void;
  sale?: Sale | null;
  customers?: Customer[];
}

export default function SaleModal({ isOpen, onClose, onSave, sale, customers = [] }: SaleModalProps) {
  const [saleData, setSaleData] = useState({
    saleNumber: sale?.saleNumber || `SAL-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
    customerName: sale?.customerName || '',
    customerEmail: sale?.customerEmail || '',
    productName: sale?.productName || '',
    quantity: sale?.quantity || 1,
    unitPrice: sale?.unitPrice || 0,
    status: sale?.status || 'completed',
    saleDate: sale?.saleDate || new Date().toISOString().split('T')[0],
    paymentMethod: sale?.paymentMethod || 'cash',
    notes: sale?.notes || ''
  });

  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [createInvoice, setCreateInvoice] = useState(false);

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen && !sale) {
      // New sale - reset form
      setSaleData({
        saleNumber: `SAL-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
        customerName: '',
        customerEmail: '',
        productName: '',
        quantity: 1,
        unitPrice: 0,
        status: 'completed',
        saleDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash',
        notes: ''
      });
      setCustomerSearch('');
      setSelectedCustomer(null);
      setShowCustomerDropdown(false);
      setErrors({});
      setCreateInvoice(false);
    } else if (isOpen && sale) {
      // Editing existing sale - load data
      setSaleData({
        saleNumber: sale.saleNumber || `SAL-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
        customerName: sale.customerName,
        customerEmail: sale.customerEmail || '',
        productName: sale.productName,
        quantity: sale.quantity || 1,
        unitPrice: sale.unitPrice || 0,
        status: sale.status,
        saleDate: sale.date || sale.saleDate,
        paymentMethod: sale.paymentMethod,
        notes: sale.notes || ''
      });
      setCustomerSearch(sale.customerName);
      setSelectedCustomer(null);
      setShowCustomerDropdown(false);
      setErrors({});
      setCreateInvoice(false);
    }
  }, [isOpen, sale]);

  const total = saleData.quantity * saleData.unitPrice;

  // Ensure total is always a valid number
  const safeTotal = isNaN(total) ? 0 : total;
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    (customer.company || '').toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.email.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setSaleData({
      ...saleData,
      customerName: customer.name,
      customerEmail: customer.email
    });
    setCustomerSearch(customer.name);
    setShowCustomerDropdown(false);
    // Clear customer error when selecting
    if (errors.customerName) {
      setErrors({...errors, customerName: ''});
    }
  };

  const handleCustomerSearchChange = (value: string) => {
    setCustomerSearch(value);
    setSaleData({
      ...saleData,
      customerName: value
    });
    setShowCustomerDropdown(value.length > 0);
    setSelectedCustomer(null);
    
    // Clear customer name error when typing
    if (errors.customerName) {
      setErrors({...errors, customerName: ''});
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!saleData.customerName.trim()) {
      newErrors.customerName = 'Müşteri adı gereklidir';
    } else {
      // Check if customer exists in the system
      const customerExists = customers.some(customer => 
        customer.name.toLowerCase() === saleData.customerName.toLowerCase()
      );
      if (!customerExists) {
        newErrors.customerName = 'Müşteri sistemde bulunamadı. Lütfen listeden seçin.';
      }
    }
    
    if (!saleData.productName.trim()) {
      newErrors.productName = 'Ürün/hizmet adı gereklidir';
    }
    
    if (!saleData.saleDate) {
      newErrors.saleDate = 'Satış tarihi gereklidir';
    }
    
    if (saleData.unitPrice <= 0) {
      newErrors.unitPrice = 'Birim fiyat 0\'dan büyük olmalıdır';
    }
    
    if (saleData.quantity <= 0) {
      newErrors.quantity = 'Miktar 0\'dan büyük olmalıdır';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    const saleToSave: Sale = {
      id: sale?.id || Date.now().toString(),
      ...saleData,
      date: saleData.saleDate, // Map saleDate to date for consistency
      amount: safeTotal,
      total: safeTotal,  // compatibility
      createInvoice, // Include the invoice creation flag
      createdAt: sale?.createdAt || new Date().toISOString()
    } as any;
    
    onSave(saleToSave);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {sale ? 'Satışı Düzenle' : 'Yeni Satış Ekle'}
              </h2>
              <p className="text-sm text-gray-500">Satış bilgilerini girin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Satış Numarası
              </label>
              <input
                type="text"
                value={saleData.saleNumber}
                onChange={(e) => setSaleData({...saleData, saleNumber: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Satış Tarihi *
              </label>
              <input
                type="date"
                value={saleData.saleDate}
                onChange={(e) => setSaleData({...saleData, saleDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.saleDate && (
                <p className="text-red-500 text-xs mt-1">{errors.saleDate}</p>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Müşteri Adı *
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => handleCustomerSearchChange(e.target.value)}
                  onFocus={() => {
                    setShowCustomerDropdown(true);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Müşteri ara veya yeni müşteri adı girin..."
                />
                {selectedCustomer && (
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                )}
              </div>
              
              {errors.customerName && (
                <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
              )}
              
              {/* Customer Dropdown */}
              {showCustomerDropdown && filteredCustomers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  <div className="p-2 text-xs text-gray-500 border-b">
                    {filteredCustomers.length} müşteri bulundu
                  </div>
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => handleCustomerSelect(customer)}
                      className="p-3 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-600">{customer.company}</div>
                      <div className="text-xs text-gray-500">{customer.email}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-posta
              </label>
              <input
                type="email"
                value={saleData.customerEmail}
                onChange={(e) => setSaleData({...saleData, customerEmail: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="ahmet@example.com"
              />
              {errors.customerEmail && (
                <p className="text-red-500 text-xs mt-1">{errors.customerEmail}</p>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package className="w-4 h-4 inline mr-2" />
              Ürün/Hizmet Adı *
            </label>
            <input
              type="text"
              value={saleData.productName}
              onChange={(e) => setSaleData({...saleData, productName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Web Tasarım Hizmeti"
            />
            {errors.productName && (
              <p className="text-red-500 text-xs mt-1">{errors.productName}</p>
            )}
          </div>

          {/* Quantity and Price */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Miktar *
              </label>
              <input
                type="number"
                value={saleData.quantity}
                onChange={(e) => setSaleData({...saleData, quantity: parseInt(e.target.value) || 1})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                min="1"
              />
              {errors.quantity && (
                <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Birim Fiyat (₺) *
              </label>
              <input
                type="number"
                value={saleData.unitPrice}
                onChange={(e) => setSaleData({...saleData, unitPrice: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.unitPrice && (
                <p className="text-red-500 text-xs mt-1">{errors.unitPrice}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Toplam
              </label>
              <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium">
                ₺{safeTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Status and Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durum
              </label>
              <select
                value={saleData.status}
                onChange={(e) => setSaleData({...saleData, status: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="completed">Tamamlandı</option>
                <option value="pending">Bekliyor</option>
                <option value="cancelled">İptal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="w-4 h-4 inline mr-2" />
                Ödeme Yöntemi
              </label>
              <select
                value={saleData.paymentMethod}
                onChange={(e) => setSaleData({...saleData, paymentMethod: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="cash">Nakit</option>
                <option value="card">Kredi/Banka Kartı</option>
                <option value="transfer">Havale/EFT</option>
                <option value="check">Çek</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notlar
            </label>
            <textarea
              value={saleData.notes}
              onChange={(e) => setSaleData({...saleData, notes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={3}
              placeholder="Satış ile ilgili ek notlar..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            {sale ? 'Güncelle' : 'Satış Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
}