import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Mail, Phone, Building2 } from 'lucide-react';

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

interface CustomerListProps {
  customers: Customer[];
  onAddCustomer: () => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
  onViewCustomer: (customer: Customer) => void;
  onSelectCustomer?: (customer: Customer) => void;
  selectionMode?: boolean;
}

export default function CustomerList({
  customers,
  onAddCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onViewCustomer,
  onSelectCustomer,
  selectionMode = false
}: CustomerListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {selectionMode ? 'Müşteri Seç' : 'Müşteriler'}
            </h2>
            <p className="text-sm text-gray-500">
              {customers.length} müşteri kayıtlı
            </p>
          </div>
          {!selectionMode && (
            <button
              onClick={onAddCustomer}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Müşteri</span>
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Müşteri ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Customer List */}
      <div className="divide-y divide-gray-200">
        {filteredCustomers.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Müşteri bulunamadı' : 'Henüz müşteri yok'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? 'Arama kriterlerinize uygun müşteri bulunamadı.'
                : 'İlk müşterinizi ekleyerek başlayın.'}
            </p>
            {!selectionMode && !searchTerm && (
              <button
                onClick={onAddCustomer}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                İlk Müşteriyi Ekle
              </button>
            )}
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer`}
              onClick={() =>
                selectionMode
                  ? onSelectCustomer?.(customer)
                  : onViewCustomer(customer)            // 🔹 normal modda satır → görüntüle
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') {
                selectionMode ? onSelectCustomer?.(customer) : onViewCustomer(customer);
              }}}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-lg">
                      {customer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    {selectionMode ? (
                      <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                    ) : (
                      <button
                        type="button"                               // 🔹 form-submit önle
                        onClick={(e) => {
                          e.stopPropagation();                       // 🔹 satır onClick’i tetikleme
                          onViewCustomer(customer);
                        }}
                        className="font-semibold text-purple-600 hover:text-purple-800 transition-colors cursor-pointer text-left"
                        title="Müşteri detaylarını görüntüle"
                      >
                        {customer.name}
                      </button>
                    )}
                    {customer.company && (
                      <p className="text-sm text-gray-600 flex items-center">
                        <Building2 className="w-3 h-3 mr-1" />
                        {customer.company}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500 flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {customer.email}
                      </span>
                      {customer.phone && (
                        <span className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {customer.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {!selectionMode && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onEditCustomer(customer); }}   // 🔹
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteCustomer(customer.id); }} // 🔹
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
