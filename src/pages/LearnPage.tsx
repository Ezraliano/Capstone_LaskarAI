import { useState, useEffect } from 'react';
import { Search, BookOpen, FileText, Users, ArrowLeft } from 'lucide-react';
import ConditionCard, { DentalCondition } from '../components/ConditionCard';
import DentalCariesPage from '../components/conditions/DentalCariesPage';
import CrackedToothPage from '../components/conditions/CrackedToothPage';
import GingivitisPage from '../components/conditions/GingivitisPage';

interface Study {
  title: string;
  authors: string[];
  journal: string;
  year: number;
  abstract: string;
  link: string;
}

const studies: Study[] = [
  {
    title: "Deep learning for caries detection: A systematic review",
    authors: ["Hossein Mohammad-Rahimi.", "Saeed Reza Motamedian.", "Mohammad Hossein Rohban.", "Joachim Krois.", "Sergio E. Uribe.", "Erfan Mahmoudinia.", "Rata Rokhshad.", "Mohadeseh Nadimi.", "Falk Schwendicke."],
    journal: "Journal of Destistry",
    year: 2022,
    abstract: "Detecting caries lesions is challenging for dentists, and deep learning models may help practitioners to increase accuracy and reliability. We aimed to systematically review deep learning studies on caries detection.",
    link: "https://www.sciencedirect.com/science/article/abs/pii/S0300571222001725"
  },
  {
    title: "An AI-Powered Method for Detecting Gingivitis",
    authors: ["Sathya Sai Ram.", "Thrisha Reddy.", "Dhanushwaran.", "S. Balamithra.", "Harisudha Kuresan"],
    journal: "International Conference on Innovattive Computing and Communication",
    year: 2025,
    abstract: "Gingivitis is a common dental illness triggered by the accumulation of plaque which has to be diagnosed and treated early to avoid the possible evolution to more advanced forms of perio- dontal diseases. This research employs machine learning methods employing XGBoost to help identify the levels of gingivitis i.e. now, mild, and severe based on clinical parameters such as plaque scores, presence of bleeding on probing, and gum color. .",
    link: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5170629"
  },
  {
    title: "Current applications and development of artificial intelligence for digital dental radiography",
    authors: ["Ramadhan Hardani Putra.", "Chiaki Doi.", "Nuborio Yoda.", "Eha Renwi Astuti.", "Keiichi Sasaki."],
    journal: "Oxford Academic",
    year: 2022,
    abstract: "In the last few years, artificial intelligence (AI) research has been rapidly developing and emerging in the field of dental and maxillofacial radiology. Dental radiography, which is commonly used in daily practices, provides an incredibly rich resource for AI development and attracted many researchers to develop its application for various purposes.",
    link: "https://academic.oup.com/dmfr/article/51/1/20210197/7261223"
  }
];

const dentalConditions: DentalCondition[] = [
  {
    id: 'caries',
    name: 'Dental Caries (Cavities)',
    description: 'Dental caries, commonly known as tooth decay or cavities, is one of the most prevalent chronic diseases worldwide. It occurs when bacteria in your mouth produce acids that gradually destroy tooth enamel.',
    imageUrl: '/Dental_Carries.jpg',
    symptoms: [
      'Toothache or pain',
      'Sensitivity to hot, cold, or sweet foods',
      'Visible holes in teeth',
      'Dark spots on tooth surfaces',
      'Pain when biting down'
    ]
  },
  {
    id: 'cracks',
    name: 'Cracked Tooth',
    description: 'A cracked tooth can range from a minor hairline fracture to a severe split in the tooth structure. Understanding the type and extent of the crack is crucial for proper treatment.',
    imageUrl: '/Cracked_Tooth.jpg',
    symptoms: [
      'Pain when chewing',
      'Sensitivity to temperature changes',
      'Intermittent pain',
      'Swelling of surrounding gums',
      'Difficulty pinpointing the exact painful tooth'
    ]
  },
  {
    id: 'gingivitis',
    name: 'Gingivitis',
    description: 'Gingivitis is the earliest stage of gum disease, characterized by inflammation of the gums. If left untreated, it can progress to more serious periodontal disease.',
    imageUrl: 'https://images.pexels.com/photos/4269693/pexels-photo-4269693.jpeg?auto=compress&cs=tinysrgb&w=600',
    symptoms: [
      'Red, swollen gums',
      'Bleeding when brushing or flossing',
      'Bad breath',
      'Receding gums',
      'Tender or sensitive gums'
    ]
  }
];

const LearnPage = () => {
  const [conditions, setConditions] = useState<DentalCondition[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'conditions' | 'studies'>('conditions');

  useEffect(() => {
    const timer = setTimeout(() => {
      setConditions(dentalConditions);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredConditions = conditions.filter((condition) =>
    condition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    condition.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudies = studies.filter((study) =>
    study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    study.abstract.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderConditionPage = () => {
    switch (selectedCondition) {
      case 'caries':
        return <DentalCariesPage />;
      case 'cracks':
        return <CrackedToothPage />;
      case 'gingivitis':
        return <GingivitisPage />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Learn About Dental Health</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Explore common dental conditions, their symptoms, and the latest research in dental health technology.
          </p>
        </div>

        {selectedCondition ? (
          <div className="mb-8">
            <button
              onClick={() => setSelectedCondition(null)}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8"
            >
              <ArrowLeft size={20} />
              <span>Back to all conditions</span>
            </button>
            {renderConditionPage()}
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-8">
              <div className="flex space-x-4 bg-gray-100 rounded-lg p-1">
                <button
                  className={`px-6 py-2 rounded-md transition-colors ${
                    activeTab === 'conditions'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                  onClick={() => setActiveTab('conditions')}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} />
                    <span>Conditions</span>
                  </div>
                </button>
                <button
                  className={`px-6 py-2 rounded-md transition-colors ${
                    activeTab === 'studies'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                  onClick={() => setActiveTab('studies')}
                >
                  <div className="flex items-center gap-2">
                    <FileText size={18} />
                    <span>Research Studies</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="relative max-w-xl mx-auto mb-12">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder={activeTab === 'conditions' ? "Search conditions..." : "Search studies..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Loading content...</p>
                </div>
              </div>
            ) : activeTab === 'conditions' ? (
              filteredConditions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredConditions.map((condition) => (
                    <div
                      key={condition.id}
                      onClick={() => setSelectedCondition(condition.id)}
                      className="cursor-pointer"
                    >
                      <ConditionCard condition={condition} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No conditions found</h3>
                  <p className="text-gray-500">
                    Try adjusting your search term or browse our full list of conditions.
                  </p>
                  <button
                    className="mt-4 px-4 py-2 text-primary-600 font-medium hover:text-primary-700"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear search
                  </button>
                </div>
              )
            ) : (
              <div className="space-y-6">
                {filteredStudies.map((study, index) => (
                  <div key={index} className="card p-6">
                    <h3 className="text-xl font-semibold mb-2">{study.title}</h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <Users size={16} />
                      <span>{study.authors.join(', ')}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{study.abstract}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-primary-600">
                        {study.journal}, {study.year}
                      </span>
                      <a
                        href={`${study.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        View Publication
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LearnPage;