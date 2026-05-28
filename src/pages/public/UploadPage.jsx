import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDb } from '../../context/DbContext';
import { 
  ArrowLeft, 
  User, 
  Sliders, 
  UploadCloud, 
  CheckCircle2, 
  Copy, 
  ArrowRight,
  Printer
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import FileUploadZone from '../../components/FileUploadZone';

const UploadPage = () => {
  const { slug } = useParams();
  const { shops, submitPrintJob } = useDb();
  const navigate = useNavigate();

  // Find shop
  const shop = shops.find(s => s.slug === slug);

  // States
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  const [files, setFiles] = useState([]);
  
  const [colorPrint, setColorPrint] = useState(false);
  const [paperSize, setPaperSize] = useState('A4');
  const [copies, setCopies] = useState(1);
  const [doubleSided, setDoubleSided] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  if (!shop) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <h2 className="text-2xl font-serif font-bold text-white">Shop Not Found</h2>
          <Link to="/shops" className="px-5 py-2.5 rounded-xl bg-accent text-background font-semibold text-sm hover:bg-accent-hover transition-colors">
            Back to Directory
          </Link>
        </main>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (files.length === 0) {
      setErrorMsg('Please upload at least one document to print.');
      return;
    }

    setIsSubmitting(true);

    // Simulate small dispatch network delay for authentic micro-interactions
    setTimeout(() => {
      const response = submitPrintJob(
        slug,
        { fullName, phone, email },
        { colorPrint, paperSize, copies, doubleSided, specialInstructions },
        files
      );

      setIsSubmitting(false);

      if (response.success) {
        setSuccessData({
          token: response.token,
          job: response.job
        });
      } else {
        setErrorMsg(response.error || 'Failed to submit the print job.');
      }
    }, 1200);
  };

  const copyToClipboard = () => {
    if (successData) {
      navigator.clipboard.writeText(successData.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          {/* Back button */}
          <div className="text-left">
            <Link 
              to={`/shops/${slug}`} 
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to {shop.name}
            </Link>
          </div>

          {!successData ? (
            /* Upload Form */
            <form onSubmit={handleSubmit} className="space-y-6 text-left animate-fade-in">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">Configure Your Print</h1>
                <p className="text-xs text-muted">Submit files directly to the queue at <span className="text-accent font-semibold">{shop.name}</span>.</p>
              </div>

              {/* Form errors */}
              {errorMsg && (
                <div className="p-4 bg-danger/10 border border-danger/25 text-xs font-semibold text-danger rounded-xl">
                  {errorMsg}
                </div>
              )}

              {/* Section 1: Customer info */}
              <div className="bg-surface-ink border border-border rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2 border-b border-border/40 pb-2.5">
                  <User className="w-4 h-4 text-accent" />
                  1. Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs text-muted font-semibold">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Amit Kumar"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs text-muted font-semibold">Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 99887 76655"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5 pt-1">
                  <label className="text-xs text-muted font-semibold">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="e.g. amit.kumar@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Section 2: Drag & drop uploader */}
              <div className="bg-surface-ink border border-border rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2 border-b border-border/40 pb-2.5">
                  <UploadCloud className="w-4 h-4 text-accent" />
                  2. Upload Documents
                </h3>
                <FileUploadZone
                  acceptedFormats={shop.requirements.acceptedFormats}
                  maxFileSizeMb={shop.requirements.maxFileSizeMb}
                  maxFiles={shop.requirements.maxFilesPerJob}
                  onFilesChange={setFiles}
                />
              </div>

              {/* Section 3: Print Options */}
              <div className="bg-surface-ink border border-border rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2 border-b border-border/40 pb-2.5">
                  <Sliders className="w-4 h-4 text-accent" />
                  3. Print Preferences
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Toggle Color Print */}
                  <div className="flex items-center justify-between p-3 bg-surface-dark/40 border border-border rounded-xl">
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-white block">Color Mode</span>
                      <span className="text-[10px] text-muted block">Select full color or grayscale</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={colorPrint} 
                        onChange={(e) => setColorPrint(e.target.checked)} 
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-surface-ink peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-muted after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent peer-checked:after:bg-background"></div>
                    </label>
                  </div>

                  {/* Toggle Double Sided */}
                  <div className="flex items-center justify-between p-3 bg-surface-dark/40 border border-border rounded-xl">
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-white block">Double-Sided</span>
                      <span className="text-[10px] text-muted block">Duplex double-sided printing</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={doubleSided} 
                        onChange={(e) => setDoubleSided(e.target.checked)} 
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-surface-ink peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-muted after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent peer-checked:after:bg-background"></div>
                    </label>
                  </div>

                  {/* Select Dropdown Paper Size */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs text-muted font-semibold">Paper Size</label>
                    <select
                      value={paperSize}
                      onChange={(e) => setPaperSize(e.target.value)}
                    >
                      <option value="A4">A4 (Standard)</option>
                      <option value="A3">A3 (Large Poster)</option>
                      <option value="Letter">Letter</option>
                      <option value="Legal">Legal</option>
                    </select>
                  </div>

                  {/* Copies count */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs text-muted font-semibold">Number of Copies</label>
                    <input
                      type="number"
                      min="1"
                      value={copies}
                      onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                    />
                  </div>
                </div>

                {/* Special instructions */}
                <div className="flex flex-col space-y-1.5 pt-2">
                  <label className="text-xs text-muted font-semibold">Special Instructions (Stapling, binding, binding orientation...)</label>
                  <textarea
                    rows="3"
                    placeholder="e.g. Please bind the pages with a corner staple, landscape layout..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                  />
                </div>
              </div>

              {/* Submit Dispatch Action */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-accent hover:bg-accent-hover disabled:bg-accent/40 disabled:cursor-not-allowed text-background font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <Printer className="w-5 h-5 animate-spin" />
                    Transmitting documents into queue...
                  </>
                ) : (
                  <>
                    Submit Print Job
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* After Submit Success Card Screen */
            <div className="bg-surface-ink border border-border rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-scale-in">
              <div className="flex justify-center">
                <div className="p-4 bg-success/10 text-success rounded-full border border-success/20 animate-bounce">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">Job Submitted Successfully!</h1>
                <p className="text-sm text-muted">
                  Your files have been routed into the print buffer queue of <span className="text-white font-semibold">{shop.name}</span>.
                </p>
              </div>

              {/* Monospace token display wrapper */}
              <div className="p-6 bg-surface-dark border border-border rounded-2xl max-w-sm mx-auto space-y-3.5">
                <span className="text-[10px] text-muted font-bold tracking-widest uppercase block">YOUR TRACKING TOKEN</span>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-mono text-3xl sm:text-4xl text-accent font-extrabold text-glow-amber">
                    {successData.token}
                  </span>
                  <button 
                    onClick={copyToClipboard}
                    className="p-2 bg-surface-ink hover:bg-surface-ink/75 border border-border/80 hover:border-accent/40 rounded-lg text-muted hover:text-accent transition-all duration-150"
                    title="Copy Token"
                  >
                    {copied ? (
                      <span className="text-[10px] font-bold text-success">Copied!</span>
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-muted leading-relaxed">
                  Save this token carefully — you will need to present it at the counter or search to track progress live.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto pt-2">
                <Link
                  to={`/track/${successData.token}`}
                  className="flex-1 py-3 text-sm font-semibold bg-accent text-background hover:bg-accent-hover rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-150"
                >
                  Track My Job
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/shops"
                  className="flex-1 py-3 text-sm font-semibold bg-surface-dark border border-border text-white hover:bg-primary/20 rounded-xl transition-colors"
                >
                  Back to Directory
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-6 mt-12 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 text-center text-xs text-muted">
        <p>&copy; {new Date().getFullYear()} PrintEase SaaS platform.</p>
      </footer>
    </div>
  );
};

export default UploadPage;
