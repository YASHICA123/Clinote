import React from 'react';

interface ClinoteLogoProps {
  className?: string;
  size?: number;
}

export const ClinoteLogo: React.FC<ClinoteLogoProps> = ({ 
  className = '', 
  size = 32 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer rounded rect / card outline */}
      <rect 
        x="15" 
        y="15" 
        width="70" 
        height="70" 
        rx="20" 
        stroke="#10B981" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Smart document note lines */}
      <path 
        d="M35 38H65M35 50H65M35 62H53" 
        stroke="#047857" 
        strokeWidth="6" 
        strokeLinecap="round" 
      />
      {/* Plus symbol representing clinical/medical aspect */}
      <path 
        d="M68 58V72M61 65H75" 
        stroke="#10B981" 
        strokeWidth="4" 
        strokeLinecap="round" 
      />
    </svg>
  );
};
