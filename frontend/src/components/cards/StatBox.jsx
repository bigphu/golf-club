import React from 'react';

const StatBox = ({ label, value, icon: Icon, className = "" }) => (
  <div className={`p-4 bg-white rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm hover:border-primary-accent/30 transition-all group ${className}`}>
    <div className="p-2 bg-primary-accent/5 rounded-lg group-hover:bg-primary-accent group-hover:text-white transition-colors shrink-0">
      <Icon size={18} className="text-primary-accent group-hover:text-white" />
    </div>
    <div className="min-w-0">
      <div className="text-secondary-accent text-[10px] font-black uppercase opacity-60 leading-none mb-1">
        {label}
      </div>
      <div className="font-bold text-txt-primary text-sm truncate">
        {value}
      </div>
    </div>
  </div>
);

export default StatBox;