'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const PricingActions = ({ 
  onSave, 
  onCopyWeek, 
  onCreateTemplate, 
  onSurgeModal, 
  onEventCoupon,
  hasUnsavedChanges 
}) => {
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [copyWeekData, setCopyWeekData] = useState({
    targetWeeks: [],
    locations: []
  });
  const [templateData, setTemplateData] = useState({
    name: '',
    description: ''
  });

  const locations = [
    'Pacs',
    '11 ST',
    '54 Flagler',
    '18 Lincoln',
    '72 Park'
  ];

  const getNextWeeks = () => {
    const weeks = [];
    const today = new Date();
    
    for (let i = 1; i <= 8; i++) {
      const weekStart = new Date(today);
      weekStart?.setDate(today?.getDate() + (i * 7) - today?.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd?.setDate(weekEnd?.getDate() + 6);
      
      weeks?.push({
        value: weekStart?.toISOString(),
        label: `${weekStart?.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })} - ${weekEnd?.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })}`
      });
    }
    
    return weeks;
  };

  const handleCopyWeek = () => {
    if (copyWeekData?.targetWeeks?.length > 0 && copyWeekData?.locations?.length > 0) {
      onCopyWeek(copyWeekData);
      setShowCopyModal(false);
      setCopyWeekData({ targetWeeks: [], locations: [] });
    }
  };

  const handleCreateTemplate = () => {
    if (templateData?.name?.trim()) {
      onCreateTemplate(templateData);
      setShowTemplateModal(false);
      setTemplateData({ name: '', description: '' });
    }
  };

  const toggleWeekSelection = (weekValue) => {
    setCopyWeekData(prev => ({
      ...prev,
      targetWeeks: prev?.targetWeeks?.includes(weekValue)
        ? prev?.targetWeeks?.filter(w => w !== weekValue)
        : [...prev?.targetWeeks, weekValue]
    }));
  };

  const toggleLocationSelection = (location) => {
    setCopyWeekData(prev => ({
      ...prev,
      locations: prev?.locations?.includes(location)
        ? prev?.locations?.filter(l => l !== location)
        : [...prev?.locations, location]
    }));
  };

  return (
    <>
      <div className="bg-white border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Pricing Actions</h3>
            <p className="text-sm text-muted-foreground">
              Save changes, copy configurations, and manage templates
            </p>
          </div>
          {hasUnsavedChanges && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-warning/10 text-warning rounded-full">
              <Icon name="ExclamationTriangleIcon" size={16} />
              <span className="text-sm font-medium">Unsaved changes</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Save Configuration */}
          <button
            onClick={onSave}
            className={`flex items-center space-x-3 p-4 border-2 rounded-lg transition-micro ${
              hasUnsavedChanges
                ? 'border-primary bg-primary text-white hover:bg-primary/90' :'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
            }`}
          >
            <Icon name="CheckIcon" size={20} />
            <div className="text-left">
              <div className="font-medium">Save Configuration</div>
              <div className="text-sm opacity-80">Apply pricing changes</div>
            </div>
          </button>

          {/* Copy Week */}
          <button
            onClick={() => setShowCopyModal(true)}
            className="flex items-center space-x-3 p-4 border-2 border-border text-muted-foreground hover:border-primary/50 hover:text-foreground rounded-lg transition-micro"
          >
            <Icon name="DocumentDuplicateIcon" size={20} />
            <div className="text-left">
              <div className="font-medium">Copy Week</div>
              <div className="text-sm opacity-80">Duplicate to other weeks</div>
            </div>
          </button>

          {/* Create Template */}
          <button
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center space-x-3 p-4 border-2 border-border text-muted-foreground hover:border-primary/50 hover:text-foreground rounded-lg transition-micro"
          >
            <Icon name="BookmarkIcon" size={20} />
            <div className="text-left">
              <div className="font-medium">Save as Template</div>
              <div className="text-sm opacity-80">Create reusable preset</div>
            </div>
          </button>

          {/* Surge Pricing */}
          <button
            onClick={onSurgeModal}
            className="flex items-center space-x-3 p-4 border-2 border-border text-muted-foreground hover:border-primary/50 hover:text-foreground rounded-lg transition-micro"
          >
            <Icon name="BoltIcon" size={20} />
            <div className="text-left">
              <div className="font-medium">Surge Pricing</div>
              <div className="text-sm opacity-80">Dynamic rate adjustments</div>
            </div>
          </button>

          {/* Event Coupons */}
          <button
            onClick={onEventCoupon}
            className="flex items-center space-x-3 p-4 border-2 border-border text-muted-foreground hover:border-primary/50 hover:text-foreground rounded-lg transition-micro"
          >
            <Icon name="TicketIcon" size={20} />
            <div className="text-left">
              <div className="font-medium">Event Coupons</div>
              <div className="text-sm opacity-80">Special promotions</div>
            </div>
          </button>
        </div>
      </div>
      {/* Copy Week Modal */}
      {showCopyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1200">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Copy Week Configuration</h3>
              <button
                onClick={() => setShowCopyModal(false)}
                className="p-1 hover:bg-muted rounded-lg transition-micro"
              >
                <Icon name="XMarkIcon" size={20} className="text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Target Weeks */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Copy to weeks:
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {getNextWeeks()?.map((week) => (
                    <label key={week?.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={copyWeekData?.targetWeeks?.includes(week?.value)}
                        onChange={() => toggleWeekSelection(week?.value)}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">{week?.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Target Locations */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Apply to locations:
                </label>
                <div className="space-y-2">
                  {locations?.map((location) => (
                    <label key={location} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={copyWeekData?.locations?.includes(location)}
                        onChange={() => toggleLocationSelection(location)}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">{location}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCopyModal(false)}
                className="flex-1 px-4 py-2 text-muted-foreground border border-border rounded-lg hover:bg-muted transition-micro"
              >
                Cancel
              </button>
              <button
                onClick={handleCopyWeek}
                disabled={copyWeekData?.targetWeeks?.length === 0 || copyWeekData?.locations?.length === 0}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-micro"
              >
                Copy Configuration
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Create Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1200">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Save as Template</h3>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-1 hover:bg-muted rounded-lg transition-micro"
              >
                <Icon name="XMarkIcon" size={20} className="text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  value={templateData?.name}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, name: e?.target?.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Weekend Premium Rates"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={templateData?.description}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, description: e?.target?.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows="3"
                  placeholder="Describe when to use this template..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="flex-1 px-4 py-2 text-muted-foreground border border-border rounded-lg hover:bg-muted transition-micro"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTemplate}
                disabled={!templateData?.name?.trim()}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-micro"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

PricingActions.propTypes = {
  onSave: PropTypes?.func?.isRequired,
  onCopyWeek: PropTypes?.func?.isRequired,
  onCreateTemplate: PropTypes?.func?.isRequired,
  onSurgeModal: PropTypes?.func?.isRequired,
  onEventCoupon: PropTypes?.func?.isRequired,
  hasUnsavedChanges: PropTypes?.bool?.isRequired
};

export default PricingActions;