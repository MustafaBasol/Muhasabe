import React, { useState } from 'react';
import { 
  BarChart3, Users, FileText, CreditCard, TrendingUp, DollarSign,
  Plus, Search, Bell, Settings as SettingsIcon, LogOut,
  Eye, Edit, Download, Trash2, Calendar, Filter
} from 'lucide-react';

import type { CompanyProfile } from './utils/pdfGenerator';

// components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StatsCard from './components/StatsCard';
import ChartCard from './components/ChartCard';
import RecentTransactions from './components/RecentTransactions';
import QuickActions from './components/QuickActions';
import DashboardAlerts from './components/DashboardAlerts';

// modals
import CustomerModal from './components/CustomerModal';
import SupplierModal from './components/SupplierModal';
import InvoiceModal from './components/InvoiceModal';
import ExpenseModal from './components/ExpenseModal';
import SaleModal from './components/SaleModal';
import BankModal from './components/BankModal';
import SettingsPage from './components/SettingsPage';

// view modals
import CustomerViewModal from './components/CustomerViewModal';
import SupplierViewModal from './components/SupplierViewModal';
import InvoiceViewModal from './components/InvoiceViewModal';
import ExpenseViewModal from './components/ExpenseViewModal';
import SaleViewModal from './components/SaleViewModal';
import BankViewModal from './components/BankViewModal';

// history modals
import CustomerHistoryModal from './components/CustomerHistoryModal';
import SupplierHistoryModal from './components/SupplierHistoryModal';

// pages
import CustomerList from './components/CustomerList';
import SupplierList from './components/SupplierList';
import InvoiceList from './components/InvoiceList';
import ExpenseList from './components/ExpenseList';
import BankList from './components/BankList';
import ReportsPage from './components/ReportsPage';
import ChartOfAccountsPage from './components/ChartOfAccountsPage';
import ArchivePage from './components/ArchivePage';
import GeneralLedger from './components/GeneralLedger';
import SimpleSalesPage from './components/SimpleSalesPage';
import LoginPage from './components/LoginPage';

