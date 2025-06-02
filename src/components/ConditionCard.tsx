import { ArrowRight } from 'lucide-react';

export interface DentalCondition {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  symptoms: string[];
  content?: string;
}

interface ConditionCardProps {
  condition: DentalCondition;
}

const ConditionCard = ({ condition }: ConditionCardProps) => {
  return (
    <div className="card h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={condition.imageUrl}
          alt={condition.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold mb-2">{condition.name}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{condition.description}</p>
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Common Symptoms:</h4>
          <ul className="text-sm text-gray-600">
            {condition.symptoms.slice(0, 3).map((symptom, index) => (
              <li key={index} className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                {symptom}
              </li>
            ))}
            {condition.symptoms.length > 3 && (
              <li className="text-primary-600 text-sm">
                +{condition.symptoms.length - 3} more symptoms
              </li>
            )}
          </ul>
        </div>
        <div className="flex justify-end mt-4">
          <button className="text-primary-600 hover:text-primary-700 flex items-center gap-1 text-sm font-medium">
            Learn more <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConditionCard;