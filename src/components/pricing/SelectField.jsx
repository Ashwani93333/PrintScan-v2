import React from 'react';

const SelectField = ({ label, name, value, onChange, options, error }) => {
  return (
    <div className="flex flex-col space-y-1.5 w-full text-left">
      <label className="text-sm font-medium text-slate-700">{label} <span className="text-red-500">*</span></label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2.5 rounded-xl border ${error ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#16b38a]/50 focus:border-[#16b38a] transition-all bg-white text-slate-900 appearance-none cursor-pointer`}
      >
        <option value="" disabled>Select a plan</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500 mt-1 font-medium">{error}</span>}
    </div>
  );
};

export default SelectField;
