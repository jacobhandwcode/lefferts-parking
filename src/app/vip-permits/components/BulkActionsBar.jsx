'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const BulkActionsBar = ({ selectedCount, onBulkAction, onClearSelection }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const handleBulkAction = (action) => {
    if (action === 'delete' || action === 'suspend') {
      setPendingAction(action);
      setShowConfirmDialog(true);
    } else {
      onBulkAction(action);
    }
  };

  const confirmAction = () => {
    if (pendingAction) {
      onBulkAction(pendingAction);
      setShowConfirmDialog(false);
      setPendingAction(null);
    }
  };

  const cancelAction = () => {
    setShowConfirmDialog(false);
    setPendingAction(null);
  };

  const getActionConfig = (action) => {
    const configs = {
      activate: {
        label: 'Activate',
        icon: 'PlayIcon',
        color: 'text-success hover:bg-success/10'
      },
      suspend: {
        label: 'Suspend',
        icon: 'PauseIcon',
        color: 'text-warning hover:bg-warning/10'
      },
      export: {
        label: 'Export CSV',
        icon: 'DocumentArrowDownIcon',
        color: 'text-primary hover:bg-primary/10'
      },
      delete: {
        label: 'Delete',
        icon: 'TrashIcon',
        color: 'text-error hover:bg-error/10'
      }
    };
    return configs?.[action];
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-border rounded-lg shadow-soft p-4 z-1100">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircleIcon" size={20} className="text-primary" />
            <span className="text-sm font-medium text-foreground">
              {selectedCount} permit{selectedCount > 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="h-6 w-px bg-border"></div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBulkAction('activate')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-micro ${getActionConfig('activate')?.color}`}
            >
              <Icon name={getActionConfig('activate')?.icon} size={16} />
              <span className="text-sm">{getActionConfig('activate')?.label}</span>
            </button>

            <button
              onClick={() => handleBulkAction('suspend')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-micro ${getActionConfig('suspend')?.color}`}
            >
              <Icon name={getActionConfig('suspend')?.icon} size={16} />
              <span className="text-sm">{getActionConfig('suspend')?.label}</span>
            </button>

            <button
              onClick={() => handleBulkAction('export')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-micro ${getActionConfig('export')?.color}`}
            >
              <Icon name={getActionConfig('export')?.icon} size={16} />
              <span className="text-sm">{getActionConfig('export')?.label}</span>
            </button>

            <button
              onClick={() => handleBulkAction('delete')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-micro ${getActionConfig('delete')?.color}`}
            >
              <Icon name={getActionConfig('delete')?.icon} size={16} />
              <span className="text-sm">{getActionConfig('delete')?.label}</span>
            </button>
          </div>

          <div className="h-6 w-px bg-border"></div>

          <button
            onClick={onClearSelection}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-micro"
            title="Clear Selection"
          >
            <Icon name="XMarkIcon" size={16} />
          </button>
        </div>
      </div>
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1200 p-4">
          <div className="bg-white rounded-lg shadow-soft w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  pendingAction === 'delete' ? 'bg-error/10' : 'bg-warning/10'
                }`}>
                  <Icon 
                    name={pendingAction === 'delete' ? 'ExclamationTriangleIcon' : 'ExclamationCircleIcon'} 
                    size={24} 
                    className={pendingAction === 'delete' ? 'text-error' : 'text-warning'} 
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Confirm {pendingAction === 'delete' ? 'Deletion' : 'Suspension'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    This action will affect {selectedCount} permit{selectedCount > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                {pendingAction === 'delete' 
                  ? 'Are you sure you want to permanently delete the selected VIP permits? This action cannot be undone.' :'Are you sure you want to suspend the selected VIP permits? They will lose access until reactivated.'
                }
              </p>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={cancelAction}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-micro"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className={`px-4 py-2 text-white rounded-lg transition-micro ${
                    pendingAction === 'delete' 
                      ? 'bg-error hover:bg-error/90' :'bg-warning hover:bg-warning/90'
                  }`}
                >
                  {pendingAction === 'delete' ? 'Delete' : 'Suspend'} Permits
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

BulkActionsBar.propTypes = {
  selectedCount: PropTypes?.number?.isRequired,
  onBulkAction: PropTypes?.func?.isRequired,
  onClearSelection: PropTypes?.func?.isRequired
};

export default BulkActionsBar;