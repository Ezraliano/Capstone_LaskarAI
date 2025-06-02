import { Condition } from '../components/AnalysisResults';
import { Scan } from '../components/ScanCard';
import { DentalCondition } from '../components/ConditionCard';

// In a real application, this data would come from your backend/API
export const mockScans: Scan[] = [
  {
    id: 'scan-001',
    date: 'May 15, 2025',
    imageUrl: 'https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg?auto=compress&cs=tinysrgb&w=600',
    findings: {
      conditions: 2,
      severity: 'moderate'
    }
  },
  {
    id: 'scan-002',
    date: 'Apr 28, 2025',
    imageUrl: 'https://images.pexels.com/photos/3845126/pexels-photo-3845126.jpeg?auto=compress&cs=tinysrgb&w=600',
    findings: {
      conditions: 1,
      severity: 'mild'
    }
  },
  {
    id: 'scan-003',
    date: 'Apr 2, 2025',
    imageUrl: 'https://images.pexels.com/photos/3845545/pexels-photo-3845545.jpeg?auto=compress&cs=tinysrgb&w=600',
    findings: {
      conditions: 0,
      severity: 'healthy'
    }
  }
];

export const mockConditions: Record<string, Condition[]> = {
  'scan-001': [
    {
      name: 'Dental Caries',
      severity: 'moderate',
      description: 'Tooth decay detected on the molar surface with potential cavity formation.',
      location: 'Lower right molar (tooth #30)'
    },
    {
      name: 'Enamel Crack',
      severity: 'mild',
      description: 'Minor vertical crack in the enamel, early stage.',
      location: 'Upper left incisor (tooth #9)'
    }
  ],
  'scan-002': [
    {
      name: 'Gingival Inflammation',
      severity: 'mild',
      description: 'Slight inflammation of the gums, early stage gingivitis.',
      location: 'Lower front gums (teeth #23-26)'
    }
  ],
  'scan-003': [
    {
      name: 'Overall Dental Health',
      severity: 'healthy',
      description: 'No significant issues detected. Teeth and gums appear healthy.',
      location: 'All visible dental structures'
    }
  ]
};

export const mockDentalConditions: DentalCondition[] = [
  {
    id: 'caries',
    name: 'Dental Caries (Cavities)',
    description: 'Damage to a tooth caused by dental plaque bacteria, resulting in the creation of holes or structural damage.',
    imageUrl: 'https://images.pexels.com/photos/3845126/pexels-photo-3845126.jpeg?auto=compress&cs=tinysrgb&w=600',
    symptoms: ['Toothache', 'Sensitivity to hot/cold', 'Visible holes', 'Pain when eating sweets']
  },
  {
    id: 'cracks',
    name: 'Cracked Tooth',
    description: 'A crack or fracture in the tooth structure that can range from minor to severe, potentially causing pain and further complications.',
    imageUrl: 'https://images.pexels.com/photos/3845545/pexels-photo-3845545.jpeg?auto=compress&cs=tinysrgb&w=600',
    symptoms: ['Pain when chewing', 'Sensitivity to temperature', 'Intermittent pain', 'Swelling of gums']
  },
  {
    id: 'gingivitis',
    name: 'Gingivitis',
    description: 'Inflammation of the gums caused by bacterial infection, which can lead to more serious gum disease if left untreated.',
    imageUrl: 'https://images.pexels.com/photos/4269693/pexels-photo-4269693.jpeg?auto=compress&cs=tinysrgb&w=600',
    symptoms: ['Red, swollen gums', 'Bleeding when brushing', 'Bad breath', 'Receding gums']
  }
];