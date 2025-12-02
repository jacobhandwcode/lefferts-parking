'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

const Sidebar = ({ isCollapsed = false, onToggle }) => {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState({
    permits: false,
    enforcement: false,
    analytics: false
  });

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard-overview',
      icon: 'HomeIcon',
      description: 'Real-time operational overview'
    },
    {
      id: 'cameras',
      label: 'Cameras',
      path: '/camera-monitoring',
      icon: 'VideoCameraIcon',
      description: 'Live surveillance feeds'
    },
    {
      id: 'pricing',
      label: 'Pricing',
      path: '/dynamic-pricing-management',
      icon: 'CurrencyDollarIcon',
      description: 'Dynamic pricing control'
    },
    {
      id: 'permits',
      label: 'Permit Parking',
      icon: 'DocumentTextIcon',
      children: [
        {
          id: 'monthly',
          label: 'Monthly',
          path: '/monthly-permits',
          icon: 'CalendarIcon'
        },
        {
          id: 'employee',
          label: 'Employees',
          path: '/employee-permits',
          icon: 'IdentificationIcon'
        },
        {
          id: 'vip',
          label: 'VIP',
          path: '/vip-permits',
          icon: 'StarIcon'
        }
      ]
    },
    {
      id: 'enforcement',
      label: 'Enforcement',
      icon: 'ShieldCheckIcon',
      children: [
        {
          id: 'reports',
          label: 'Report',
          path: '/enforcement-reports',
          icon: 'DocumentMagnifyingGlassIcon'
        },
        {
          id: 'towing',
          label: 'Towing',
          path: '/towing-management',
          icon: 'TruckIcon'
        }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'ChartPieIcon',
      children: [
        {
          id: 'financials',
          label: 'Financials',
          path: '/financial-analytics',
          icon: 'ChartBarIcon'
        },
        {
          id: 'transient-summary',
          label: 'Transient Summary',
          path: '/analytics-transient-summary',
          icon: 'ClockIcon'
        },
        {
          id: 'transaction-report',
          label: 'Transaction Report',
          path: '/transaction-reports',
          icon: 'BanknotesIcon'
        },
        {
          id: 'all-lot-summary',
          label: 'All Lot Summary',
          path: '/analytics-all-lot-summary',
          icon: 'BuildingOfficeIcon'
        },
        {
          id: 'comps',
          label: 'COMPS',
          path: '/analytics/comps',
          icon: 'MapIcon'
        }
      ]
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      path: '/maintenance',
      icon: 'WrenchScrewdriverIcon',
      description: 'Maintenance log management'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      path: '/notifications-center',
      icon: 'BellIcon',
      description: 'System alerts and messages'
    }
  ];

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev?.[sectionId]
    }));
  };

  const isActiveItem = (path) => {
    return pathname === path;
  };

  const isActiveSection = (children) => {
    return children?.some(child => pathname === child?.path);
  };

  const renderNavItem = (item, isChild = false) => {
    const hasChildren = item?.children && item?.children?.length > 0;
    const isExpanded = expandedSections?.[item?.id];
    const isActive = isActiveItem(item?.path);
    const isSectionActive = hasChildren && isActiveSection(item?.children);

    if (hasChildren) {
      return (
        <div key={item?.id} className="mb-1">
          <button
            onClick={() => toggleSection(item?.id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-left rounded-lg transition-colors group ${
              isSectionActive 
                ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Icon 
                name={item?.icon} 
                size={20} 
                className={isSectionActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'} 
              />
              {!isCollapsed && (
                <span className="font-bold text-sm">{item?.label}</span>
              )}
            </div>
            {!isCollapsed && (
              <Icon 
                name={isExpanded ? "ChevronDownIcon" : "ChevronRightIcon"} 
                size={16} 
                className={`transition-transform ${
                  isSectionActive ? 'text-primary' : 'text-muted-foreground'
                }`} 
              />
            )}
          </button>
          {!isCollapsed && isExpanded && (
            <div className="ml-8 mt-1 space-y-1 pl-2 border-l border-muted">
              {item?.children?.map(child => renderNavItem(child, true))}
            </div>
          )}
        </div>
      );
    }

    const ItemContent = (
      <div className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors group ${
        isActive 
          ? 'bg-primary text-white shadow-sm' 
          : isChild
            ? 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}>
        <Icon 
          name={item?.icon} 
          size={isChild ? 18 : 20} 
          className={isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'} 
        />
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <div className={`text-sm ${isActive ? 'text-white font-medium' : isChild ? 'font-normal' : 'font-medium'}`}>
              {item?.label}
            </div>
            {item?.description && !isChild && (
              <div className={`text-xs mt-0.5 ${
                isActive ? 'text-white/80' : 'text-muted-foreground'
              }`}>
                {item?.description}
              </div>
            )}
          </div>
        )}
      </div>
    );

    return (
      <div key={item?.id} className="mb-1">
        {item?.path ? (
          <Link href={item?.path}>
            {ItemContent}
          </Link>
        ) : (
          ItemContent
        )}
      </div>
    );
  };

  return (
    <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-border z-1000 transition-all duration-200 ${
      isCollapsed ? 'w-16' : 'w-72'
    }`}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div>
              <h2 className="text-sm font-semibold text-foreground">Navigation</h2>
              <p className="text-xs text-muted-foreground">Parking Management</p>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <Icon 
              name={isCollapsed ? "ChevronRightIcon" : "ChevronLeftIcon"} 
              size={16} 
              className="text-muted-foreground" 
            />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navigationItems?.map(item => renderNavItem(item))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3 p-3 bg-surface rounded-lg">
              <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                <Icon name="CheckIcon" size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground">System Status</div>
                <div className="text-xs text-success">All systems operational</div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                <Icon name="CheckIcon" size={16} className="text-white" />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;