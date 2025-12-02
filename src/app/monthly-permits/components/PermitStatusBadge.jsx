import PropTypes from 'prop-types';

const PermitStatusBadge = ({ status, expiryDate }) => {
  const getStatusConfig = (status, expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (status === 'expired' || daysUntilExpiry < 0) {
      return {
        label: 'Expired',
        className: 'bg-error/10 text-error border-error/20'
      };
    }

    if (daysUntilExpiry <= 7) {
      return {
        label: 'Expiring Soon',
        className: 'bg-warning/10 text-warning border-warning/20'
      };
    }

    if (status === 'active') {
      return {
        label: 'Active',
        className: 'bg-success/10 text-success border-success/20'
      };
    }

    return {
      label: 'Inactive',
      className: 'bg-muted text-muted-foreground border-border'
    };
  };

  const config = getStatusConfig(status, expiryDate);

  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${config?.className}`}>
      {config?.label}
    </span>
  );
};

PermitStatusBadge.propTypes = {
  status: PropTypes?.string?.isRequired,
  expiryDate: PropTypes?.string?.isRequired
};

export default PermitStatusBadge;