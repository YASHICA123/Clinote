import React from 'react';

interface PatientAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PatientAvatar: React.FC<PatientAvatarProps> = ({ name, avatarUrl, size = 'md' }) => {
  const getInitials = (n: string) => {
    return n
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 text-[10px]';
      case 'lg':
        return 'w-16 h-16 text-lg';
      default:
        return 'w-12 h-12 text-sm';
    }
  };

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${getDimensions()} rounded-full object-cover border border-slate-100 shadow-sm`}
      />
    );
  }

  // Consistent background colors based on name length
  const colors = [
    'bg-emerald-50 text-emerald-700 border-emerald-100',
    'bg-blue-50 text-blue-700 border-blue-100',
    'bg-indigo-50 text-indigo-700 border-indigo-100',
    'bg-purple-50 text-purple-700 border-purple-100',
  ];
  const colorClass = colors[name.length % colors.length];

  return (
    <div className={`${getDimensions()} rounded-full flex items-center justify-center font-extrabold border shadow-sm ${colorClass}`}>
      {getInitials(name)}
    </div>
  );
};
