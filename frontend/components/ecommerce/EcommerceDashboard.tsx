'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import { teacherUI } from '@/lib/styles/teacher-ui';

interface EcommerceStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
  productsChange: number;
  customersChange: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  createdAt: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  status: 'active' | 'inactive';
}

export function EcommerceDashboard({ activeTab, onTabChange }: { activeTab?: string; onTabChange?: (tab: string) => void }) {
  const [internalTab, setInternalTab] = useState('overview');
  const currentTab = activeTab ?? internalTab;
  const setTab = onTabChange ?? setInternalTab;
  const [stats, setStats] = useState<EcommerceStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    revenueChange: 0,
    ordersChange: 0,
    productsChange: 0,
    customersChange: 0
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Load real data from API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        // Load products
        const productsResponse = await fetch('/api/admin/ecommerce/products');
        const productsData = await productsResponse.json();
        
        if (productsData.success) {
          setProducts(productsData.data.map((product: {
            id: string;
            name: string;
            price: string;
            status: string;
            inventory: number;
            createdAt: string;
          }) => ({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            stock: product.inventory, // Use inventory instead of stock
            category: 'General', // Default category since it's not in the type
            status: product.status.toLowerCase(),
            image: '/images/placeholder.jpg', // Default image since images is not in the type
            createdAt: new Date(product.createdAt).toISOString().split('T')[0],
            updatedAt: new Date(product.createdAt).toISOString().split('T')[0] // Use createdAt since updatedAt is not in the type
          })));
        }

        // Load orders
        const ordersResponse = await fetch('/api/admin/ecommerce/orders');
        const ordersData = await ordersResponse.json();
        
        if (ordersData.success) {
          setOrders(ordersData.data.map((order: {
            orderNumber: string;
            customerName: string;
            total: string;
            status: string;
            createdAt: string;
          }) => ({
            id: order.orderNumber,
            customerName: order.customerName,
            customerEmail: 'N/A', // Default since customerEmail is not in the type
            total: parseFloat(order.total),
            status: order.status.toLowerCase(),
            items: 0, // Default since items is not in the type
            createdAt: new Date(order.createdAt).toISOString().split('T')[0]
          })));
        }

        // Load customers
        const customersResponse = await fetch('/api/admin/ecommerce/customers');
        const customersData = await customersResponse.json();
        
        if (customersData.success) {
          setCustomers(customersData.data.map((customer: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            status: string;
            createdAt: string;
          }) => ({
            id: customer.id,
            name: `${customer.firstName} ${customer.lastName}`,
            email: customer.email,
            totalOrders: 0, // Default since totalOrders is not in the type
            totalSpent: 0, // Default since totalSpent is not in the type
            lastOrder: 'Never', // Default since lastOrderAt is not in the type
            status: customer.status.toLowerCase()
          })));
        }

        // Load stats
        const statsResponse = await fetch('/api/admin/ecommerce/stats');
        const statsData = await statsResponse.json();
        
        if (statsData.success) {
          setStats({
            totalRevenue: parseFloat(statsData.data.totalRevenue || 0),
            totalOrders: statsData.data.totalOrders || 0,
            totalProducts: statsData.data.totalProducts || 0,
            totalCustomers: statsData.data.totalCustomers || 0,
            revenueChange: statsData.data.revenueChange || 0,
            ordersChange: statsData.data.ordersChange || 0,
            productsChange: statsData.data.productsChange || 0,
            customersChange: statsData.data.customersChange || 0
          });
        } else {
          // Fallback stats based on loaded data
          setStats({
            totalRevenue: ordersData.success ? ordersData.data.reduce((sum: number, order: { total: string }) => sum + parseFloat(order.total), 0) : 0,
            totalOrders: ordersData.success ? ordersData.data.length : 0,
            totalProducts: productsData.success ? productsData.data.length : 0,
            totalCustomers: customersData.success ? customersData.data.length : 0,
            revenueChange: 0,
            ordersChange: 0,
            productsChange: 0,
            customersChange: 0
          });
        }

      } catch (error) {
        console.error('Error loading ecommerce data:', error);
        // Set empty data on error
        setProducts([]);
        setOrders([]);
        setCustomers([]);
        setStats({
          totalRevenue: 0,
          totalOrders: 0,
          totalProducts: 0,
          totalCustomers: 0,
          revenueChange: 0,
          ordersChange: 0,
          productsChange: 0,
          customersChange: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case 'active':
      case 'delivered':
        return `${teacherUI.badge.base} ${teacherUI.badge.success} border border-[var(--unified-border-light)]`;
      case 'processing':
      case 'shipped':
        return `${teacherUI.badge.base} ${teacherUI.badge.info} border border-[var(--unified-border-light)]`;
      case 'pending':
        return `${teacherUI.badge.base} ${teacherUI.badge.warning} border border-[var(--unified-border-light)]`;
      case 'cancelled':
      case 'inactive':
      case 'out_of_stock':
        return `${teacherUI.badge.base} ${teacherUI.badge.unavailable} border border-[var(--unified-border-light)]`;
      default:
        return `${teacherUI.badge.base} ${teacherUI.badge.neutral} border border-[var(--unified-border-light)]`;
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/ecommerce/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Remove product from local state
        setProducts(products.filter(p => p.id !== productId));
        alert('Product deleted successfully');
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      const response = await fetch(`/api/admin/ecommerce/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: updatedProduct.name,
          price: updatedProduct.price,
          stock: updatedProduct.stock,
          category: updatedProduct.category,
          status: updatedProduct.status.toUpperCase()
        })
      });

      if (response.ok) {
        // Update product in local state
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        setShowEditModal(false);
        setEditingProduct(null);
        alert('Product updated successfully');
      } else {
        alert('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color }: {
    title: string;
    value: string | number;
    change: number;
    icon: React.ElementType;
    color: string;
  }) => (
    <div className={`${teacherUI.card.container} p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--unified-text-secondary)]">{title}</p>
          <p className="text-2xl font-bold text-[var(--unified-text-primary)]">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {change >= 0 ? (
          <TrendingUp className="h-4 w-4 text-[var(--color-status-success)]" />
        ) : (
          <TrendingDown className="h-4 w-4 text-[var(--color-status-error)]" />
        )}
        <span className={`ml-2 text-sm font-medium ${change >= 0 ? 'text-[var(--color-status-success)]' : 'text-[var(--color-status-error)]'}`}>
          {Math.abs(change)}%
        </span>
        <span className="ml-1 text-sm text-[var(--unified-text-secondary)]">vs last month</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--unified-text-secondary)] mx-auto mb-4"></div>
          <p className="text-[var(--unified-text-secondary)] text-lg">Loading ecommerce data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen teacher-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Tabs */}
        <div>
          <nav className="flex gap-2">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'products', label: 'Products' },
              { key: 'orders', label: 'Orders' },
              { key: 'customers', label: 'Customers' },
              { key: 'inventory', label: 'Inventory' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setTab(tab.key)}
                className={`${teacherUI.tabs.base} ${currentTab === tab.key ? teacherUI.tabs.active : teacherUI.tabs.inactive}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {currentTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Revenue"
                value={formatCurrency(stats.totalRevenue)}
                change={stats.revenueChange}
                icon={DollarSign}
                color="bg-[var(--color-status-success)]/10 text-[var(--color-status-success)]"
              />
              <StatCard
                title="Total Orders"
                value={stats.totalOrders.toLocaleString()}
                change={stats.ordersChange}
                icon={ShoppingCart}
                color="bg-[var(--color-status-info)]/10 text-[var(--color-status-info)]"
              />
              <StatCard
                title="Total Products"
                value={stats.totalProducts}
                change={stats.productsChange}
                icon={Package}
                color="bg-[var(--color-accent-500)]/10 text-[var(--color-accent-500)]"
              />
              <StatCard
                title="Total Customers"
                value={stats.totalCustomers}
                change={stats.customersChange}
                icon={Users}
                color="bg-[var(--color-accent-500)]/10 text-[var(--color-accent-500)]"
              />
            </div>

            {/* Recent Orders */}
            <div className={`${teacherUI.card.container}`}>
              <div className={teacherUI.card.header}>
                <h3 className="text-lg font-medium text-[var(--unified-text-primary)]">Recent Orders</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[var(--unified-border-light)]">
                  <thead className="bg-[var(--unified-bg-secondary)]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--unified-text-secondary)] uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--unified-text-secondary)] uppercase tracking-wider">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--unified-text-secondary)] uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-left text-xs font-medium text-[var(--unified-text-secondary)] uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--unified-text-secondary)] uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[var(--unified-bg-surface)] divide-y divide-[var(--unified-border-light)]">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--unified-text-primary)]">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--unified-text-primary)]">{order.customerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--unified-text-primary)]">{order.items}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--unified-text-primary)]">{formatCurrency(order.total)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadgeClasses(order.status)}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--unified-text-primary)]">{order.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {currentTab === 'products' && (
          <div className="space-y-6">
            {/* Products Header */}
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--unified-text-secondary)] h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10 pr-4 py-2 border border-[var(--unified-border-light)] rounded-md bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)] focus:ring-[var(--unified-primary)] focus:border-[var(--unified-primary)]"
                  />
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-[var(--unified-border-light)] rounded-md shadow-sm text-sm font-medium text-[var(--unified-text-secondary)] bg-[var(--unified-bg-surface)] hover:bg-[var(--unified-bg-secondary)]">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-[var(--unified-bg-surface)] rounded-lg shadow-sm border border-[var(--unified-border-light)]">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[var(--unified-border-light)]">
                  <thead className="bg-[var(--unified-bg-secondary)]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--unified-text-secondary)] uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[var(--unified-bg-surface)] divide-y divide-[var(--unified-border-light)]">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <Image className="h-10 w-10 rounded-md object-cover" src={product.image} alt={product.name} width={40} height={40} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-[var(--unified-text-primary)]">{product.name}</div>
                              <div className="text-sm text-[var(--unified-text-secondary)]">ID: {product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--unified-text-primary)]">{formatCurrency(product.price)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--unified-text-primary)]">{product.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--unified-text-primary)]">{product.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadgeClasses(product.status)}>
                            {product.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditProduct(product)}
                              className="text-[var(--color-status-info)] hover:text-[var(--color-status-info)]/80"
                              title="Edit product"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-[var(--color-status-error)] hover:text-[var(--color-status-error)]/80"
                              title="Delete product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {currentTab === 'orders' && (
          <div className="space-y-6">
            <div className={`${teacherUI.card.container}`}>
              <div className={teacherUI.card.header}>
                <h3 className="text-lg font-medium text-[var(--unified-text-primary)]">All Orders</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[var(--unified-border-light)]">
                  <thead className="bg-[var(--unified-bg-secondary)]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[var(--unified-bg-surface)] divide-y divide-[var(--unified-border-light)]">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--unified-text-primary)]">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--unified-text-primary)]">{order.customerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--unified-text-primary)]">{order.customerEmail}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--unified-text-primary)]">{order.items}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--unified-text-primary)]">{formatCurrency(order.total)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadgeClasses(order.status)}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--unified-text-primary)]">{order.createdAt}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-[var(--color-status-success)] hover:text-[var(--color-status-success)]/80">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-[var(--color-status-info)] hover:text-[var(--color-status-info)]/80">
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {currentTab === 'customers' && (
          <div className="space-y-6">
            <div className={`${teacherUI.card.container}`}>
              <div className={teacherUI.card.header}>
                <h3 className="text-lg font-medium text-[var(--unified-text-primary)]">All Customers</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[var(--unified-border-light)]">
                  <thead className="bg-[var(--unified-bg-secondary)]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[var(--unified-bg-surface)] divide-y divide-[var(--unified-border-light)]">
                    {customers.map((customer) => (
                      <tr key={customer.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--unified-text-primary)]">{customer.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--unified-text-primary)]">{customer.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--unified-text-primary)]">{customer.totalOrders}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--unified-text-primary)]">{formatCurrency(customer.totalSpent)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--unified-text-primary)]">{customer.lastOrder}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadgeClasses(customer.status)}>
                            {customer.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-[var(--color-status-success)] hover:text-[var(--color-status-success)]/80">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-[var(--color-status-info)] hover:text-[var(--color-status-info)]/80">
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {currentTab === 'inventory' && (
          <div className="space-y-6">
            <div className={`${teacherUI.card.container}`}>
              <div className={teacherUI.card.header}>
                <h3 className="text-lg font-medium text-[var(--unified-text-primary)]">Inventory Management</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[var(--unified-border-light)]">
                  <thead className="bg-[var(--unified-bg-secondary)]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[var(--unified-bg-surface)] divide-y divide-[var(--unified-border-light)]">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <Image className="h-10 w-10 rounded-md object-cover" src={product.image} alt={product.name} width={40} height={40} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-[var(--unified-text-primary)]">{product.name}</div>
                              <div className="text-sm text-[var(--unified-text-secondary)]">{product.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--unified-text-primary)]">{product.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--unified-text-primary)]">10</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`${teacherUI.badge.base} border ${
                            product.stock === 0
                              ? `${teacherUI.badge.unavailable} border-[var(--color-status-error)]/30`
                              : product.stock < 10
                                ? `${teacherUI.badge.warning} border-[var(--color-status-warning)]/30`
                                : `${teacherUI.badge.success} border-[var(--color-status-success)]/30`
                          }`}>
                            {product.stock === 0 ? 'Out of Stock' : product.stock < 10 ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--unified-text-primary)]">{product.updatedAt}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-[var(--color-status-info)] hover:text-[var(--color-status-info)]/80">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-[var(--color-status-success)] hover:text-[var(--color-status-success)]/80">
                              <Upload className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Product</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editingProduct.status}
                  onChange={(e) => setEditingProduct({...editingProduct, status: e.target.value as 'active' | 'inactive' | 'out_of_stock'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProduct(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateProduct(editingProduct)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
