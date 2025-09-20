import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Users,
  CreditCard,
  TrendingUp,
  Settings,
  PieChart,
  Calculator,
  Archive,
  BookOpen,
  Building2,
  Receipt
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function Sidebar({ currentPage, onPageChange, invoices = [], expenses = [] }: SidebarProps) {
  // Calculate dynamic counts for active (non-archived) items
  const activeInvoiceCount = invoices.filter(invoice => 
    invoice.status !== 'paid' && invoice.status !== 'overdue'
  ).length;
  
  const pendingExpenseCount = expenses.filter(expense => 
    expense.status === 'draft' || expense.status === 'approved'
  ).length;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', page: 'dashboard' },
    { icon: FileText, label: 'Faturalar', page: 'invoices', badge: activeInvoiceCount > 0 ? activeInvoiceCount : null },
    { icon: Receipt, label: 'Giderler', page: 'expenses', badge: pendingExpenseCount > 0 ? pendingExpenseCount : null },
    { icon: Users, label: 'Müşteriler', page: 'customers' },
    { icon: Building2, label: 'Tedarikçiler', page: 'suppliers' },
    { icon: CreditCard, label: 'Bankalar', page: 'banks' },
    { icon: TrendingUp, label: 'Satışlar', page: 'sales' },
    { icon: PieChart, label: 'Raporlar', page: 'reports' },
    { icon: Calculator, label: 'Muhasebe', page: 'general-ledger' },
    { icon: BookOpen, label: 'Hesap Planı', page: 'chart-of-accounts' },
    { icon: Archive, label: 'Arşiv', page: 'archive' },
    { icon: Settings, label: 'Ayarlar', page: 'settings' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">MoneyFlow</h1>
            <p className="text-sm text-gray-500">Muhasebe Sistemi</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => onPageChange(item.page)}
            className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors ${
              currentPage === item.page
                ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-3">
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </div>
            {item.badge && (
              <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}