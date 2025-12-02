import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const PermitFilters = ({ filters, onFilterChange }) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'expiring', label: 'Expiring Soon' },
    { value: 'expired', label: 'Expired' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const expiryOptions = [
    { value: 'all', label: 'All Permits' },
    { value: 'next_7_days', label: 'Expiring in 7 days' },
    { value: 'next_30_days', label: 'Expiring in 30 days' },
    { value: 'expired', label: 'Already Expired' }
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    { value: 'pacs', label: 'Pacs' },
    { value: '11_st', label: '11 ST' },
    { value: '54_flagler', label: '54 Flagler' },
    { value: '18_lincoln', label: '18 Lincoln' },
    { value: '72_park', label: '72 Park' }
  ];

  return (
    <div className="bg-white border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Filter Permits</h3>
        <button
          onClick={() => onFilterChange({
            status: 'all',
            expiry: 'all',
            location: 'all'
          })}
          className="text-xs text-primary hover:text-primary/80 font-medium"
        >
          Clear All
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            Status
          </label>
          <div className="relative">
            <select
              value={filters?.status}
              onChange={(e) => onFilterChange({ ...filters, status: e?.target?.value })}
              className="w-full appearance-none bg-white border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {statusOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
            <Icon 
              name="ChevronDownIcon" 
              size={16} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
            />
          </div>
        </div>

        {/* Expiry Filter */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            Expiry Period
          </label>
          <div className="relative">
            <select
              value={filters?.expiry}
              onChange={(e) => onFilterChange({ ...filters, expiry: e?.target?.value })}
              className="w-full appearance-none bg-white border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {expiryOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
            <Icon 
              name="ChevronDownIcon" 
              size={16} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
            />
          </div>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            Location
          </label>
          <div className="relative">
            <select
              value={filters?.location}
              onChange={(e) => onFilterChange({ ...filters, location: e?.target?.value })}
              className="w-full appearance-none bg-white border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {locationOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
            <Icon 
              name="ChevronDownIcon" 
              size={16} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

PermitFilters.propTypes = {
  filters: PropTypes?.shape({
    status: PropTypes?.string?.isRequired,
    expiry: PropTypes?.string?.isRequired,
    location: PropTypes?.string?.isRequired
  })?.isRequired,
  onFilterChange: PropTypes?.func?.isRequired
};

export default PermitFilters;