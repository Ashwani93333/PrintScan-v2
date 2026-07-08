import React from 'react';

const InputField = ({ label, name, type = 'text', value, onChange, error, placeholder }) => {
  return (
    <div className="flex flex-col space-y-1.5 w-full text-left">
      <label className="text-sm font-medium text-slate-700">{label} <span className="text-red-500">*</span></label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl border ${error ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#16b38a]/50 focus:border-[#16b38a] transition-all bg-white text-slate-900 placeholder:text-slate-400`}
      />
      {error && <span className="text-xs text-red-500 mt-1 font-medium">{error}</span>}
    </div>
  );
};

export default InputField;
