'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PackageIcon, CalendarIcon, ShoppingCart, Clock as ClockIcon } from 'lucide-react';


import { AppShell } from '@/components/AppShell';

interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  is_active: boolean;
  features: string[];
  created_at: string;
  updated_at: string;
  packagePrices?: Array<{
    price: number;
    currency: {
      symbol: string;
      code: string;
    };
  }>;
  sessionDuration?: {
    duration_minutes: number;
  };
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.access_token) {
      fetchPackages();
    }
  }, [user?.access_token]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/client/packages', {
        headers: {
          'Authorization': `Bearer ${user?.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      
      if (result.success) {
        setPackages(result.data);
      } else {
        console.error('Failed to fetch packages');
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-[var(--color-background-primary)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--color-accent-500)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)] text-lg font-semibold">Loading available packages...</p>
        </div>
      </div>
    );
  }

  // Handle navigation to booking flow when purchase is initiated
  const handlePurchasePackage = (pkg: Package) => {
    // Navigate to package selection step with the selected package
    window.location.href = `/booking/packages?packageId=${pkg.id}`;
  };

  return (
    <AppShell>
      <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Available Packages</h1>
        <p className="text-[var(--color-text-secondary)] mt-2">Choose the perfect package for your spiritual journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="bg-[var(--color-surface-primary)] border-[var(--color-border-500)] text-[var(--color-text-primary)] hover:border-[var(--color-accent-500)]/50 transition-all">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <PackageIcon className="w-5 h-5 text-[var(--color-accent-500)]" />
                  <CardTitle className="text-lg">{pkg.name}</CardTitle>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[var(--color-accent-500)]">
                    {pkg.packagePrices && pkg.packagePrices.length > 0
                      ? <>
                          {pkg.packagePrices[0].currency.symbol}
                          {typeof pkg.packagePrices[0].price === 'number' && !isNaN(pkg.packagePrices[0].price)
                            ? pkg.packagePrices[0].price.toFixed(2)
                            : <span className="text-red-400 text-sm" title={`Raw value: ${pkg.packagePrices[0].price}`}>
                                {pkg.packagePrices[0].price !== undefined && pkg.packagePrices[0].price !== null ? String(pkg.packagePrices[0].price) : 'Contact for price'}
                              </span>
                          }
                        </>
                      : 'Price TBD'
                    }
                  </div>
                  <div className="text-sm text-[var(--color-text-secondary)]">
                    {pkg.packagePrices && pkg.packagePrices.length > 0 
                      ? pkg.packagePrices[0].currency.code 
                      : 'USD'
                    }
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[var(--color-text-secondary)] text-sm">{pkg.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-[var(--color-text-secondary)]">
                  <ClockIcon className="w-4 h-4" />
                  <span>{pkg.sessionDuration?.duration_minutes === 60 ? '1 hour' : `${pkg.sessionDuration?.duration_minutes || 'N/A'} minutes`} per session</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-[var(--color-text-secondary)]">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Valid for 30 days</span>
                </div>
              </div>

              {pkg.features && pkg.features.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-[var(--color-text-primary)]">Features:</h4>
                  <ul className="space-y-1">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="text-sm text-[var(--color-text-secondary)]">• {feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4">
                <Button
                  className="w-full bg-[var(--color-accent-500)] text-[var(--color-accent-foreground)] hover:bg-[var(--color-accent-600)]"
                  onClick={() => handlePurchasePackage(pkg)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Purchase Package
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Information */}
      <div className="mt-12">
        <Card className="bg-[var(--color-surface-primary)] border-[var(--color-border-500)]">
          <CardHeader>
            <CardTitle className="text-[var(--color-text-primary)]">About Our Packages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-[var(--color-accent-500)]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <PackageIcon className="w-6 h-6 text-[var(--color-accent-500)]" />
                </div>
                <h3 className="text-[var(--color-text-primary)] font-semibold mb-2">Flexible Sessions</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  Choose from various session lengths and types to suit your needs
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-[var(--color-accent-500)]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CalendarIcon className="w-6 h-6 text-[var(--color-accent-500)]" />
                </div>
                <h3 className="text-[var(--color-text-primary)] font-semibold mb-2">30-Day Validity</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  All packages are valid for 30 days from purchase, giving you flexibility to use your sessions
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-[var(--color-accent-500)]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShoppingCart className="w-6 h-6 text-[var(--color-accent-500)]" />
                </div>
                <h3 className="text-[var(--color-text-primary)] font-semibold mb-2">Secure Payment</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  Safe and secure payment processing with multiple payment options
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </AppShell>
  );
}
