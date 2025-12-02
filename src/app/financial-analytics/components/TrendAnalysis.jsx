import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const TrendAnalysis = ({ trendData, benchmarkData }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value?.toFixed(1)}%`;
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return { name: 'ArrowTrendingUpIcon', color: 'text-success' };
    if (trend < 0) return { name: 'ArrowTrendingDownIcon', color: 'text-error' };
    return { name: 'MinusIcon', color: 'text-muted-foreground' };
  };

  const getPerformanceColor = (value, benchmark) => {
    if (value >= benchmark * 1.1) return 'text-success';
    if (value >= benchmark * 0.9) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Growth Trends */}
      <div className="bg-white rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Revenue Growth Trends</h3>
          <Icon name="ChartLineIcon" size={20} className="text-muted-foreground" />
        </div>
        
        <div className="space-y-4">
          {trendData?.map((trend) => {
            const trendIcon = getTrendIcon(trend?.growth);
            return (
              <div key={trend?.period} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name={trendIcon?.name} size={20} className={trendIcon?.color} />
                  <div>
                    <div className="font-medium text-foreground">{trend?.period}</div>
                    <div className="text-sm text-muted-foreground">{formatCurrency(trend?.revenue)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${trendIcon?.color}`}>
                    {formatPercentage(trend?.growth)}
                  </div>
                  <div className="text-xs text-muted-foreground">vs previous</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Performance Benchmarks */}
      <div className="bg-white rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Performance Benchmarks</h3>
          <Icon name="ChartBarSquareIcon" size={20} className="text-muted-foreground" />
        </div>
        
        <div className="space-y-4">
          {benchmarkData?.map((benchmark) => {
            const performanceColor = getPerformanceColor(benchmark?.actual, benchmark?.target);
            const achievementRate = (benchmark?.actual / benchmark?.target) * 100;
            
            return (
              <div key={benchmark?.metric} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{benchmark?.metric}</span>
                  <span className={`text-sm font-medium ${performanceColor}`}>
                    {benchmark?.type === 'currency' ? formatCurrency(benchmark?.actual) : `${benchmark?.actual}%`}
                  </span>
                </div>
                <div className="relative">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        achievementRate >= 110 ? 'bg-success' :
                        achievementRate >= 90 ? 'bg-warning' : 'bg-error'
                      }`}
                      style={{ width: `${Math.min(achievementRate, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                    <span>Target: {benchmark?.type === 'currency' ? formatCurrency(benchmark?.target) : `${benchmark?.target}%`}</span>
                    <span>{achievementRate?.toFixed(0)}% achieved</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Seasonal Variations */}
      <div className="bg-white rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Seasonal Patterns</h3>
          <Icon name="CalendarDaysIcon" size={20} className="text-muted-foreground" />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-surface rounded-lg">
            <div className="text-2xl font-bold text-success mb-1">Q4</div>
            <div className="text-sm text-muted-foreground">Peak Season</div>
            <div className="text-xs text-success mt-1">+23% avg</div>
          </div>
          <div className="text-center p-3 bg-surface rounded-lg">
            <div className="text-2xl font-bold text-warning mb-1">Q2</div>
            <div className="text-sm text-muted-foreground">Moderate</div>
            <div className="text-xs text-warning mt-1">+8% avg</div>
          </div>
          <div className="text-center p-3 bg-surface rounded-lg">
            <div className="text-2xl font-bold text-error mb-1">Q1</div>
            <div className="text-sm text-muted-foreground">Low Season</div>
            <div className="text-xs text-error mt-1">-12% avg</div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-primary/5 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="LightBulbIcon" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">Insight</span>
          </div>
          <p className="text-sm text-foreground mt-1">
            Holiday seasons show 23% revenue increase. Consider dynamic pricing strategies for Q4.
          </p>
        </div>
      </div>
      {/* Key Metrics Summary */}
      <div className="bg-white rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Key Insights</h3>
          <Icon name="SparklesIcon" size={20} className="text-muted-foreground" />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-success/5 rounded-lg border border-success/20">
            <Icon name="CheckCircleIcon" size={20} className="text-success mt-0.5" />
            <div>
              <div className="text-sm font-medium text-foreground">Revenue Target Exceeded</div>
              <div className="text-xs text-muted-foreground">Monthly target achieved 8 days early</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-warning/5 rounded-lg border border-warning/20">
            <Icon name="ExclamationTriangleIcon" size={20} className="text-warning mt-0.5" />
            <div>
              <div className="text-sm font-medium text-foreground">Occupancy Optimization</div>
              <div className="text-xs text-muted-foreground">Peak hours showing 15% underutilization</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <Icon name="InformationCircleIcon" size={20} className="text-primary mt-0.5" />
            <div>
              <div className="text-sm font-medium text-foreground">Growth Opportunity</div>
              <div className="text-xs text-muted-foreground">VIP permits showing 32% month-over-month growth</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TrendAnalysis.propTypes = {
  trendData: PropTypes?.arrayOf(PropTypes?.shape({
    period: PropTypes?.string?.isRequired,
    revenue: PropTypes?.number?.isRequired,
    growth: PropTypes?.number?.isRequired
  }))?.isRequired,
  benchmarkData: PropTypes?.arrayOf(PropTypes?.shape({
    metric: PropTypes?.string?.isRequired,
    actual: PropTypes?.number?.isRequired,
    target: PropTypes?.number?.isRequired,
    type: PropTypes?.oneOf(['currency', 'percentage'])?.isRequired
  }))?.isRequired
};

export default TrendAnalysis;