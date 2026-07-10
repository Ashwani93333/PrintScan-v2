import React, { useState, useRef } from 'react';
import { Upload, FileText, Trash2, Image, AlertCircle, Check } from 'lucide-react';

const FileUploadZone = ({ acceptedFormats = [], maxFileSizeMb = 25, maxFiles = 5, onFilesChange }) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const formatExtensions = acceptedFormats.map(ext => `.${ext.toLowerCase()}`).join(',');

  const processFiles = (newFilesList) => {
    setError('');
    const newFiles = Array.from(newFilesList);

    // Total files limit check
    if (files.length + newFiles.length > maxFiles) {
      setError(`Maximum of ${maxFiles} files allowed per job.`);
      return;
    }

    const validated = [];
    for (const file of newFiles) {
      // Format validation
      const ext = file.name.split('.').pop().toUpperCase();
      if (!acceptedFormats.includes(ext)) {
        setError(`File type ".${ext.toLowerCase()}" is not accepted by this shop.`);
        return;
      }

      // Size validation
      const sizeMb = file.size / (1024 * 1024);
      if (sizeMb > maxFileSizeMb) {
        setError(`"${file.name}" exceeds the maximum file size of ${maxFileSizeMb}MB.`);
        return;
      }

      // Add a mock upload progress parameter
      validated.push({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: 'uploading'
      });
    }

    const updatedFiles = [...files, ...validated];
    setFiles(updatedFiles);
    if (onFilesChange) onFilesChange(updatedFiles.map(f => f.file));

    // Simulate progress bar increase for premium micro-animations
    validated.forEach(vf => {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 25) + 10;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          setFiles(prev => prev.map(f => f.name === vf.name ? { ...f, progress: 100, status: 'success' } : f));
        } else {
          setFiles(prev => prev.map(f => f.name === vf.name ? { ...f, progress: currentProgress } : f));
        }
      }, 150);
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (fileInputRef.current.files && fileInputRef.current.files[0]) {
      processFiles(fileInputRef.current.files);
    }
  };

  const removeFile = (indexToRemove) => {
    const updated = files.filter((_, idx) => idx !== indexToRemove);
    setFiles(updated);
    if (onFilesChange) onFilesChange(updated.map(f => f.file));
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
          dragActive 
            ? 'border-accent bg-accent/5' 
            : 'border-border bg-surface-ink hover:border-accent/40 hover:bg-surface-dark/50'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          multiple 
          accept={formatExtensions}
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <div className="p-3 bg-surface-dark rounded-full border border-border text-muted hover:text-accent transition-colors duration-200">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-text-primary">
            Drag & drop files here or <span className="text-accent underline">browse</span>
          </p>
          <p className="text-xs text-muted">
            Supported files: {acceptedFormats.join(', ')} (Max: {maxFileSizeMb}MB per file)
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-danger bg-danger/10 p-3 rounded-lg border border-danger/20">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold tracking-wider text-muted uppercase">Uploaded Files ({files.length}/{maxFiles})</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {files.map((fileObj, idx) => {
              const isImage = fileObj.type?.startsWith('image/');
              return (
                <div key={idx} className="flex flex-col p-3 bg-surface-ink border border-border rounded-xl">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {isImage ? (
                        <Image className="w-5 h-5 text-accent flex-shrink-0" />
                      ) : (
                        <FileText className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-text-primary truncate max-w-[240px] md:max-w-[400px]">
                          {fileObj.name}
                        </p>
                        <p className="text-[10px] text-muted">
                          {formatBytes(fileObj.size)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {fileObj.status === 'success' ? (
                        <span className="p-1 bg-success/15 text-success rounded-full border border-success/20">
                          <Check className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="text-xs text-accent font-semibold">{fileObj.progress}%</span>
                      )}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(idx);
                        }}
                        className="p-1.5 hover:bg-danger/10 text-muted hover:text-danger rounded-lg border border-transparent hover:border-danger/15 transition-all duration-150"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {fileObj.status === 'uploading' && (
                    <div className="w-full bg-surface-dark h-1 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="bg-accent h-full rounded-full transition-all duration-200"
                        style={{ width: `${fileObj.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;
