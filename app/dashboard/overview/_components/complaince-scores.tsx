import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SemicircleGauge = ({
  value = 75,
  maxValue = 100,
  width = 170,
  height = 85,
  strokeWidth = 20,
  color = '#3b82f6'
}) => {
  const percentage = value / maxValue;
  const radius = height - strokeWidth / 2;

  // Generate path for an upward-facing semi-circle
  const generatePath = (radius: number) => {
    const diameter = radius * 2;
    return `M ${strokeWidth / 2}, ${height}
            A ${radius} ${radius} 0 0 1 ${
              diameter + strokeWidth / 2
            } ${height}`;
  };

  const pathLength = Math.PI * radius;

  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative">
        <svg width={width} height={height}>
          {/* Background path */}
          <path
            d={generatePath(radius)}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Progress path */}
          <path
            d={generatePath(radius)}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength * (1 - percentage)}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Text content */}
        <div className="absolute left-1/2 top-1/3 w-full -translate-x-1/2 transform text-center">
          <div className="text-3xl font-medium">{value}</div>
          <div className="mt-1 text-xs uppercase text-gray-500">
            out of {maxValue}
          </div>
        </div>
      </div>
    </div>
  );
};

const ScoreCard = ({
  title,
  score,
  status,
  description
}: {
  title: string;
  score: number;
  status: string;
  description: string;
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'strong':
        return {
          badge: 'bg-emerald-50 text-emerald-700',
          gauge: '#10b981'
        };
      case 'moderate':
        return {
          badge: 'bg-orange-50 text-orange-700',
          gauge: '#f97316'
        };
      default:
        return {
          badge: 'bg-gray-50 text-gray-700',
          gauge: '#94a3b8'
        };
    }
  };

  const colors = getStatusColor(status);

  return (
    <Card className="w-full bg-background">
      <CardContent className="p-4">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          <Badge
            variant="secondary"
            className={`${colors.badge} rounded px-2 py-0.5 text-xs font-medium`}
          >
            {status.toUpperCase()}
          </Badge>
        </div>

        <SemicircleGauge value={score} color={colors.gauge} />

        <p className="mb-4 mt-6 px-2 text-center text-sm text-gray-500">
          {description}
        </p>

        <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700">
          Learn more
        </button>
      </CardContent>
    </Card>
  );
};

const ComplianceScores = () => {
  const scores = [
    {
      title: 'Policy Adherence',
      score: 83,
      status: 'STRONG',
      description:
        'This score measures portfolio alignment with your goals and strategy. Higher score indicates better performance.'
    },
    {
      title: 'On-Contract Spend',
      score: 42,
      status: 'MODERATE',
      description:
        'This score measures your overall security strength. Higher score means better protection. Aim to maintain or improve.'
    },
    {
      title: 'Savings achieved',
      score: 42,
      status: 'MODERATE',
      description:
        'This score measures your overall security strength. Higher score means better protection. Aim to maintain or improve.'
    }
  ];

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-col space-y-4">
        {scores.map((score, index) => (
          <ScoreCard key={index} {...score} />
        ))}
      </div>
    </div>
  );
};

export default ComplianceScores;
