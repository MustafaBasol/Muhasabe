import React from 'react';
import { Plus, FileText, Receipt, TrendingUp, Users, Building2, CreditCard } from 'lucide-react';

interface QuickActionsProps {
  onNewInvoice: () => void;
  onNewExpense: () => void;
  onNewSale: () => void;
  onNewCustomer: () => void;
  onViewCustomers: () => void;
  onViewSuppliers: () => void;
  onViewBanks: () => void;
  customers?: any[];
  suppliers?: any[];
  banks?: any[];
}

export default function QuickActions({
  onNewInvoice,
  onNewExpense,
  onNewSale,
  onNewCustomer,
  onViewCustomers,
  onViewSuppliers,
  onViewBanks,
  customers = [],
  suppliers = [],
  banks = []
}: QuickActionsProps) {
  const quickActions = [
    {
      title: 'Yeni Fatura',
      description: 'Müşteri faturası oluştur',
      icon: FileText,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: onNewInvoice
    },
    {
      title: 'Yeni Gider',
      description: 'Gider kaydı ekle',
      icon: Receipt,
      color: 'bg-red-500 hover:bg-red-600',
      onClick: onNewExpense
    },
    {
      title: 'Yeni Satış',
      description: 'Satış işlemi kaydet',
      icon: TrendingUp,
      color: 'bg-green-500 hover:bg-green-600',
      onClick: onNewSale
    },
    {
      title: 'Yeni Müşteri',
      description: 'Müşteri bilgisi ekle',
      icon: Users,
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: onNewCustomer
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`${action.color} text-white p-4 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg group`}
            >
              <div className="flex items-center space-x-3">
                <action.icon className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold text-sm">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}