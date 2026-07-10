import React, { useState } from 'react';
import PricingCard from './PricingCard';
import PlanModal from './PlanModal';

const PricingSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanStr, setSelectedPlanStr] = useState('');

  const handleSelectPlan = (planStr) => {
    setSelectedPlanStr(planStr);
    setIsModalOpen(true);
  };

  const monthlyFeatures = [
    { text: 'QR-Based Order System' },
    { text: 'Full Dashboard Access' },
    { text: 'Auto Page Detection' }
  ];

  const quarterlyFeatures = [
    { text: 'QR-Based Order System' },
    { text: 'Full Dashboard Access' },
    { text: 'Auto Page Detection' },
    { text: 'Save ₹48 vs Monthly', bold: true }
  ];

  const halfYearlyFeatures = [
    { text: 'QR-Based Order System' },
    { text: 'Full Dashboard Access' },
    { text: 'Auto Page Count Detection' },
    { text: 'Save ₹195 vs Monthly', bold: true }
  ];

  return (
    <>
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-serif font-extrabold text-text-primary">Simple, Transparent Pricing</h2>
          <p className="text-sm text-muted">Choose the perfect plan for your printing needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
          <PricingCard 
            title="Monthly" 
            price="199" 
            period="per month" 
            features={monthlyFeatures} 
            onSelectPlan={handleSelectPlan} 
          />
          <PricingCard 
            title="Quarterly" 
            price="549" 
            period="for 3 months" 
            features={quarterlyFeatures} 
            isPopular={true} 
            onSelectPlan={handleSelectPlan} 
          />
          <PricingCard 
            title="Half-Yearly" 
            price="999" 
            period="for 6 months" 
            features={halfYearlyFeatures} 
            isBestValue={true} 
            onSelectPlan={handleSelectPlan} 
          />
        </div>
      </section>

      <PlanModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialPlan={selectedPlanStr} 
      />
    </>
  );
};

export default PricingSection;
