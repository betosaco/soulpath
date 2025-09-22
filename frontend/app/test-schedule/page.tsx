'use client';

import React, { useState, useEffect } from 'react';

export default function TestSchedulePage() {
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Ensure component hydrates properly
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    console.log('🔄 TestSchedulePage useEffect triggered');
    setIsHydrated(true);
    
    const fetchSlots = async () => {
      try {
        console.log('🔄 Fetching slots...');
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/teacher-schedule-slots?available=true&startDate=2025-09-15&endDate=2025-09-21');
        console.log('📊 Response status:', response.status);
        
        const data = await response.json();
        console.log('📊 Response data:', data);
        
        if (data.success) {
          console.log('✅ Setting slots:', data.slots.length, 'slots');
          setSlots(data.slots);
        } else {
          console.log('❌ API error:', data.error);
          setError(data.error || 'Failed to fetch schedule slots');
        }
      } catch (err) {
        console.error('❌ Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        console.log('🏁 Setting loading to false');
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  // Show loading state only if not hydrated or actually loading
  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-8">Test Schedule Page</h1>
      <div className="mb-4">
        <p className="text-lg">Found {slots.length} schedule slots</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slots.map((slot, index) => (
          <div 
            key={slot.id || index}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => {
              console.log('🎯 Slot clicked:', slot);
              alert(`Selected: ${slot.date} at ${slot.time} with ${slot.teacher?.name}`);
            }}
          >
            <h3 className="font-semibold">{slot.date}</h3>
            <p className="text-gray-600">{slot.time}</p>
            <p className="text-sm text-gray-500">{slot.teacher?.name}</p>
            <p className="text-sm text-gray-500">{slot.serviceType?.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}