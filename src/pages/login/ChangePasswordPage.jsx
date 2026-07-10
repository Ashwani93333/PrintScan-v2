import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Eye, EyeOff, ShieldAlert, KeyRound } from 'lucide-react';
import Sidebar from '../../components/Sidebar';

const ChangePasswordPage = () => {
  const { user, changePassword } = useAuth();
  
  // Inputs
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Visual states
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [strength, setStrength] = useState({ score: 0, label: 'Weak', color: 'bg-danger' });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isPending, setIsPending] = useState(false);

  // Strength checker function
  const evaluateStrength = (val) => {
    let score = 0;
    if (val.length >= 8) score += 1;
    if (/[A-Z]/.test(val)) score += 1;
    if (/[0-9]/.test(val)) score += 1;
    if (/[^A-Za-z0-9]/.test(val)) score += 1;

    let label = 'Weak';
    let color = 'bg-danger w-1/4';
    if (score === 2) {
      label = 'Medium';
      color = 'bg-amber-500 w-2/4';
    } else if (score === 3) {
      label = 'Good';
      color = 'bg-blue-400 w-3/4';
    } else if (score >= 4) {
      label = 'Strong';
      color = 'bg-success w-full';
    }

    if (!val) {
      setStrength({ score: 0, label: 'None', color: 'w-0' });
    } else {
      setStrength({ score, label, color });
    }
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setNewPassword(val);
    evaluateStrength(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Client-side validation
    if (!currentPassword.trim()) {
      setErrorMsg('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      setErrorMsg('New password must be at least 8 characters long.');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setErrorMsg('New password must contain at least one uppercase letter.');
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setErrorMsg('New password must contain at least one number.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    setIsPending(true);
    // Properly await the async changePassword call
    const response = await changePassword(currentPassword, newPassword);
    setIsPending(false);

    if (response.success) {
      setSuccessMsg('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setStrength({ score: 0, label: 'None', color: 'w-0' });
    } else {
      setErrorMsg(response.error || 'Failed to update password. Please check your current password.');
    }
  };

  const isSuper = user?.role === 'SUPER_ADMIN';

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar Nav Shell */}
      <Sidebar isSuper={isSuper} />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col text-left">
        {/* Top Header */}
        <header className="px-6 h-16 border-b border-border flex items-center justify-between bg-surface-ink">
          <h2 className="text-lg font-serif font-extrabold text-text-primary">Change Account Password</h2>
          <span className="text-xs text-muted">Secure Terminal</span>
        </header>

        {/* Content area */}
        <main className="flex-1 p-6 md:p-8 flex items-center justify-center">
          <div className="w-full max-w-md bg-surface-ink border border-border rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl animate-scale-in">
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-bold text-text-primary flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-accent" />
                Change Password
              </h3>
              <p className="text-xs text-muted">Update credentials securely. Use numbers and special symbols.</p>
            </div>

            {/* Error & Success banner displays */}
            {errorMsg && (
              <div className="p-3.5 bg-danger/10 border border-danger/25 text-xs font-semibold text-danger rounded-xl flex items-center gap-2">
                <ShieldAlert className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            
            {successMsg && (
              <div className="p-3.5 bg-success/10 border border-success/25 text-xs font-semibold text-success rounded-xl flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Current password */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs text-muted font-semibold">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text-primary transition-colors"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs text-muted font-semibold">New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text-primary transition-colors"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Visual strength meter bar */}
                {newPassword && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-bold">
                      <span className="text-muted">Password Strength:</span>
                      <span className={
                        strength.label === 'Strong' ? 'text-success' :
                        strength.label === 'Good' ? 'text-blue-400' :
                        strength.label === 'Medium' ? 'text-amber-500' : 'text-danger'
                      }>{strength.label}</span>
                    </div>
                    <div className="w-full bg-surface-dark h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs text-muted font-semibold">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`w-full pr-10 ${confirmPassword && confirmPassword !== newPassword ? 'border-danger' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text-primary transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                  <span className="text-[10px] text-danger font-semibold">Passwords do not match</span>
                )}
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 bg-accent hover:bg-accent-hover disabled:bg-accent/40 text-background font-bold rounded-xl flex items-center justify-center transition-all duration-150 shadow-xl"
              >
                {isPending ? 'Updating password...' : 'Update Password'}
              </button>

            </form>
          </div>
        </main>
      </div>

    </div>
  );
};

export default ChangePasswordPage;
