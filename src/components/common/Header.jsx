'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useParkingContext } from '@/contexts/ParkingContext';

const Header = () => {
  const { parkingLots, selectedLot, setSelectedLot } = useParkingContext();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleLocationChange = (lotId) => {
    setSelectedLot(lotId);
    setIsLocationDropdownOpen(false);
  };

  const getCurrentLotName = () => {
    const lot = parkingLots.find(l => l.id === selectedLot);
    return lot ? lot.name : 'Select Location';
  };

  const handleLogout = () => {
    // Logout logic here
    console.log('Logging out...');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-border z-1000">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section - Logo */}
        <div className="flex items-center">
          <Link href="/dashboard-overview" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="BuildingOfficeIcon" size={20} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">LF Parking</h1>
              <p className="text-xs text-muted-foreground -mt-1">Management System</p>
            </div>
          </Link>
        </div>

        {/* Center Section - Location Selector */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <button
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 bg-surface rounded-lg border border-border hover:bg-muted transition-micro"
            >
              <Icon name="MapPinIcon" size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground hidden sm:inline">
                {getCurrentLotName()}
              </span>
              <Icon 
                name="ChevronDownIcon" 
                size={16} 
                className={`text-muted-foreground transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            {isLocationDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-border rounded-lg shadow-soft z-1100">
                <div className="py-1">
                  {parkingLots?.map((lot) => (
                    <button
                      key={lot.id}
                      onClick={() => handleLocationChange(lot.id)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-micro ${
                        selectedLot === lot.id ? 'bg-primary/5 text-primary font-medium' : 'text-foreground'
                      }`}
                    >
                      {lot.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Live Clock */}
          {isClient && (
            <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-surface rounded-lg border border-border">
              <Icon name="ClockIcon" size={16} className="text-muted-foreground" />
              <div className="text-sm">
                <div className="font-medium text-foreground">{formatTime(currentTime)}</div>
                <div className="text-xs text-muted-foreground -mt-0.5">{formatDate(currentTime)}</div>
              </div>
            </div>
          )}
        </div>

        {/* Right Section - User Menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Link 
            href="/notifications-center"
            className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-micro"
          >
            <Icon name="BellIcon" size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></span>
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 p-2 hover:bg-muted rounded-lg transition-micro"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="UserIcon" size={16} className="text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-foreground">John Manager</div>
                <div className="text-xs text-muted-foreground">Facility Admin</div>
              </div>
              <Icon name="ChevronDownIcon" size={16} className="text-muted-foreground hidden sm:block" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-border rounded-lg shadow-soft z-1100">
                <div className="py-1">
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-micro"
                  >
                    <Icon name="UserIcon" size={16} />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-micro"
                  >
                    <Icon name="CogIcon" size={16} />
                    <span>Settings</span>
                  </Link>
                  <hr className="my-1 border-border" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-error hover:bg-error/5 transition-micro"
                  >
                    <Icon name="ArrowRightOnRectangleIcon" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Clock */}
      {isClient && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-surface border-b border-border px-6 py-2">
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Icon name="ClockIcon" size={14} className="text-muted-foreground" />
            <span className="font-medium text-foreground">{formatTime(currentTime)}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{formatDate(currentTime)}</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;