import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import InputField from './InputField';
import SelectField from './SelectField';

const PlanModal = ({ isOpen, onClose, initialPlan }) => {
  const initialFormState = {
    shopOwnerName: '',
    mobileNumber: '',
    shopName: '',
    shopSlug: '',
    adminEmail: '',
    selectedPlan: '',
    note: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, selectedPlan: initialPlan || 'Monthly – ₹199' }));
      setErrors({});
    }
  }, [isOpen, initialPlan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-format slug if shopName changes
    if (name === 'shopName') {
      const autoSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, [name]: value, shopSlug: autoSlug }));
      setErrors(prev => ({ ...prev, [name]: '', shopSlug: '' }));
      return;
    }
    
    // Format mobile number to only accept numbers
    if (name === 'mobileNumber') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      setErrors(prev => ({ ...prev, [name]: '' }));
      return;
    }
    
    // Format slug to only accept a-z0-9-
    if (name === 'shopSlug') {
      const slugValue = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
      setFormData(prev => ({ ...prev, [name]: slugValue }));
      setErrors(prev => ({ ...prev, [name]: '' }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.shopOwnerName.trim()) newErrors.shopOwnerName = 'Shop Owner Name is required';
    if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile Number is required';
    else if (formData.mobileNumber.length !== 10) newErrors.mobileNumber = 'Mobile Number must be exactly 10 digits';
    
    if (!formData.shopName.trim()) newErrors.shopName = 'Shop Name is required';
    
    if (!formData.shopSlug.trim()) newErrors.shopSlug = 'Shop Slug is required';
    else if (!/^[a-z0-9-]+$/.test(formData.shopSlug)) newErrors.shopSlug = 'Only lowercase letters, numbers, and hyphens allowed';
    
    if (!formData.adminEmail.trim()) newErrors.adminEmail = 'Admin Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) newErrors.adminEmail = 'Invalid email address';
    
    if (!formData.selectedPlan) newErrors.selectedPlan = 'Plan selection is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Simulate network delay for better UX
    setTimeout(() => {
      const message = `Hello PrintEase Team,

I would like to request activation for a new shop subscription. Below are the details:

*Shop Owner:* ${formData.shopOwnerName}
*Mobile Number:* ${formData.mobileNumber}
*Admin Email:* ${formData.adminEmail}

*Shop Name:* ${formData.shopName}
*Shop Slug:* ${formData.shopSlug}
*Selected Plan:* ${formData.selectedPlan}
${formData.note ? `\n*Additional Note:*\n${formData.note}\n` : ''}
Please review my request and guide me through the next steps for activation.

Thank you!`;
      
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/917303028574?text=${encodedMessage}`;
      
      setIsSubmitting(false);
      onClose();
      window.open(whatsappUrl, '_blank');
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <h3 className="text-xl font-bold text-slate-800">Complete Your Request</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <InputField label="Shop Owner Name" name="shopOwnerName" value={formData.shopOwnerName} onChange={handleChange} error={errors.shopOwnerName} placeholder="e.g. John Doe" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField label="Mobile Number" name="mobileNumber" type="tel" value={formData.mobileNumber} onChange={handleChange} error={errors.mobileNumber} placeholder="10-digit number" />
            <InputField label="Admin Email" name="adminEmail" type="email" value={formData.adminEmail} onChange={handleChange} error={errors.adminEmail} placeholder="owner@shop.com" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField label="Shop Name" name="shopName" value={formData.shopName} onChange={handleChange} error={errors.shopName} placeholder="e.g. Campus Print" />
            <InputField label="Shop Slug" name="shopSlug" value={formData.shopSlug} onChange={handleChange} error={errors.shopSlug} placeholder="e.g. campus-print" />
          </div>
          
          <SelectField 
            label="Select Plan" 
            name="selectedPlan" 
            value={formData.selectedPlan} 
            onChange={handleChange} 
            error={errors.selectedPlan}
            options={[
              { value: 'Monthly – ₹199', label: 'Monthly – ₹199' },
              { value: 'Quarterly – ₹549', label: 'Quarterly – ₹549' },
              { value: 'Half-Yearly – ₹999', label: 'Half-Yearly – ₹999' }
            ]} 
          />

          <div className="flex flex-col space-y-1.5 w-full text-left">
            <label className="text-sm font-medium text-slate-700">Additional Note <span className="text-slate-400 font-normal">(Optional)</span></label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Any specific requirements or questions..."
              rows="2"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16b38a]/50 focus:border-[#16b38a] transition-all bg-white text-slate-900 placeholder:text-slate-400 resize-none"
            ></textarea>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center py-3.5 px-6 rounded-xl bg-[#16b38a] hover:bg-[#139c78] text-text-primary font-bold transition-all shadow-lg shadow-[#16b38a]/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                'Continue on WhatsApp'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanModal;
