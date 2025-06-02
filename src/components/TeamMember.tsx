import { Linkedin } from 'lucide-react';

export interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
  linkedinUrl: string;
  bio: string;
}

interface TeamMemberProps {
  member: TeamMember;
}

const TeamMember = ({ member }: TeamMemberProps) => {
  return (
    <div className="card p-6 flex flex-col items-center text-center">
      <img
        src={member.imageUrl}
        alt={member.name}
        className="w-32 h-32 rounded-full object-cover mb-4"
      />
      <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
      <p className="text-primary-600 text-sm mb-3">{member.role}</p>
      <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
      <a
        href={member.linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary-600 hover:text-primary-700 flex items-center gap-2"
      >
        <Linkedin size={20} />
        <span>Connect on LinkedIn</span>
      </a>
    </div>
  );
};

export default TeamMember;

export { TeamMember }