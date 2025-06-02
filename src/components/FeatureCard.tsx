
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
}

const FeatureCard = ({
  title,
  description,
  icon: Icon,
  color = 'bg-primary-100 text-primary-600',
}: FeatureCardProps) => {
  return (
    <div className="card p-6 hover:translate-y-[-5px] transition-transform duration-300">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${color}`}>
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;