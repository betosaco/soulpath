'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseButton } from '@/components/ui/BaseButton';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, DollarSign, Plus, Edit, Trash2, Filter, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import PackageDefinitionModal from './modals/PackageDefinitionModal';
import PackagePriceModal from './modals/PackagePriceModal';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';


interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  isDefault: boolean;
  exchangeRate: number;
}

interface SessionDuration {
  id: number;
  name: string;
  duration_minutes: number;
  description: string;
  isActive: boolean;
}

interface PackageDefinition {
  id: number;
  name: string;
  description: string;
  sessionsCount: number;
  sessionDurationId: number;
  packageType: 'individual' | 'group' | 'mixed';
  maxGroupSize: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sessionDuration: SessionDuration;
  packagePrices: PackagePrice[];
}

interface PackagePrice {
  id: number;
  packageDefinitionId: number;
  currencyId: number;
  price: number;
  pricingMode: 'custom' | 'calculated';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  packageDefinition: PackageDefinition;
  currency: Currency;
}

const PackagesAndPricing: React.FC = () => {
  const { user } = useAuth();
  const [packageDefinitions, setPackageDefinitions] = useState<PackageDefinition[]>([]);
  const [packagePrices, setPackagePrices] = useState<PackagePrice[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [sessionDurations, setSessionDurations] = useState<SessionDuration[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastLoaded, setLastLoaded] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState('definitions');
  
  // Filters
  const [definitionFilters, setDefinitionFilters] = useState({
    packageType: 'all',
    isActive: 'all',
    sessionDurationId: 'all'
  });

  const [priceFilters, setPriceFilters] = useState({
    packageDefinitionId: 'all',
    currencyId: 'all',
    pricingMode: 'all',
    isActive: 'all'
  });

  // Modal states
  const [showCreateDefinitionModal, setShowCreateDefinitionModal] = useState(false);
  const [showEditDefinitionModal, setShowEditDefinitionModal] = useState(false);
  const [showCreatePriceModal, setShowCreatePriceModal] = useState(false);
  const [showEditPriceModal, setShowEditPriceModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PackageDefinition | PackagePrice | null>(null);
  const [deleteType, setDeleteType] = useState<'definition' | 'price'>('definition');

  // Form states
  const [definitionFormData, setDefinitionFormData] = useState({
    name: '',
    description: '',
    sessionsCount: '',
    sessionDurationId: '',
    packageType: 'individual' as const,
    maxGroupSize: '',
    isActive: true
  });

  const [priceFormData, setPriceFormData] = useState({
    packageDefinitionId: '',
    currencyId: '',
    price: '',
    pricingMode: 'calculated' as const,
    isActive: true
  });



  const fetchPackageDefinitions = useCallback(async () => {
    if (!user?.access_token) return;

    try {
      const params = new URLSearchParams();

      Object.entries(definitionFilters).forEach(([key, value]) => {
        if (value && value !== 'all') params.append(key, value);
      });

      const response = await fetch(`/api/admin/package-definitions?${params}&enhanced=true`, {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      if (data.success) {
        console.log('🔍 Package definitions data received:', data.data);
        setPackageDefinitions(data.data);
      } else {
        toast.error('Failed to fetch package definitions');
      }
    } catch {
      toast.error('Error fetching package definitions');
    }
  }, [user?.access_token, definitionFilters]);

  const fetchPackagePrices = useCallback(async () => {
    if (!user?.access_token) return;

    try {
      const params = new URLSearchParams();

      Object.entries(priceFilters).forEach(([key, value]) => {
        if (value && value !== 'all') params.append(key, value);
      });

      const response = await fetch(`/api/admin/package-prices?${params}`, {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      if (data.success) {
        setPackagePrices(data.data);
      } else {
        toast.error('Failed to fetch package prices');
      }
    } catch {
      toast.error('Error fetching package prices');
    }
  }, [user?.access_token, priceFilters]);

  const fetchCurrencies = useCallback(async () => {
    if (!user?.access_token) return;
    try {
      const response = await fetch('/api/admin/currencies', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      if (data.success) {
        setCurrencies(data.data);
      }
    } catch {
      toast.error('Error fetching currencies');
    }
  }, [user?.access_token]);

  const fetchSessionDurations = useCallback(async () => {
    if (!user?.access_token) return;
    try {
      const response = await fetch('/api/admin/session-durations', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      if (data.success) {
        setSessionDurations(data.data);
      }
    } catch {
      toast.error('Error fetching session durations');
    }
  }, [user?.access_token]);

  const fetchAllData = useCallback(async () => {
    try {
      console.log('🔍 fetchAllData called, user:', user);
      console.log('🔍 access_token exists:', !!user?.access_token);
      console.log('🔍 access_token length:', user?.access_token?.length);

      if (!user?.access_token) {
        console.log('❌ No access token, cannot load packages data');
        toast.error('Please log in to access this feature');
        return;
      }

      setLoading(true);
      console.log('Loading packages data...');

      await Promise.all([
        fetchCurrencies(),
        fetchSessionDurations(),
        fetchPackageDefinitions(),
        fetchPackagePrices()
      ]);

      setLastLoaded(new Date());
      console.log('✅ Packages data loaded successfully');
      toast.success('Packages data loaded successfully');
    } catch (error) {
      console.error('❌ Error fetching packages data:', error);
      toast.error('Failed to load packages data');
    } finally {
      setLoading(false);
    }
  }, [user, fetchCurrencies, fetchSessionDurations, fetchPackageDefinitions, fetchPackagePrices]);

  // Add a manual refresh function that can be called from parent components
  const refreshPackagesData = useCallback(() => {
    if (user?.access_token) {
      console.log('Manual refresh requested...');
      fetchAllData();
    }
  }, [user?.access_token, fetchAllData]);

  useEffect(() => {
    if (user?.access_token) {
      console.log('User authenticated, loading packages data...');
      fetchAllData();
    } else {
      console.log('User not authenticated, clearing packages data...');
      setPackageDefinitions([]);
      setPackagePrices([]);
      setCurrencies([]);
      setSessionDurations([]);
      setLoading(false);
    }
  }, [user?.access_token, fetchAllData]);

  // Refresh data when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user?.access_token && packageDefinitions.length === 0) {
        console.log('Component became visible, refreshing packages data...');
        fetchAllData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user?.access_token, packageDefinitions.length, fetchAllData]);

  // Additional effect to handle component mounting/navigation
  useEffect(() => {
    if (user?.access_token && packageDefinitions.length === 0) {
      console.log('Component mounted or navigated to, loading packages data...');
      fetchAllData();
    }
  }, [user?.access_token, packageDefinitions.length, fetchAllData]);

  // Expose refresh function to parent components if needed
  useEffect(() => {
    // @ts-expect-error - Exposing refresh function globally for debugging
    window.refreshPackagesData = refreshPackagesData;

    return () => {
      // @ts-expect-error - Clean up global function
      delete window.refreshPackagesData;
    };
  }, [refreshPackagesData]);

  // Listen for navigation events and refresh data when needed
  useEffect(() => {
    const handleNavigation = () => {
      // Small delay to ensure the component is fully mounted
      setTimeout(() => {
        if (user?.access_token && packageDefinitions.length === 0) {
          console.log('Navigation detected, refreshing packages data...');
          fetchAllData();
        }
      }, 100);
    };

    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, [user?.access_token, packageDefinitions.length, fetchAllData]);

  const handleCreateDefinition = async () => {
    if (!user?.access_token) return;
    try {
      const response = await fetch('/api/admin/package-definitions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: definitionFormData.name,
          description: definitionFormData.description,
          sessionsCount: parseInt(definitionFormData.sessionsCount),
          sessionDurationId: parseInt(definitionFormData.sessionDurationId),
          packageType: definitionFormData.packageType,
          maxGroupSize: definitionFormData.maxGroupSize ? parseInt(definitionFormData.maxGroupSize) : null,
          isActive: definitionFormData.isActive
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Package definition created successfully');
        setShowCreateDefinitionModal(false);
        resetDefinitionForm();
        fetchPackageDefinitions();
      } else {
        toast.error(data.message || 'Failed to create package definition');
      }
    } catch {
      toast.error('Error creating package definition');
    }
  };

  const handleCreatePrice = async () => {
    if (!user?.access_token) return;
    try {
      const response = await fetch('/api/admin/package-prices', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          packageDefinitionId: parseInt(priceFormData.packageDefinitionId),
          currencyId: parseInt(priceFormData.currencyId),
          price: parseFloat(priceFormData.price),
          pricingMode: priceFormData.pricingMode,
          isActive: priceFormData.isActive
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Package price created successfully');
        setShowCreatePriceModal(false);
        resetPriceForm();
        fetchPackagePrices();
      } else {
        toast.error(data.message || 'Failed to create package price');
      }
    } catch {
      toast.error('Error creating package price');
    }
  };

  const handleEditDefinition = async (data: unknown) => {
    console.log('🔍 handleEditDefinition called with data:', data);
    console.log('🔍 selectedItem:', selectedItem);
    console.log('🔍 user access_token exists:', !!user?.access_token);

    if (!user?.access_token || !selectedItem) {
      console.log('❌ Early return due to missing user token or selectedItem');
      console.log('   - user?.access_token:', !!user?.access_token);
      console.log('   - selectedItem:', selectedItem);
      return;
    }

    try {
      console.log('🔄 Preparing PUT request to /api/admin/package-definitions');
      const formData = data as Record<string, unknown>;
      const requestBody: Record<string, unknown> = {
        id: selectedItem.id
      };

      // Only include fields that have actually changed
      // Cast selectedItem to PackageDefinition since we know it's a definition in this function
      const packageDef = selectedItem as PackageDefinition;
      
      if (formData.name && formData.name !== packageDef.name) {
        requestBody.name = formData.name;
      }
      if (formData.description !== undefined && formData.description !== packageDef.description) {
        requestBody.description = formData.description;
      }
      if (formData.sessionsCount) {
        const newSessionsCount = parseInt(formData.sessionsCount as string);
        if (newSessionsCount !== packageDef.sessionsCount) {
          requestBody.sessionsCount = newSessionsCount;
        }
      }
      if (formData.sessionDurationId) {
        const newSessionDurationId = parseInt(formData.sessionDurationId as string);
        if (newSessionDurationId !== packageDef.sessionDurationId) {
          requestBody.sessionDurationId = newSessionDurationId;
        }
      }
      if (formData.packageType && formData.packageType !== packageDef.packageType) {
        requestBody.packageType = formData.packageType;
      }
      if (formData.maxGroupSize !== undefined) {
        const newMaxGroupSize = formData.maxGroupSize ? parseInt(formData.maxGroupSize as string) : null;
        if (newMaxGroupSize !== packageDef.maxGroupSize) {
          requestBody.maxGroupSize = newMaxGroupSize;
        }
      }
      if (formData.isActive !== undefined && formData.isActive !== packageDef.isActive) {
        requestBody.isActive = formData.isActive;
      }

      console.log('🔄 Request body:', requestBody);
      console.log('🔄 Original selectedItem:', selectedItem);

      const response = await fetch('/api/admin/package-definitions', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('🔄 Response status:', response.status);
      console.log('🔄 Response ok:', response.ok);

      const responseData = await response.json();
      console.log('🔄 Response data:', responseData);

      if (responseData.success) {
        console.log('✅ Package definition updated successfully');
        toast.success('Package definition updated successfully');
        setShowEditDefinitionModal(false);
        setSelectedItem(null);
        fetchPackageDefinitions();
      } else {
        console.log('❌ API returned success: false');
        console.log('   - Error message:', responseData.message);
        console.log('   - Response details:', responseData);
        toast.error(responseData.message || 'Failed to update package definition');
      }
    } catch (error) {
      console.error('❌ Error in handleEditDefinition:', error);
      toast.error('Error updating package definition');
    }
  };

  const handleEditPrice = async (data: unknown) => {
    console.log('🔍 handleEditPrice called with data:', data);
    console.log('🔍 selectedItem:', selectedItem);
    console.log('🔍 user access_token exists:', !!user?.access_token);

    if (!user?.access_token || !selectedItem || 'package_prices' in selectedItem) {
      console.log('❌ Early return due to missing user token, selectedItem, or wrong item type');
      console.log('   - user?.access_token:', !!user?.access_token);
      console.log('   - selectedItem:', selectedItem);
      console.log('   - has package_prices (should be false for PackagePrice):', selectedItem ? 'package_prices' in selectedItem : 'N/A');
      return;
    }

    try {
      console.log('🔄 Preparing PUT request to /api/admin/package-prices');
      const formData = data as Record<string, unknown>;
      const requestBody: Record<string, unknown> = {
        id: selectedItem.id
      };

      // Only include fields that have actually changed
      // Cast selectedItem to PackagePrice since we know it's a price in this function
      const packagePrice = selectedItem as PackagePrice;
      
      const newPackageDefinitionId = formData.packageDefinitionId ? parseInt(formData.packageDefinitionId as string) : undefined;
      const newCurrencyId = formData.currencyId ? parseInt(formData.currencyId as string) : undefined;
      const newPrice = formData.price ? parseFloat(formData.price as string) : undefined;

      console.log('🔍 Comparison values:');
      console.log('  - newPackageDefinitionId:', newPackageDefinitionId, 'vs packagePrice.packageDefinitionId:', packagePrice.packageDefinitionId);
      console.log('  - newCurrencyId:', newCurrencyId, 'vs packagePrice.currencyId:', packagePrice.currencyId);
      console.log('  - newPrice:', newPrice, 'vs packagePrice.price:', packagePrice.price);
      console.log('  - formData.pricingMode:', formData.pricingMode, 'vs packagePrice.pricingMode:', packagePrice.pricingMode);
      console.log('  - formData.isActive:', formData.isActive, 'vs packagePrice.isActive:', packagePrice.isActive);

      if (newPackageDefinitionId && newPackageDefinitionId !== packagePrice.packageDefinitionId) {
        console.log('✅ Including packageDefinitionId in request');
        requestBody.packageDefinitionId = newPackageDefinitionId;
      }
      if (newCurrencyId && newCurrencyId !== packagePrice.currencyId) {
        console.log('✅ Including currencyId in request');
        requestBody.currencyId = newCurrencyId;
      }
      if (newPrice !== undefined && newPrice !== packagePrice.price) {
        console.log('✅ Including price in request');
        requestBody.price = newPrice;
      }
      if (formData.pricingMode && formData.pricingMode !== packagePrice.pricingMode) {
        console.log('✅ Including pricingMode in request');
        requestBody.pricingMode = formData.pricingMode;
      }
      if (formData.isActive !== undefined && formData.isActive !== packagePrice.isActive) {
        console.log('✅ Including isActive in request');
        requestBody.isActive = formData.isActive;
      }

      console.log('🔄 Request body:', requestBody);
      console.log('🔄 Original selectedItem:', selectedItem);

      const response = await fetch('/api/admin/package-prices', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('🔄 Response status:', response.status);
      console.log('🔄 Response ok:', response.ok);

      const responseData = await response.json();
      console.log('🔄 Response data:', responseData);

      if (responseData.success) {
        console.log('✅ Package price updated successfully');
        toast.success('Package price updated successfully');
        setShowEditPriceModal(false);
        setSelectedItem(null);
        fetchPackagePrices();
      } else {
        console.log('❌ API returned success: false');
        console.log('   - Error message:', responseData.message);
        console.log('   - Response details:', responseData);
        toast.error(responseData.message || 'Failed to update package price');
      }
    } catch (error) {
      console.error('❌ Error in handleEditPrice:', error);
      toast.error('Error updating package price');
    }
  };

  const handleDelete = async () => {
    console.log('🔍 handleDelete called');
    console.log('🔍 deleteType:', deleteType);
    console.log('🔍 selectedItem:', selectedItem);
    console.log('🔍 selectedItem.id:', selectedItem?.id);
    console.log('🔍 selectedItem.id type:', typeof selectedItem?.id);
    console.log('🔍 user access_token exists:', !!user?.access_token);

    if (!user?.access_token || !selectedItem) {
      console.log('❌ Early return due to missing user token or selectedItem');
      console.log('   - user?.access_token:', !!user?.access_token);
      console.log('   - selectedItem:', selectedItem);
      return;
    }

    if (!selectedItem.id) {
      console.log('❌ selectedItem.id is undefined or null');
      console.log('   - selectedItem:', JSON.stringify(selectedItem, null, 2));
      toast.error('Invalid item selected for deletion');
      return;
    }

    try {
      const endpoint = deleteType === 'definition' ? 'package-definitions' : 'package-prices';
      console.log('🔄 Preparing DELETE request to /api/admin/' + endpoint);
      console.log('🔄 Item ID:', selectedItem.id);

      const response = await fetch(`/api/admin/${endpoint}?id=${selectedItem.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('🔄 Response status:', response.status);
      console.log('🔄 Response ok:', response.ok);

      const data = await response.json();
      console.log('🔄 Response data:', data);

      if (data.success) {
        console.log('✅ Deletion successful');
        toast.success(`${deleteType === 'definition' ? 'Package definition' : 'Package price'} deleted successfully`);
        setShowDeleteModal(false);
        setSelectedItem(null);
        if (deleteType === 'definition') {
          fetchPackageDefinitions();
        } else {
          fetchPackagePrices();
        }
      } else {
        console.log('❌ API returned success: false');
        console.log('   - Error message:', data.message);
        console.log('   - Response details:', data);
        
        // Show more user-friendly error messages
        if (data.message?.includes('active user packages')) {
          if (deleteType === 'definition') {
            toast.error('Cannot delete package definition with active user packages. Click "Edit" to deactivate it instead.', {
              duration: 6000,
              action: {
                label: 'Edit Instead',
                onClick: () => {
                  setShowDeleteModal(false);
                  setShowEditDefinitionModal(true);
                }
              }
            });
          } else {
            toast.error('Cannot delete package price with active user packages. Click "Edit" to deactivate it instead.', {
              duration: 6000,
              action: {
                label: 'Edit Instead',
                onClick: () => {
                  setShowDeleteModal(false);
                  setShowEditPriceModal(true);
                }
              }
            });
          }
        } else {
          toast.error(data.message || `Failed to delete ${deleteType}`);
        }
      }
    } catch (error) {
      console.error('❌ Error in handleDelete:', error);
      toast.error(`Error deleting ${deleteType}`);
    }
  };

  const togglePackageStatus = async (packageId: number, isActive: boolean) => {
    if (!user?.access_token) return;
    
    try {
      const response = await fetch('/api/admin/package-definitions', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: packageId,
          isActive: isActive
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Package ${isActive ? 'activated' : 'deactivated'} successfully`);
        fetchPackageDefinitions();
      } else {
        toast.error(data.message || 'Failed to update package status');
      }
    } catch {
      toast.error('Error updating package status');
    }
  };

  const togglePriceStatus = async (priceId: number, isActive: boolean) => {
    if (!user?.access_token) return;
    
    try {
      const response = await fetch('/api/admin/package-prices', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: priceId,
          isActive: isActive
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Price ${isActive ? 'activated' : 'deactivated'} successfully`);
        fetchPackagePrices();
      } else {
        toast.error(data.message || 'Failed to update price status');
      }
    } catch {
      toast.error('Error updating price status');
    }
  };

  const resetDefinitionForm = () => {
    setDefinitionFormData({
      name: '',
      description: '',
      sessionsCount: '',
      sessionDurationId: '',
      packageType: 'individual',
      maxGroupSize: '',
      isActive: true
    });
  };

  const resetPriceForm = () => {
    setPriceFormData({
      packageDefinitionId: '',
      currencyId: '',
      price: '',
      pricingMode: 'calculated',
      isActive: true
    });
  };

  const getPackageTypeBadge = (type: string) => {
    const variants = {
      individual: 'dashboard-badge-info',
      group: 'dashboard-badge-success',
      mixed: 'dashboard-badge-warning'
    };
    return <Badge className={variants[type as keyof typeof variants]}>{type}</Badge>;
  };

  const getPricingModeBadge = (mode: string) => {
    const variants = {
      custom: 'dashboard-badge-gold',
      calculated: 'dashboard-badge-info'
    };
    return <Badge className={variants[mode as keyof typeof variants]}>{mode}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#FFD700] text-lg font-semibold">Loading packages and pricing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="dashboard-text-primary text-3xl font-bold">Packages & Pricing</h1>
          <p className="dashboard-text-secondary">Manage package definitions and multi-currency pricing</p>
          {lastLoaded && (
            <p className="text-sm text-gray-400 mt-1">
              Last updated: {lastLoaded.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <BaseButton 
            variant="outline" 
            className="dashboard-button-outline"
            onClick={refreshPackagesData}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </BaseButton>
          <BaseButton 
            className="dashboard-button-primary"
            onClick={() => setShowCreateDefinitionModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Package
          </BaseButton>
          <BaseButton 
            variant="outline" 
            className="dashboard-button-outline"
            onClick={() => setShowCreatePriceModal(true)}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            New Price
          </BaseButton>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="dashboard-tabs">
          <TabsTrigger value="definitions" className="dashboard-tab">
            <Package className="w-4 h-4 mr-2" />
            Package Definitions
          </TabsTrigger>
          <TabsTrigger value="pricing" className="dashboard-tab">
            <DollarSign className="w-4 h-4 mr-2" />
            Package Pricing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="definitions" className="space-y-4">
          {/* Package Definitions Tab Content */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="dashboard-card-title">Package Definitions</CardTitle>
              <CardDescription className="dashboard-card-description">
                Core package configurations and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Label className="dashboard-label">Package Type</Label>
                  <Select 
                    value={definitionFilters.packageType} 
                    onValueChange={(value) => setDefinitionFilters(prev => ({ ...prev, packageType: value }))}
                  >
                    <SelectTrigger className="dashboard-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dashboard-dropdown-content">
                      <SelectItem value="all" className="dashboard-dropdown-item">All Types</SelectItem>
                      <SelectItem value="individual" className="dashboard-dropdown-item">Individual</SelectItem>
                      <SelectItem value="group" className="dashboard-dropdown-item">Group</SelectItem>
                      <SelectItem value="mixed" className="dashboard-dropdown-item">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label className="dashboard-label">Session Duration</Label>
                  <Select 
                    value={definitionFilters.sessionDurationId} 
                    onValueChange={(value) => setDefinitionFilters(prev => ({ ...prev, sessionDurationId: value }))}
                  >
                    <SelectTrigger className="dashboard-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dashboard-dropdown-content">
                      <SelectItem value="all" className="dashboard-dropdown-item">All Durations</SelectItem>
                      {sessionDurations.map((duration) => (
                        <SelectItem key={duration.id} value={duration.id.toString()} className="dashboard-dropdown-item">
                          {duration.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label className="dashboard-label">Status</Label>
                  <Select 
                    value={definitionFilters.isActive} 
                    onValueChange={(value) => setDefinitionFilters(prev => ({ ...prev, isActive: value }))}
                  >
                    <SelectTrigger className="dashboard-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dashboard-dropdown-content">
                      <SelectItem value="all" className="dashboard-dropdown-item">All Status</SelectItem>
                      <SelectItem value="true" className="dashboard-dropdown-item">Active</SelectItem>
                      <SelectItem value="false" className="dashboard-dropdown-item">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <BaseButton 
                  variant="outline" 
                  className="dashboard-button-outline"
                  onClick={fetchPackageDefinitions}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Apply Filters
                </BaseButton>
              </div>

              {/* Package Definitions Table */}
              <div className="overflow-x-auto">
                <table className="dashboard-table">
                  <thead className="dashboard-table-header">
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Sessions</th>
                      <th>Duration</th>
                      <th>Group Size</th>
                      <th>Prices</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packageDefinitions.map((pkg) => (
                      <tr key={pkg.id} className="dashboard-table-row">
                        <td className="font-medium">{pkg.name}</td>
                        <td>{getPackageTypeBadge(pkg.packageType)}</td>
                        <td>{pkg.sessionsCount}</td>
                        <td>{pkg.sessionDuration?.name || 'N/A'}</td>
                        <td>{pkg.maxGroupSize || '-'}</td>
                        <td>
                          <div className="space-y-1">
                            {pkg.packagePrices && pkg.packagePrices.filter(p => p.isActive).length > 0 ? (
                              pkg.packagePrices
                                .filter(p => p.isActive)
                                .slice(0, 3)
                                .map((price, index) => (
                                <div key={index} className="text-sm">
                                  <span className="font-mono">
                                    {price.currency?.symbol || ''}
                                    {typeof price.price === 'number' && !isNaN(price.price)
                                      ? price.price.toFixed(2)
                                      : price.price || 'N/A'
                                    }
                                  </span>
                                  <span className="text-dashboard-text-secondary ml-1">
                                    {price.currency?.code || 'N/A'}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <span className="text-dashboard-text-secondary text-sm">No prices</span>
                            )}
                            {pkg.packagePrices && pkg.packagePrices.filter(p => p.isActive).length > 3 && (
                              <div className="text-xs text-dashboard-text-secondary">
                                +{pkg.packagePrices.filter(p => p.isActive).length - 3} more
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <Badge className={pkg.isActive ? 'dashboard-badge-success' : 'dashboard-badge-error'}>
                            {pkg.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <BaseButton
                              size="sm"
                              variant="outline"
                              className={pkg.isActive ? "dashboard-button-warning" : "dashboard-button-success"}
                              onClick={() => togglePackageStatus(pkg.id, !pkg.isActive)}
                            >
                              {pkg.isActive ? 'Deactivate' : 'Activate'}
                            </BaseButton>
                            <BaseButton
                              size="sm"
                              variant="outline"
                              className="dashboard-button-outline"
                              onClick={() => {
                                setSelectedItem(pkg);
                                setShowEditDefinitionModal(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </BaseButton>
                            <BaseButton
                              size="sm"
                              variant="outline"
                              className="dashboard-button-danger"
                              onClick={() => {
                                setSelectedItem(pkg);
                                setDeleteType('definition');
                                setShowDeleteModal(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </BaseButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          {/* Package Pricing Tab Content */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="dashboard-card-title">Package Pricing</CardTitle>
              <CardDescription className="dashboard-card-description">
                Multi-currency pricing with custom and calculated modes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Label className="dashboard-label">Package</Label>
                  <Select 
                    value={priceFilters.packageDefinitionId} 
                    onValueChange={(value) => setPriceFilters(prev => ({ ...prev, packageDefinitionId: value }))}
                  >
                    <SelectTrigger className="dashboard-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dashboard-dropdown-content">
                      <SelectItem value="all" className="dashboard-dropdown-item">All Packages</SelectItem>
                      {packageDefinitions.map((pkg) => (
                        <SelectItem key={pkg.id} value={pkg.id.toString()} className="dashboard-dropdown-item">
                          {pkg.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label className="dashboard-label">Currency</Label>
                  <Select 
                    value={priceFilters.currencyId} 
                    onValueChange={(value) => setPriceFilters(prev => ({ ...prev, currencyId: value }))}
                  >
                    <SelectTrigger className="dashboard-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dashboard-dropdown-content">
                      <SelectItem value="all" className="dashboard-dropdown-item">All Currencies</SelectItem>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.id} value={currency.id.toString()} className="dashboard-dropdown-item">
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label className="dashboard-label">Pricing Mode</Label>
                  <Select 
                    value={priceFilters.pricingMode} 
                    onValueChange={(value) => setPriceFilters(prev => ({ ...prev, pricingMode: value }))}
                  >
                    <SelectTrigger className="dashboard-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dashboard-dropdown-content">
                      <SelectItem value="all" className="dashboard-dropdown-item">All Modes</SelectItem>
                      <SelectItem value="custom" className="dashboard-dropdown-item">Custom</SelectItem>
                      <SelectItem value="calculated" className="dashboard-dropdown-item">Calculated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <BaseButton 
                  variant="outline" 
                  className="dashboard-button-outline"
                  onClick={fetchPackagePrices}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Apply Filters
                </BaseButton>
              </div>

              {/* Package Prices Table */}
              <div className="overflow-x-auto">
                <table className="dashboard-table">
                  <thead className="dashboard-table-header">
                    <tr>
                      <th>Package</th>
                      <th>Currency</th>
                      <th>Price</th>
                      <th>Mode</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packagePrices.map((price) => (
                      <tr key={price.id} className="dashboard-table-row">
                        <td className="font-medium">{price.packageDefinition?.name || 'N/A'}</td>
                        <td>
                          <Badge className="dashboard-badge">
                            {price.currency?.code || 'N/A'} {price.currency?.symbol || ''}
                          </Badge>
                        </td>
                        <td className="font-mono">
                          {price.currency?.symbol || ''}
                          {typeof price.price === 'number' && !isNaN(price.price)
                            ? price.price.toFixed(2)
                            : <span className="text-red-400 text-xs" title={`Raw value: ${price.price}`}>
                                {price.price !== undefined && price.price !== null ? String(price.price) : 'N/A'}
                              </span>
                          }
                        </td>
                        <td>{getPricingModeBadge(price.pricingMode)}</td>
                        <td>
                          <Badge className={price.isActive ? 'dashboard-badge-success' : 'dashboard-badge-error'}>
                            {price.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <BaseButton
                              size="sm"
                              variant="outline"
                              className={price.isActive ? "dashboard-button-warning" : "dashboard-button-success"}
                              onClick={() => togglePriceStatus(price.id, !price.isActive)}
                            >
                              {price.isActive ? 'Deactivate' : 'Activate'}
                            </BaseButton>
                            <BaseButton
                              size="sm"
                              variant="outline"
                              className="dashboard-button-outline"
                              onClick={() => {
                                setSelectedItem(price);
                                setShowEditPriceModal(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </BaseButton>
                            <BaseButton
                              size="sm"
                              variant="outline"
                              className="dashboard-button-danger"
                              onClick={() => {
                                setSelectedItem(price);
                                setDeleteType('price');
                                setShowDeleteModal(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </BaseButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <PackageDefinitionModal
        isOpen={showCreateDefinitionModal}
        onClose={() => setShowCreateDefinitionModal(false)}
        onSubmit={handleCreateDefinition}
        sessionDurations={sessionDurations}
        mode="create"
      />

      <PackageDefinitionModal
        isOpen={showEditDefinitionModal}
        onClose={() => setShowEditDefinitionModal(false)}
        onSubmit={handleEditDefinition}
        packageDefinition={selectedItem && !('package_prices' in selectedItem) ? selectedItem as unknown as PackageDefinition : null}
        sessionDurations={sessionDurations}
        mode="edit"
      />

      <PackagePriceModal
        isOpen={showCreatePriceModal}
        onClose={() => setShowCreatePriceModal(false)}
        onSubmit={handleCreatePrice}
        packageDefinitions={packageDefinitions}
        currencies={currencies}
        mode="create"
      />

      <PackagePriceModal
        isOpen={showEditPriceModal}
        onClose={() => setShowEditPriceModal(false)}
        onSubmit={handleEditPrice}
        packagePrice={selectedItem && !('package_prices' in selectedItem) ? selectedItem as unknown as PackagePrice : null}
        packageDefinitions={packageDefinitions}
        currencies={currencies}
        mode="edit"
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={`Delete ${deleteType === 'definition' ? 'Package Definition' : 'Package Price'}`}
        description={
          deleteType === 'definition' 
            ? 'Are you sure you want to delete this package definition? Note: This action will fail if there are active user packages associated with it. Consider deactivating it instead.'
            : 'Are you sure you want to delete this package price? Note: This action will fail if there are active user packages associated with it.'
        }
        itemName={selectedItem ? ('packagePrices' in selectedItem ? (selectedItem as unknown as PackagePrice).packageDefinition?.name || 'N/A' : (selectedItem as unknown as PackageDefinition).name) : undefined}
        itemType={deleteType}
      />
    </div>
  );
};

export default PackagesAndPricing;