// ─────────────────────────────────────────────────────────────
const defaultCompany: CompanyProfile = {
  name: 'MoneyFlow Muhasebe',
  address: 'İstanbul, Türkiye',
  taxNumber: '1234567890',
  taxOffice: '',
  phone: '+90 212 123 45 67',
  email: 'info@moneyflow.com',
  website: 'www.moneyflow.com',
  logoDataUrl: '',
  iban: '',
  bankAccountId: undefined,
};

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: 'Demo User', email: 'demo@moneyflow.com' });
  const [accounts, setAccounts] = useState<any[]>([]);

  // company state
  const [company, setCompany] = useState<CompanyProfile>(() => {
    try {
      const raw = localStorage.getItem('companyProfile');
      return raw ? { ...defaultCompany, ...JSON.parse(raw) } : defaultCompany;
    } catch {
      return defaultCompany;
    }
  });
  const handleCompanyUpdate = (updated: CompanyProfile) => {
    setCompany(updated);
    localStorage.setItem('companyProfile', JSON.stringify(updated));
  };

  // nav
  const handlePageChange = (page: string) => {
    const pageMap: Record<string,string> = {
      'Dashboard': 'dashboard',
      'Faturalar': 'invoices',
      'Giderler': 'expenses',
      'Müşteriler': 'customers',
      'Tedarikçiler': 'suppliers',
      'Bankalar': 'banks',
      'Satışlar': 'sales',
      'Raporlar': 'reports',
      'Muhasebe': 'general-ledger',
      'Hesap Planı': 'chart-of-accounts',
      'Arşiv': 'archive',
      'Ayarlar': 'settings'
    };
    setCurrentPage(pageMap[page] || page.toLowerCase());
  };

  // modal states
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);

  // view modal states
  const [showCustomerViewModal, setShowCustomerViewModal] = useState(false);
  const [showSupplierViewModal, setShowSupplierViewModal] = useState(false);
  const [showInvoiceViewModal, setShowInvoiceViewModal] = useState(false);
  const [showExpenseViewModal, setShowExpenseViewModal] = useState(false);
  const [showSaleViewModal, setShowSaleViewModal] = useState(false);
  const [showBankViewModal, setShowBankViewModal] = useState(false);

  // history modal states
  const [showCustomerHistoryModal, setShowCustomerHistoryModal] = useState(false);
  const [showSupplierHistoryModal, setShowSupplierHistoryModal] = useState(false);

  // selections
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [selectedBank, setSelectedBank] = useState<any>(null);

  const [supplierForExpense, setSupplierForExpense] = useState<any>(null);

  // sample data (kısaltılmış)
  const [customers, setCustomers] = useState<any[]>([
    { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@email.com', phone: '0532 123 4567', address: 'İstanbul', taxNumber: '1234567890', company: 'Yılmaz Teknoloji', createdAt: '2024-12-15', balance: 15000 },
    // ...
  ]);
  const [suppliers, setSuppliers] = useState<any[]>([
    { id: 1, name: 'ABC Tedarik Ltd.', email: 'info@abc.com', phone: '0212 123 4567', address: 'İstanbul', taxNumber: '1111111111', company: 'ABC Tedarik Ltd.', category: 'Ofis Malzemeleri', createdAt: '2024-11-01', balance: 25000 },
    // ...
  ]);
  const [invoices, setInvoices] = useState<any[]>([
    { id: '1', invoiceNumber: 'INV-2024-001', customerName: 'Ahmet Yılmaz', customerEmail: 'ahmet@email.com',
      customerAddress: 'İstanbul', total: 5000, subtotal: 4237.29, taxAmount: 762.71, status: 'paid',
      issueDate: '2024-12-15', dueDate: '2025-01-15',
      items: [{ id: '1', description: 'Web Tasarım Hizmeti', quantity: 1, unitPrice: 4237.29, total: 4237.29 }] },
  ]);
  const [expenses, setExpenses] = useState<any[]>([
    { id: 1, expenseNumber: 'EXP-2024-001', description: 'Ofis kirası - Aralık', supplier: 'Gayrimenkul A.Ş.', amount: 8000, category: 'Kira', expenseDate: '2024-12-01', dueDate: '2024-12-01', status: 'paid' },
  ]);
  const [sales, setSales] = useState<any[]>([
    { id: 1, saleNumber: 'SAL-2024-001', customerName: 'Ahmet Yılmaz', customerEmail: 'ahmet@email.com',
      productName: 'Web Tasarım Hizmeti', quantity: 1, unitPrice: 5000, amount: 5000, status: 'completed',
      date: '2024-12-15', paymentMethod: 'transfer' },
  ]);
  const [bankAccounts, setBankAccounts] = useState<any[]>([
    { id: '1', bankName: 'Ziraat Bankası', accountName: 'Ana Hesap', accountNumber: '1234567890', iban: 'TR330006100519786457841326', balance: 125000, currency: 'TRY', accountType: 'business', isActive: true, createdAt: '2024-01-01' },
    { id: '2', bankName: 'İş Bankası', accountName: 'Ticari Hesap', accountNumber: '0987654321', iban: 'TR640006400000011709426117', balance: 85000, currency: 'TRY', accountType: 'checking', isActive: true, createdAt: '2024-01-02' },
    { id: '3', bankName: 'Garanti BBVA', accountName: 'Vadeli Hesap', accountNumber: '1122334455', iban: 'TR620006200046200006678001', balance: 45000, currency: 'TRY', accountType: 'savings', isActive: true, createdAt: '2024-01-03' },
  ]);

  // auth
  const handleLogin = (email: string, password: string) => {
    if (email === 'demo@moneyflow.com' && password === 'demo123') { setIsLoggedIn(true); return true; }
    return false;
  };
  const handleLogout = () => { setIsLoggedIn(false); setCurrentPage('dashboard'); };

  const handleNewInvoice = () => { setSelectedInvoice(null); setShowInvoiceModal(true); };
  const handleNewSale = () => { setSelectedSale(null); setShowSaleModal(true); };

  // recent tx/sales
  const handleViewSale = (sale: any) => { 
  setSelectedSale(sale); 
  setShowSaleViewModal(true); 
};

  const handleEditSale = (sale: any) => { setSelectedSale(sale); setShowSaleModal(true); };

  // customers
  const handleAddCustomer = (customerData: any) => {
    const newCustomer = { id: customers.length + 1, ...customerData, balance: 0 };
    setCustomers([...customers, newCustomer]); setShowCustomerModal(false);
  };
  const handleEditCustomer = (customer: any) => { setSelectedCustomer(customer); setShowCustomerModal(true); };
  const handleUpdateCustomer = (updatedCustomer: any) => {
    setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    setShowCustomerModal(false); setSelectedCustomer(null);
  };
  const handleDeleteCustomer = (customerId: number) => {
    if (window.confirm('Bu müşteriyi silmek istediğinizden emin misiniz?')) {
      setCustomers(customers.filter(c => c.id !== customerId));
    }
  };
  const handleViewCustomer = (customer: any) => { setSelectedCustomer(customer); setShowCustomerViewModal(true); };
  const handleViewCustomerHistory = (customer: any) => { setSelectedCustomer(customer); setShowCustomerHistoryModal(true); };

  // suppliers
  const handleAddSupplier = (supplierData: any) => {
    const newSupplier = { id: suppliers.length + 1, ...supplierData, balance: 0 };
    setSuppliers([...suppliers, newSupplier]); setShowSupplierModal(false);
  };
  const handleEditSupplier = (supplier: any) => { if (showSupplierViewModal) setShowSupplierViewModal(false); setSelectedSupplier(supplier); setShowSupplierModal(true); };
  const handleUpdateSupplier = (updatedSupplier: any) => {
    setSuppliers(suppliers.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
    setShowSupplierModal(false); setSelectedSupplier(null);
  };
  const handleDeleteSupplier = (supplierId: number) => {
    if (window.confirm('Bu tedarikçiyi silmek istediğinizden emin misiniz?')) {
      setSuppliers(suppliers.filter(s => s.id !== supplierId));
    }
  };
  const handleViewSupplier = (supplier: any) => { setSelectedSupplier(supplier); setShowSupplierViewModal(true); };
  const handleViewSupplierHistory = (supplier: any) => { setShowSupplierViewModal(false); setSelectedSupplier(supplier); setShowSupplierHistoryModal(true); };
  const handleCreateExpenseFromSupplier = (supplier: any) => {
    setShowSupplierViewModal(false); setShowSupplierHistoryModal(false);
    setSelectedExpense(null); setSupplierForExpense(supplier); setShowExpenseModal(true);
  };

  // invoices
  const handleAddInvoice = (invoiceData: any) => {
    const newInvoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
      ...invoiceData,
      issueDate: new Date().toISOString().split('T')[0]
    };
    setInvoices([...invoices, newInvoice]); setShowInvoiceModal(false); setSelectedInvoice(null);
  };
  const handleEditInvoice = (invoice: any) => { setSelectedInvoice(invoice); setShowInvoiceModal(true); };

  // ► SADECE BİR KEZ TANIMLI!
  const handleViewInvoice = (invoice: any) => { setSelectedInvoice(invoice); setShowInvoiceViewModal(true); };

  const handleUpdateInvoice = (updatedInvoice: any) => {
    setInvoices(invoices.map(i => i.id === updatedInvoice.id ? updatedInvoice : i));
    setShowInvoiceModal(false); setSelectedInvoice(null);
  };
  const handleDeleteInvoice = (invoiceId: string) => {
    setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
  };

  // PDF handlers (tek tip)
const handleDownloadInvoice = async (invoice: any) => {
  try {
    const { generateInvoicePDF } = await import('./utils/pdfGenerator');
    await generateInvoicePDF(invoice, { company });
  } catch (e) { console.error(e); }
};

const handleDownloadExpense = async (expense: any) => {
  try {
    const { generateExpensePDF } = await import('./utils/pdfGenerator');
    await generateExpensePDF(expense, { company });
  } catch (e) { console.error(e); }
};

const handleDownloadSale = async (sale: any) => {
  try {
    const { generateSalePDF } = await import('./utils/pdfGenerator');
    await generateSalePDF(sale, { company });
  } catch (e) { console.error(e); }
};



  // expenses
  const handleAddExpense = (expenseData: any) => {
    const newExpense = {
      id: expenseData.id || Date.now().toString(),
      expenseNumber: expenseData.expenseNumber || `EXP-2024-${String(expenses.length + 1).padStart(3, '0')}`,
      ...expenseData,
      createdAt: expenseData.createdAt || new Date().toISOString()
    };
    setExpenses([...expenses, newExpense]); setShowExpenseModal(false); setSelectedExpense(null);
  };
  const handleEditExpense = (expense: any) => { setSelectedExpense(expense); setShowExpenseModal(true); };
  const handleUpdateExpense = (updatedExpense: any) => {
    setExpenses(expenses.map(e => e.id === updatedExpense.id ? updatedExpense : e));
    setShowExpenseModal(false); setSelectedExpense(null);
  };
  const handleDeleteExpense = (expenseId: string | number) => {
    if (window.confirm('Bu gideri silmek istediğinizden emin misiniz?')) {
      setExpenses(expenses.filter(e => e.id !== expenseId));
    }
  };
  const handleViewExpense = (expense: any) => {
    if (showSupplierHistoryModal) setShowSupplierHistoryModal(false);
    setSelectedExpense(expense); setShowExpenseViewModal(true);
  };

  // sales
  const handleAddSale = (saleData: any) => {
    const newSale = {
      id: sales.length + 1,
      saleNumber: `SAL-2024-${String(sales.length + 1).padStart(3, '0')}`,
      ...saleData,
      date: new Date().toISOString().split('T')[0]
    };
    setSales([...sales, newSale]); setShowSaleModal(false); setSelectedSale(null);
  };
  const handleUpdateSale = (updatedSale: any) => {
    setSales(sales.map(s => s.id === updatedSale.id ? updatedSale : s));
    setShowSaleModal(false); setSelectedSale(null);
  };

  // banks
  const handleAddBankAccount = (bankData: any) => {
    const newBank = { id: Date.now().toString(), ...bankData, createdAt: new Date().toISOString().split('T')[0] };
    setBankAccounts([...bankAccounts, newBank]); setShowBankModal(false); setSelectedBank(null);
  };
  const handleEditBankAccount = (bank: any) => { setSelectedBank(bank); setShowBankModal(true); };
  const handleUpdateBankAccount = (updatedBank: any) => {
    setBankAccounts(bankAccounts.map(b => b.id === updatedBank.id ? updatedBank : b));
    setShowBankModal(false); setSelectedBank(null);
  };
  const handleDeleteBankAccount = (bankId: string) => {
    if (window.confirm('Bu banka hesabını silmek istediğinizden emin misiniz?')) {
      setBankAccounts(bankAccounts.filter(b => b.id !== bankId));
    }
  };
  const handleViewBankAccount = (bank: any) => { setSelectedBank(bank); setShowBankViewModal(true); };

  if (!isLoggedIn) { return <LoginPage onLogin={handleLogin} />; }

  // render
  const renderPage = () => {
    switch (currentPage) {
      case 'customers':
        return (
          <CustomerList
            customers={customers}
            onAddCustomer={() => setShowCustomerModal(true)}
            onEditCustomer={handleEditCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            onViewCustomer={handleViewCustomer}
            onViewHistory={handleViewCustomerHistory}
          />
        );
      case 'suppliers':
        return (
          <SupplierList
            suppliers={suppliers}
            onAddSupplier={() => setShowSupplierModal(true)}
            onEditSupplier={handleEditSupplier}
            onDeleteSupplier={handleDeleteSupplier}
            onViewSupplier={handleViewSupplier}
          />
        );
      case 'invoices':
        return (
          <InvoiceList
            invoices={invoices}
            onAddInvoice={() => setShowInvoiceModal(true)}
            onEditInvoice={handleEditInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onViewInvoice={handleViewInvoice}
            onUpdateInvoice={handleUpdateInvoice}
            onDownloadInvoice={handleDownloadInvoice}
          />
        );
      case 'expenses':
        return (
          <ExpenseList
            expenses={expenses}
            onAddExpense={() => setShowExpenseModal(true)}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
            onViewExpense={handleViewExpense}
            onUpdateExpense={handleUpdateExpense}
            onDownloadExpense={handleDownloadExpense}
          />
        );
      case 'banks':
        return (
          <BankList
            bankAccounts={bankAccounts}
            onAddBank={() => setShowBankModal(true)}
            onEditBank={handleEditBankAccount}
            onDeleteBank={handleDeleteBankAccount}
            onViewBank={handleViewBankAccount}
          />
        );
      case 'sales':
        return (
          <SimpleSalesPage
            customers={customers}
            sales={sales}
            invoices={invoices}
            onSalesUpdate={setSales}
            onCreateInvoice={handleAddInvoice}
            onViewInvoice={handleViewInvoice}
            onEditInvoice={handleEditInvoice}
            onDownloadSale={handleDownloadSale}
          />
        );
      case 'reports':
        return (
          <ReportsPage 
            invoices={invoices}
            expenses={expenses}
            sales={sales}
            customers={customers}
            suppliers={suppliers}
          />
        );
      case 'chart-of-accounts':
        return (
          <ChartOfAccountsPage 
            accounts={accounts}
            onAccountsUpdate={setAccounts}
            invoices={invoices}
            expenses={expenses}
            sales={sales}
            customers={customers}
          />
        );
      case 'general-ledger':
        return (
          <GeneralLedger
            invoices={invoices}
            expenses={expenses}
            sales={sales}
            onViewInvoice={handleViewInvoice}
            onEditInvoice={handleEditInvoice}
            onViewExpense={handleViewExpense}
            onEditExpense={handleEditExpense}
            onViewSale={handleViewSale}
            onEditSale={handleEditSale}
            onViewEntry={(entry: any) => {
              if (entry.type === 'invoice') handleViewInvoice(entry.originalData);
              else if (entry.type === 'expense') handleViewExpense(entry.originalData);
              else if (entry.type === 'sale') handleViewSale(entry.originalData);
            }}
            onEditEntry={(entry: any) => {
              if (entry.type === 'invoice') handleEditInvoice(entry.originalData);
              else if (entry.type === 'expense') handleEditExpense(entry.originalData);
              else if (entry.type === 'sale') handleEditSale(entry.originalData);
            }}
          />
        );
      case 'archive':
        return (
          <ArchivePage
            invoices={invoices}
            expenses={expenses}
            sales={sales}
            customers={customers}
            suppliers={suppliers}
            onViewInvoice={handleViewInvoice}
            onViewExpense={handleViewExpense}
            onViewSale={handleViewSale}
            onViewCustomer={handleViewCustomer}
            onViewSupplier={handleViewSupplier}
            onDownloadInvoice={handleDownloadInvoice}
            onDownloadExpense={handleDownloadExpense}
            onDownloadSale={handleDownloadSale}
          />
        );
      case 'settings':
        return (
          <SettingsPage 
            user={user}
            company={company}
            bankAccounts={bankAccounts}
            onUserUpdate={(updatedUser) => setUser(updatedUser)}
            onCompanyUpdate={handleCompanyUpdate}
            onExportData={() => {
              const data = { invoices, expenses, sales, customers, suppliers, bankAccounts, accounts, company, exportDate: new Date().toISOString() };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `moneyflow-backup-${new Date().toISOString().split('T')[0]}.json`;
              document.body.appendChild(a); a.click(); document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            onImportData={(data) => {
              if (data.invoices) setInvoices(data.invoices);
              if (data.expenses) setExpenses(data.expenses);
              if (data.sales) setSales(data.sales);
              if (data.customers) setCustomers(data.customers);
              if (data.suppliers) setSuppliers(data.suppliers);
              if (data.bankAccounts) setBankAccounts(data.bankAccounts);
              if (data.accounts) setAccounts(data.accounts);
              if (data.company) handleCompanyUpdate({ ...defaultCompany, ...data.company });
            }}
          />
        );
      default:
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div onClick={() => handlePageChange('sales')} className="cursor-pointer">
                <StatsCard
                  title="Toplam Gelir"
                  value={`₺${sales.reduce((sum, sale) => sum + sale.amount, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
                  change={(() => {
                    const currentMonth = new Date().getMonth();
                    const currentYear = new Date().getFullYear();
                    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
                    const currentMonthSales = sales.filter(s => {
                      const d = new Date(s.date);
                      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
                    }).reduce((sum, s) => sum + s.amount, 0);
                    const lastMonthSales = sales.filter(s => {
                      const d = new Date(s.date);
                      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
                    }).reduce((sum, s) => sum + s.amount, 0);
                    if (lastMonthSales === 0) return "+0%";
                    const change = ((currentMonthSales - lastMonthSales) / lastMonthSales) * 100;
                    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
                  })()}
                  changeType="increase"
                  icon={TrendingUp}
                  color="green"
                />
              </div>
              <div onClick={() => handlePageChange('expenses')} className="cursor-pointer">
                <StatsCard
                  title="Toplam Gider"
                  value={`₺${expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
                  change={(() => {
                    const currentMonth = new Date().getMonth();
                    const currentYear = new Date().getFullYear();
                    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
                    const cm = expenses.filter(e => {
                      const d = new Date(e.expenseDate);
                      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
                    }).reduce((s, e) => s + e.amount, 0);
                    const lm = expenses.filter(e => {
                      const d = new Date(e.expenseDate);
                      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
                    }).reduce((s, e) => s + e.amount, 0);
                    if (lm === 0) return "+0%";
                    const change = ((cm - lm) / lm) * 100;
                    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
                  })()}
                  changeType="increase"
                  icon={DollarSign}
                  color="red"
                />
              </div>
              <div onClick={() => handlePageChange('invoices')} className="cursor-pointer">
                <StatsCard
                  title="Bekleyen Faturalar"
                  value={`₺${invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
                  change="-3.1% bu ay"
                  changeType="decrease"
                  icon={FileText}
                  color="blue"
                />
              </div>
              <div onClick={() => handlePageChange('customers')} className="cursor-pointer">
                <StatsCard
                  title="Aktif Müşteriler"
                  value={customers.length.toString()}
                  change={(() => {
                    const growthRate = Math.random() * 10 - 2;
                    return `${growthRate >= 0 ? '+' : ''}${growthRate.toFixed(1)}%`;
                  })()}
                  changeType="increase"
                  icon={Users}
                  color="purple"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <QuickActions
              onNewInvoice={() => setShowInvoiceModal(true)}
              onNewExpense={() => setShowExpenseModal(true)}
              onNewSale={() => setShowSaleModal(true)}
              onNewCustomer={() => setShowCustomerModal(true)}
              onViewCustomers={() => handlePageChange('customers')}
              onViewSuppliers={() => handlePageChange('suppliers')}
              onViewBanks={() => handlePageChange('banks')}
              customers={customers}
              suppliers={suppliers}
              banks={bankAccounts}
              invoices={invoices}
              onUpdateInvoice={handleUpdateInvoice}
              onUpdateExpense={handleUpdateExpense}
              onUpdateSale={handleUpdateSale}
            />

            {/* Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <ChartCard sales={sales} expenses={expenses} />
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı Erişim</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button onClick={() => handlePageChange('customers')} className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                      <Users className="w-8 h-8 text-purple-600 mr-3" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Müşteriler</div>
                        <div className="text-sm text-gray-500">Toplam: {customers.length}</div>
                      </div>
                    </button>
                    <button onClick={() => handlePageChange('suppliers')} className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                      <CreditCard className="w-8 h-8 text-green-600 mr-3" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Tedarikçiler</div>
                        <div className="text-sm text-gray-500">Toplam: {suppliers.length}</div>
                      </div>
                    </button>
                    <button onClick={() => handlePageChange('banks')} className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Banka Hesapları</div>
                        <div className="text-sm text-gray-500">Toplam: {bankAccounts.length}</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <RecentTransactions
                  invoices={invoices}
                  expenses={expenses}
                  sales={sales}
                  onViewInvoice={handleViewInvoice}
                  onEditInvoice={handleEditInvoice}
                  onDownloadInvoice={handleDownloadInvoice}
                  onViewExpense={handleViewExpense}
                  onEditExpense={handleEditExpense}
                  onDownloadExpense={handleDownloadExpense}
                  onViewSale={handleViewSale}
                  onEditSale={handleEditSale}
                  onDownloadSale={handleDownloadSale}
                />
                <DashboardAlerts />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={{ name: 'Demo Kullanıcı', email: 'demo@moneyflow.com' }}
        onLogout={handleLogout}
        onNewInvoice={handleNewInvoice}
        onNewSale={handleNewSale}
        activePage={currentPage}
      />
      
      <div className="flex">
        <Sidebar 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          invoices={invoices}
          expenses={expenses}
        />
        
        <main className="flex-1 p-6">
          {renderPage()}
        </main>
      </div>

      {/* Edit/Create Modals */}
      {showCustomerModal && (
        <CustomerModal
          isOpen={showCustomerModal}
          customer={selectedCustomer}
          onSave={selectedCustomer ? handleUpdateCustomer : handleAddCustomer}
          onClose={() => { setShowCustomerModal(false); setSelectedCustomer(null); }}
        />
      )}

      {showSupplierModal && (
        <SupplierModal
          isOpen={showSupplierModal}
          supplier={selectedSupplier}
          onSave={selectedSupplier ? handleUpdateSupplier : handleAddSupplier}
          onClose={() => { setShowSupplierModal(false); setSelectedSupplier(null); }}
        />
      )}

      {showInvoiceModal && (
        <InvoiceModal
          onSave={selectedInvoice ? handleUpdateInvoice : handleAddInvoice}
          onClose={() => { setShowInvoiceModal(false); setSelectedInvoice(null); }}
          invoice={selectedInvoice}
          customers={customers}
        />
      )}

      {showExpenseModal && (
        <ExpenseModal
          isOpen={showExpenseModal}
          expense={selectedExpense}
          supplierInfo={supplierForExpense}
          onSave={selectedExpense ? handleUpdateExpense : handleAddExpense}
          onClose={() => {
            setShowExpenseModal(false);
            setSelectedExpense(null);
            setSupplierForExpense(null);
          }}
        />
      )}

      {showSaleModal && (
        <SaleModal
          isOpen={showSaleModal}
          sale={selectedSale}
          customers={customers}
          onSave={selectedSale ? handleUpdateSale : handleAddSale}
          onClose={() => { setShowSaleModal(false); setSelectedSale(null); }}
        />
      )}

      {showBankModal && (
        <BankModal
          isOpen={showBankModal}
          bankAccount={selectedBank}
          onSave={selectedBank ? handleUpdateBankAccount : handleAddBankAccount}
          onClose={() => { setShowBankModal(false); setSelectedBank(null); }}
        />
      )}

      {/* View Modals */}
      {showCustomerViewModal && selectedCustomer && (
        <CustomerViewModal
          isOpen={showCustomerViewModal} // ✅ önemli
    customer={selectedCustomer}
    onClose={() => { setShowCustomerViewModal(false); setSelectedCustomer(null); }}
    onEdit={(c) => { setShowCustomerViewModal(false); setSelectedCustomer(c); setShowCustomerModal(true); }}
        onViewHistory={(c) => handleViewCustomerHistory(c)}    
        />
      )}

      {showSupplierViewModal && selectedSupplier && (
        <SupplierViewModal
          isOpen={showSupplierViewModal}
          supplier={selectedSupplier}
          onClose={() => { setShowSupplierViewModal(false); setSelectedSupplier(null); }}
          onEdit={() => { setShowSupplierViewModal(false); setShowSupplierModal(true); }}
          onViewHistory={() => handleViewSupplierHistory(selectedSupplier)}
          onCreateExpense={() => handleCreateExpenseFromSupplier(selectedSupplier)}
        />
      )}

      {showInvoiceViewModal && selectedInvoice && (
        <InvoiceViewModal
          isOpen={showInvoiceViewModal}
          invoice={selectedInvoice}
          onClose={() => { setShowInvoiceViewModal(false); setSelectedInvoice(null); }}
          onEdit={() => { setShowInvoiceViewModal(false); setShowInvoiceModal(true); }}
          onDownload={(inv) => handleDownloadInvoice(inv)}
        />
      )}

      {showExpenseViewModal && selectedExpense && (
        <ExpenseViewModal
          isOpen={showExpenseViewModal}
          expense={selectedExpense}
          onClose={() => { setShowExpenseViewModal(false); setSelectedExpense(null); }}
          onEdit={() => { setShowExpenseViewModal(false); setShowExpenseModal(true); }}
          onDownload={(exp) => handleDownloadExpense(exp)}
        />
      )}

      {showSaleViewModal && selectedSale && (
        <SaleViewModal
          isOpen={showSaleViewModal}
          sale={selectedSale}
          onClose={() => { setShowSaleViewModal(false); setSelectedSale(null); }}
          onEdit={() => { setShowSaleViewModal(false); setShowSaleModal(true); }}
          onDownload={(s) => handleDownloadSale(s)}
        />
      )}

      {/* Bank View Modal (state vardı, ekledik) */}
      {showBankViewModal && selectedBank && (
        <BankViewModal
          isOpen={showBankViewModal}
          bankAccount={selectedBank}
          onClose={() => { setShowBankViewModal(false); setSelectedBank(null); }}
          onEdit={() => { setShowBankViewModal(false); setShowBankModal(true); }}
        />
      )}

      {/* History Modals */}
      {showCustomerHistoryModal && selectedCustomer && (
        <CustomerHistoryModal
          customer={selectedCustomer}
          invoices={invoices.filter(inv => inv.customerName === selectedCustomer.name)}
          sales={sales.filter(sale => sale.customerName === selectedCustomer.name)}
          onClose={() => { setShowCustomerHistoryModal(false); setSelectedCustomer(null); }}
          onViewInvoice={handleViewInvoice}
          onViewSale={handleViewSale}
        />
      )}

      {showSupplierHistoryModal && selectedSupplier && (
        <SupplierHistoryModal
          supplier={selectedSupplier}
          expenses={expenses.filter((exp: any) => exp.supplier === selectedSupplier.name)}
          onClose={() => { setShowSupplierHistoryModal(false); setSelectedSupplier(null); }}
          onViewExpense={handleViewExpense}
          onCreateExpense={() => handleCreateExpenseFromSupplier(selectedSupplier)}
        />
      )}
    </div>
  );
}

export default App;
