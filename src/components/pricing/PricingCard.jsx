import React from 'react';
import { Check } from 'lucide-react';

const PricingCard = ({ title, price, period, features, isPopular, isBestValue, onSelectPlan }) => {
  return (
    <div className={`bg-white rounded-[2rem] p-8 flex flex-col items-center shadow-xl transition-transform hover:scale-105 duration-300 ${isPopular ? 'border-[3px] border-[#16b38a] relative md:-translate-y-4 h-full' : 'border border-gray-100 relative h-full'}`}>
      {isPopular && (
        <div className="absolute -top-4 bg-[#16b38a] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
          Most Popular
        </div>
      )}
      {isBestValue && (
        <div className="absolute -top-4 bg-slate-900 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
          Best Value
        </div>
      )}
      
      <h3 className={`text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 ${isPopular || isBestValue ? 'mt-2' : ''}`}>
        {title}
      </h3>
      
      <div className="flex items-start text-slate-900 mb-1">
        <span className="text-2xl font-bold mt-1">₹</span>
        <span className="text-6xl font-extrabold tracking-tight">{price}</span>
      </div>
      
      <p className="text-slate-500 text-sm mb-8 font-medium">{period}</p>
      
      <ul className="w-full space-y-5 mb-8 flex-1">
        {features.map((feature, idx) => (
          <li key={idx} className={`flex items-center gap-3 text-sm ${feature.bold ? 'text-slate-900 font-bold' : 'text-slate-600 font-medium'}`}>
            <div className="rounded-full bg-emerald-100 p-1">
              <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
            </div>
            {feature.text}
          </li>
        ))}
      </ul>
      
      <button 
        onClick={() => onSelectPlan(`${title} – ₹${price}`)}
        className={`w-full py-3.5 px-6 rounded-xl font-bold transition-colors mt-auto ${
          isPopular 
            ? 'bg-[#16b38a] hover:bg-[#139c78] text-white shadow-lg shadow-[#16b38a]/30' 
            : 'border-2 border-[#16b38a] text-[#16b38a] hover:bg-[#16b38a] hover:text-white'
        }`}
      >
        Select Plan
      </button>
    </div>
  );
};

export default PricingCard;
