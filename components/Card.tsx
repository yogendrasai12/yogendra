import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, selected }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl border transition-all duration-200
        ${selected 
          ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-indigo-100' 
          : 'border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md'}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};