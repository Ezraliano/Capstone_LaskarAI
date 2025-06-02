import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Scan {
  id: string;
  date: string;
  imageUrl: string;
  findings: {
    conditions: number;
    severity: 'healthy' | 'mild' | 'moderate' | 'severe';
  };
}

interface ScanCardProps {
  scan: Scan;
}

const ScanCard = ({ scan }: ScanCardProps) => {
  const severityClasses = {
    healthy: 'bg-green-100 text-success-500',
    mild: 'bg-yellow-100 text-warning-500',
    moderate: 'bg-orange-100 text-orange-500',
    severe: 'bg-red-100 text-error-500',
  };

  return (
    <Link to={`/results/${scan.id}`} className="card block group">
      <div className="relative overflow-hidden h-48">
        <img
          src={scan.imageUrl}
          alt={`Dental scan from ${scan.date}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
          <Calendar size={16} />
          <span>{scan.date}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700">
            {scan.findings.conditions} {scan.findings.conditions === 1 ? 'condition' : 'conditions'} detected
          </span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${severityClasses[scan.findings.severity]}`}>
            {scan.findings.severity.charAt(0).toUpperCase() + scan.findings.severity.slice(1)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ScanCard;