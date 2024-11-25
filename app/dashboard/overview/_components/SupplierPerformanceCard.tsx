'use client';

import React, { useState } from 'react';
import { Star, MapPin } from 'lucide-react';
import { ActionButtons } from './actions/action-buttons';

interface PerformanceType {
  color: string;
  label: string;
  ratingRange: string;
  count: number;
}

const performanceTypes: Record<string, PerformanceType> = {
  high: {
    color: '#10B981', // Emerald/teal color
    label: 'High Performance',
    ratingRange: '4.0 - 5.0',
    count: 10
  },
  medium: {
    color: '#FCD34D', // Golden yellow
    label: 'Medium Performance',
    ratingRange: '2.5 - 3.9',
    count: 25
  },
  low: {
    color: '#EF4444', // Red
    label: 'Low Performance',
    ratingRange: '0.0 - 2.4',
    count: 5
  }
};

const supplierData = {
  high: [
    {
      id: 'SUP012',
      name: 'Olympic Steel Inc.',
      location: 'New York City, USA',
      rating: 4.5
    },
    {
      id: 'SUP013',
      name: 'ABC Furniture Inc.',
      location: 'New York City, USA',
      rating: 4.5
    },
    {
      id: 'SUP014',
      name: 'Def Steel Inc.',
      location: 'New York City, USA',
      rating: 4.5
    },
    {
      id: 'SUP015',
      name: 'Olympus Coal',
      location: 'New York City, USA',
      rating: 4.5
    }
  ],
  medium: [
    {
      id: 'SUP016',
      name: 'XYZ Manufacturing',
      location: 'Chicago, USA',
      rating: 3.5
    },
    {
      id: 'SUP017',
      name: 'Global Supplies Co.',
      location: 'Boston, USA',
      rating: 3.2
    }
  ],
  low: [
    {
      id: 'SUP018',
      name: 'Local Metals Ltd.',
      location: 'Detroit, USA',
      rating: 2.0
    }
  ]
};

const SupplierPerformanceCard = () => {
  const [selectedPerformance, setSelectedPerformance] =
    useState<keyof typeof supplierData>('high');

  const getRatingChipColor = (rating: number) => {
    if (rating >= 4.0) return 'bg-green-100 text-green-800';
    if (rating >= 2.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const PerformanceLabel = ({
    type,
    className = ''
  }: {
    type: string;
    className: string;
  }) => (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center rounded-full border border-gray-900 bg-white/90 px-3 py-1 shadow-sm">
        <div
          className="mr-2 size-2 rounded-full"
          style={{ backgroundColor: performanceTypes[type].color }}
        />
        <span className="text-xs font-medium text-gray-700">
          {performanceTypes[type].label}
        </span>
      </div>
    </div>
  );

  return (
    <div className="h-full rounded-lg bg-[#f9f4ff] p-6 shadow-sm">
      {/* Header section remains the same... */}
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Supplier Performance
          </h2>
          <p className="text-sm text-muted-foreground">By High, Medium & Low</p>
        </div>
        <ActionButtons />
      </div>

      <div className="mt-6 flex flex-col items-center gap-6 xl:flex-row">
        {/* Circles Section */}

        {/* <div className="relative h-72 w-2/5"> */}
        <div className="relative h-72 w-full xl:w-[35%]">
          {/* High Performance Circle */}
          <div
            // className="absolute left-32 top-8 flex cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-105"
            className="absolute left-1/2 top-8 flex -translate-x-10 cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-105"
            style={{
              width: '180px',
              height: '180px',
              backgroundColor: performanceTypes.high.color,
              zIndex: selectedPerformance === 'high' ? 30 : 20
            }}
            onClick={() => setSelectedPerformance('high')}
          >
            <span
              className="relative z-10 text-5xl font-bold text-white"
              style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                top: '-2px' // Slight upward adjustment if needed
              }}
            >
              10
            </span>
            <PerformanceLabel type="high" className="absolute -top-8 left-0" />
          </div>

          {/* Medium Performance Circle - Yellow */}
          <div
            // className="absolute left-8 top-20 flex cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-105"
            className="absolute left-1/2 top-24 flex -translate-x-36 cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-105"
            style={{
              width: '160px',
              height: '160px',
              backgroundColor: performanceTypes.medium.color,
              zIndex: selectedPerformance === 'medium' ? 30 : 15
            }}
            onClick={() => setSelectedPerformance('medium')}
          >
            <span
              className="relative z-10 text-5xl font-bold text-white"
              style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                top: '-2px' // Slight upward adjustment if needed
              }}
            >
              25
            </span>
            <PerformanceLabel
              type="medium"
              className="absolute -bottom-0 -left-4"
            />
          </div>

          {/* Low Performance Circle - Red with Stripes */}
          {/* <div className="absolute left-64 top-32 z-30"> */}
          <div className="absolute left-1/2 top-40 z-30 -translate-x-0">
            <div
              className="relative flex size-28 cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-105"
              style={{
                backgroundColor: performanceTypes.low.color,
                zIndex: selectedPerformance === 'low' ? 30 : 10
              }}
              onClick={() => setSelectedPerformance('low')}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `repeating-linear-gradient(
                  45deg,
                  #EF4444,
               #EF4444 5px,
              #FFFFFF 5px,
              #FFFFFF 10px
)`
                }}
              />
              <span
                className="relative z-10 text-5xl font-bold text-white"
                style={{
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
                }}
              >
                5
              </span>
              <PerformanceLabel
                type="low"
                className="absolute -bottom-4 -right-10"
              />
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="w-full flex-1">
          <div className=" rounded-lg bg-white p-4 shadow-sm">
            {/* Performance Header */}
            <div className="mb-4">
              <div
                className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                style={{
                  backgroundColor: `${performanceTypes[selectedPerformance].color}15`,
                  color: performanceTypes[selectedPerformance].color
                }}
              >
                <div
                  className="mr-2 h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: performanceTypes[selectedPerformance].color
                  }}
                />
                {performanceTypes[selectedPerformance].label}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <span className="mr-1">Easework Rating Range:</span>
                <Star className="mb-1 inline h-4 w-4 text-yellow-400" />
                <span className="ml-1">
                  {performanceTypes[selectedPerformance].ratingRange}
                </span>
              </div>
            </div>

            {/* Suppliers List */}
            <div className="space-y-3">
              {supplierData[selectedPerformance].map((supplier) => (
                <div
                  key={supplier.id}
                  className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                      #{supplier.id}
                    </span>
                    <span className="font-medium text-gray-900">
                      {supplier.name}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                      <MapPin className="mr-1 h-3 w-3" />
                      {supplier.location}
                    </span>
                  </div>
                  <div
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getRatingChipColor(
                      supplier.rating
                    )}`}
                  >
                    <Star className="mr-1 h-3 w-3" />
                    {supplier.rating.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        Showing {supplierData[selectedPerformance].length}{' '}
        {performanceTypes[selectedPerformance].label.toLowerCase()} suppliers •
        Last 30 days
      </div>
    </div>
  );
};

export default SupplierPerformanceCard;
