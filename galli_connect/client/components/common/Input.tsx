import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={id}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-primary focus:border-primary shadow-sm disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
          {...props}
        />
      </div>
    </div>
  );
};