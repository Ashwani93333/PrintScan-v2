import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  ArrowLeft, 
  User, 
  Check, 
  Trash2, 
  Send, 
  FileText, 
  Image, 
  Wifi, 
  Plus, 
  Lock, 
  CheckCircle2, 
  Copy, 
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Info
} from 'lucide-react';
import Navbar from '../../components/Navbar';

// Client-side PDF page counter helper + format converter
const getFilePageCount = async (file) => {
  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function() {
        try {
          const text = reader.result;
          // Look for /Count followed by whitespace and numbers
          const regex = /\/Count\s+(\d+)/g;
          let matches;
          let maxPages = 0;
          while ((matches = regex.exec(text)) !== null) {
            const p = parseInt(matches[1], 10);
            if (p > maxPages) maxPages = p;
          }
          if (maxPages > 0) {
            resolve(maxPages);
            return;
          }
        } catch (e) {
          console.error("Error parsing PDF pages", e);
        }
        resolve(2); // default fallback
      };
      reader.onerror = () => resolve(2);
      reader.readAsText(file.slice(0, 1024 * 200)); // Read first 200KB only
    });
  } else if (file.type.startsWith('image/')) {
    return 1;
  } else {
    // Other formats: guess based on file size (approx 100KB per page)
    return Math.max(1, Math.ceil(file.size / 102400));
  }
};

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const UploadPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [loadingShop, setLoadingShop] = useState(true);

  // States
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Contact details states
  const [specialInstructions, setSpecialInstructions] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef(null);

  // Fetch shop and Increment visitor/scan count on mount
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const data = await api.getShopBySlug(slug);
        setShop(data);
        await api.incrementQrVisit(slug);
      } catch (err) {
        console.error('Failed to load shop:', err);
      } finally {
        setLoadingShop(false);
      }
    };
    fetchShop();
  }, [slug]);

  if (loadingShop) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </main>
      </div>
    );
  }

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

  // Handle file drop or selection
  const handleFileSelection = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    let selectedFiles = [];
    if (e.target.files) {
      selectedFiles = Array.from(e.target.files);
    } else if (e.dataTransfer && e.dataTransfer.files) {
      selectedFiles = Array.from(e.dataTransfer.files);
    }

    if (!selectedFiles.length) return;

    // Total files check
    if (files.length + selectedFiles.length > shop.requirements.maxFilesPerJob) {
      setErrorMsg(`Maximum of ${shop.requirements.maxFilesPerJob} files allowed per job.`);
      return;
    }

    const validatedList = [];
    for (const file of selectedFiles) {
      const ext = file.name.split('.').pop().toUpperCase();
      if (!shop.requirements.acceptedFormats.includes(ext)) {
        setErrorMsg(`File type ".${ext.toLowerCase()}" is not accepted by this shop.`);
        continue;
      }

      const sizeMb = file.size / (1024 * 1024);
      if (sizeMb > shop.requirements.maxFileSizeMb) {
        setErrorMsg(`"${file.name}" exceeds the maximum file size of ${shop.requirements.maxFileSizeMb}MB.`);
        continue;
      }

      // Calculate or estimate pages
      const pageCount = await getFilePageCount(file);

      validatedList.push({
        id: generateId(),
        name: file.name,
        size: file.size,
        type: file.type,
        pageCount: pageCount,
        colorPrint: false, // default B&W
        copies: 1,
        doubleSided: false,
        originalFile: file
      });
    }

    setFiles(prev => [...prev, ...validatedList]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateFileOption = (id, key, value) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  // Cost calculation
  const totalCost = files.reduce((sum, f) => {
    const price = f.colorPrint 
      ? shop.requirements.pricePerPageColor 
      : shop.requirements.pricePerPageBW;
    return sum + (f.pageCount * price * f.copies);
  }, 0);

  const handleDirectSubmit = async () => {
    setErrorMsg('');

    if (files.length === 0) {
      setErrorMsg('Please upload at least one document to print.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      const options = [];
      
      files.forEach((fileObj) => {
        formData.append('files', fileObj.originalFile);
        options.push({
          colorPrint: fileObj.colorPrint,
          copies: fileObj.copies,
          doubleSided: fileObj.doubleSided
        });
      });

      if (specialInstructions) {
        formData.append('specialInstructions', specialInstructions);
      }
      formData.append('options', JSON.stringify(options));

      const response = await api.submitPrintJob(slug, formData);
      // Save slug so TrackJobPage can auto-load with just the token
      localStorage.setItem('last_shop_slug', slug);
      setSuccessData({
        token: response.trackingToken || response.token || response.accessToken,
        job: response
      });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit the print job.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (successData) {
      navigator.clipboard.writeText(successData.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-6xl mx-auto px-4 py-8 space-y-6 text-left animate-fade-in">
          {/* Back button */}
          <div className="text-left">
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </Link>
          </div>

          {!successData ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Upload Form Flow */}
              <div className="lg:col-span-7 space-y-6">
                {/* Header Details with dynamic Wifi/Connection badge */}
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <div className="space-y-1">
                    <h1 className="text-2xl font-sans font-extrabold text-white leading-tight">
                      Upload Files
                    </h1>
                    <p className="text-xs text-muted">
                      Privacy first - Quick & Easy Printing to {shop.name}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1.5 bg-[#E6F4EA] text-[#137333] px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    <Wifi className="w-3.5 h-3.5" />
                    <span>Good</span>
                  </div>
                </div>

                {/* Form errors */}
                {errorMsg && (
                  <div className="p-3 bg-danger/10 border border-danger/25 text-xs font-semibold text-danger rounded-xl animate-fade-in">
                    {errorMsg}
                  </div>
                )}

                {/* Redesigned Drag & Drop Area */}
                <div 
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFileSelection(e); }}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
                    dragActive 
                      ? 'border-[#0F9F87] bg-[#0F9F87]/5' 
                      : 'border-[#0F9F87]/40 bg-surface-ink hover:border-[#0F9F87] hover:bg-surface-dark/20'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    multiple 
                    accept={shop.requirements.acceptedFormats.map(ext => `.${ext.toLowerCase()}`).join(',')}
                    onChange={handleFileSelection} 
                  />
                  <div className="flex items-center justify-center gap-2 text-[#0F9F87] hover:text-[#0D8D77] font-bold text-sm">
                    <Plus className="w-5 h-5" />
                    <span>Add More Files</span>
                  </div>
                </div>

                {/* Selected Files section */}
                {files.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold tracking-wider text-muted uppercase">
                      Selected Files ({files.length})
                    </h3>

                    <div className="space-y-4">
                      {files.map((fileObj) => {
                        const isImage = fileObj.type?.startsWith('image/');
                        return (
                          <div 
                            key={fileObj.id} 
                            className="bg-surface-ink border border-border rounded-2xl p-4 space-y-3 shadow-sm animate-scale-in"
                          >
                            {/* File info row */}
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                {/* File icon with check badge */}
                                <div className="relative flex-shrink-0">
                                  <div className="p-2 bg-surface-dark rounded-xl border border-border">
                                    {isImage ? (
                                      <Image className="w-5 h-5 text-[#0F9F87]" />
                                    ) : (
                                      <FileText className="w-5 h-5 text-blue-400" />
                                    )}
                                  </div>
                                  <div className="absolute -bottom-1 -right-1 bg-[#2DB87A] text-white rounded-full p-0.5 border border-surface-ink">
                                    <Check className="w-2.5 h-2.5 stroke-[3px]" />
                                  </div>
                                </div>
                                
                                <div className="min-w-0 text-left">
                                  <p className="text-xs font-bold text-white truncate max-w-[180px] sm:max-w-[240px]">
                                    {fileObj.name}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted">
                                    <span>{formatBytes(fileObj.size)}</span>
                                    <span className="bg-[#E6F7F0] text-[#00A884] px-2 py-0.5 rounded text-[9px] font-bold">
                                      {fileObj.pageCount} {fileObj.pageCount === 1 ? 'Page' : 'Pages'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* B&W vs Color button & Delete button */}
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <div className="flex bg-surface-dark p-0.5 rounded-lg border border-border">
                                  <button
                                    type="button"
                                    onClick={() => updateFileOption(fileObj.id, 'colorPrint', false)}
                                    className={`px-3 py-1 rounded-md text-[10px] font-extrabold uppercase transition-all select-none ${
                                      !fileObj.colorPrint 
                                        ? 'bg-white text-black shadow-sm' 
                                        : 'text-muted hover:text-white'
                                    }`}
                                  >
                                    B&W
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateFileOption(fileObj.id, 'colorPrint', true)}
                                    className={`px-3 py-1 rounded-md text-[10px] font-extrabold uppercase transition-all select-none ${
                                      fileObj.colorPrint 
                                        ? 'bg-white text-black shadow-sm' 
                                        : 'text-muted hover:text-white'
                                    }`}
                                  >
                                    Color
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeFile(fileObj.id)}
                                  className="p-1.5 hover:bg-danger/10 text-muted hover:text-danger rounded-lg transition-colors border border-transparent hover:border-danger/15"
                                  title="Remove File"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Line divider */}
                            <div className="border-t border-border/40"></div>

                            {/* File options row */}
                            <div className="flex items-center justify-between">
                              {/* Copies count */}
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-muted font-medium">Copies</span>
                                <div className="flex items-center bg-surface-dark border border-border rounded-lg select-none">
                                  <button
                                    type="button"
                                    onClick={() => updateFileOption(fileObj.id, 'copies', Math.max(1, fileObj.copies - 1))}
                                    className="px-2 py-0.5 text-muted hover:text-white font-extrabold text-sm"
                                  >
                                    -
                                  </button>
                                  <span className="text-[11px] font-bold text-white font-mono w-4 text-center">
                                    {fileObj.copies}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => updateFileOption(fileObj.id, 'copies', fileObj.copies + 1)}
                                    className="px-2 py-0.5 text-muted hover:text-white font-extrabold text-sm"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* Separator line */}
                              <div className="h-4 border-l border-border/50"></div>

                              {/* Double sided switch */}
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-muted font-medium">Double-sided</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={fileObj.doubleSided} 
                                    onChange={(e) => updateFileOption(fileObj.id, 'doubleSided', e.target.checked)} 
                                    className="sr-only peer" 
                                  />
                                  <div className="w-8 h-4.5 bg-surface-dark peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-muted after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#00A884]"></div>
                                </label>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Optional Special Instructions */}
                {files.length > 0 && (
                  <div className="space-y-1.5 text-left mt-6 animate-fade-in">
                    <label className="text-[10px] text-muted font-bold block uppercase tracking-wider">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      rows="2"
                      placeholder="e.g. Staple corner, landscape layout, double-sided details..."
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="w-full bg-surface-dark border border-border focus:border-accent rounded-xl p-3 text-xs text-white placeholder-muted focus:outline-none transition-colors duration-150 resize-none"
                    />
                  </div>
                )}

                {/* Redesigned Bottom Bar */}
                <div className="flex items-stretch justify-between gap-4 mt-6 bg-surface-ink border border-border rounded-2xl overflow-hidden shadow-lg animate-fade-in">
                  {/* Cost summary block */}
                  <div className="flex-1 flex flex-col justify-center px-5 py-3 bg-surface-dark/40 text-left border-r border-border/40">
                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Total</span>
                    <span className="text-2xl font-extrabold text-[#00A884] font-mono leading-none block my-1">
                      ₹{totalCost.toFixed(2)}
                    </span>
                    <span className="text-[9px] text-muted block">Pay at counter</span>
                  </div>

                  {/* Send Files action button */}
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleDirectSubmit}
                    className="flex-1.5 py-4 bg-[#00A884] hover:bg-[#009473] disabled:bg-[#00A884]/50 disabled:cursor-not-allowed text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 transition-all duration-150 active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-4 h-4 fill-current rotate-45 -translate-y-0.5" />
                    )}
                    {isSubmitting ? 'Sending...' : 'Send Files'}
                  </button>
                </div>

                {/* Privacy protection footer banner */}
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted py-2">
                  <Lock className="w-3.5 h-3.5 text-muted/80" />
                  <span>We value your privacy. No data is stored after printing.</span>
                </div>
              </div>

              {/* Right Column: Shop Info & Specifications */}
              <div className="lg:col-span-5 space-y-6">
                {/* Shop Info Card */}
                <div className="bg-surface-ink border border-border rounded-3xl p-6 text-left space-y-5 shadow-xl">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded bg-success/15 border border-success/20 text-xs text-success font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Currently Open
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-accent/15 border border-accent/20 text-xs text-accent font-semibold font-mono">
                        Verified Partner
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-serif font-extrabold text-white leading-tight">
                      {shop.name}
                    </h2>
                    
                    <p className="text-xs text-muted leading-relaxed">
                      {shop.description || 'Fast and high-quality document printing service provider. Connect with local shop admins, configure B&W or Color templates, specify stapling details, and get tokens immediately.'}
                    </p>
                  </div>

                  {/* Contacts Info List */}
                  {/* <div className="space-y-3 border-t border-border/40 pt-4 text-xs">
                    <div className="flex items-start gap-2.5 p-3 bg-surface-dark/40 border border-border rounded-xl">
                      <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Address</span>
                        <p className="text-white font-medium leading-relaxed break-words">{shop.address}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2.5 p-3 bg-surface-dark/40 border border-border rounded-xl">
                        <Phone className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <div className="space-y-0.5 min-w-0">
                          <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Phone</span>
                          <p className="text-white font-medium font-mono truncate">{shop.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-3 bg-surface-dark/40 border border-border rounded-xl">
                        <Mail className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <div className="space-y-0.5 min-w-0">
                          <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Email</span>
                          <p className="text-white font-medium truncate">{shop.email}</p>
                        </div>
                      </div>
                    </div>
                  </div> */}
                </div>

                {/* Shop Specifications Card */}
                <div className="bg-surface-ink border border-border rounded-3xl p-6 text-left space-y-5 shadow-xl animate-fade-in stagger-1">
                  <h3 className="text-sm font-serif font-extrabold text-white border-b border-border/40 pb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent" />
                    Shop Specifications
                  </h3>

                  <div className="space-y-3.5 text-xs">
                    {/* Formats */}
                    <div className="space-y-1.5">
                      <span className="text-muted font-semibold block uppercase text-[10px]">Accepted Formats:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {shop.requirements.acceptedFormats.map(fmt => (
                          <span key={fmt} className="px-2.5 py-1 rounded bg-surface-dark text-[10px] font-bold text-white border border-border">
                            {fmt}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Page BW Pricing */}
                    <div className="flex justify-between items-center py-2 border-b border-border/40">
                      <span className="text-muted font-medium">B&W Rate (per page):</span>
                      <span className="font-mono text-white font-bold text-sm">₹{shop.requirements.pricePerPageBW.toFixed(2)}</span>
                    </div>

                    {/* Page Color Pricing */}
                    <div className="flex justify-between items-center py-2 border-b border-border/40">
                      <span className="text-muted font-medium">Color Rate (per page):</span>
                      <span className="font-mono text-accent font-bold text-sm">₹{shop.requirements.pricePerPageColor.toFixed(2)}</span>
                    </div>

                    {/* File constraints */}
                    <div className="flex justify-between items-center py-2 border-b border-border/40">
                      <span className="text-muted font-medium">Max File Size:</span>
                      <span className="font-mono text-white font-semibold">{shop.requirements.maxFileSizeMb} MB</span>
                    </div>

                    {/* Max files constraint */}
                    <div className="flex justify-between items-center py-2 border-b border-border/40">
                      <span className="text-muted font-medium">Max Files Per Job:</span>
                      <span className="font-mono text-white font-semibold">{shop.requirements.maxFilesPerJob} Files</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-muted bg-surface-dark/40 p-2.5 rounded-lg border border-border/40">
                    <CheckCircle className="w-3.5 h-3.5 text-success flex-shrink-0" />
                    <span>Supports dual layouts and duplex orientation options.</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Submission success card page */
            <div className="max-w-md mx-auto bg-surface-ink border border-border rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-scale-in">
              <div className="flex justify-center">
                <div className="p-4 bg-success/10 text-success rounded-full border border-success/20 animate-bounce">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-serif font-extrabold text-white">Job Submitted Successfully!</h1>
                <p className="text-xs text-muted">
                  Your files have been routed into the print queue of <span className="text-white font-semibold">{shop.name}</span>.
                </p>
              </div>

              {/* Monospace token panel wrapper */}
              <div className="p-6 bg-surface-dark border border-border rounded-2xl max-w-sm mx-auto space-y-3.5">
                <span className="text-[9px] text-muted font-bold tracking-widest uppercase block">YOUR TRACKING TOKEN</span>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-mono text-3xl text-[#E8A838] font-extrabold text-glow-amber">
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
                  className="flex-1 py-3 text-xs font-bold uppercase tracking-wider bg-[#00A884] hover:bg-[#009473] text-black rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-150 animate-pulse-subtle"
                >
                  Track My Job
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/"
                  className="flex-1 py-3 text-xs font-bold uppercase tracking-wider bg-surface-dark border border-border text-white hover:bg-primary/20 rounded-xl transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer notice banner */}
      <footer className="border-t border-border bg-background py-6 mt-12 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 text-center text-xs text-muted flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} PrintEase SaaS platform. All rights reserved.</p>
        <div className="flex gap-4 font-semibold">
          <Link to="/shops" className="hover:text-white">Directory</Link>
          <Link to="/" className="hover:text-white">Home</Link>
        </div>
      </footer>
    </div>
  );
};

export default UploadPage;
