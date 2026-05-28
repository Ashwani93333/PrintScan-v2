import React, { createContext, useContext, useState, useEffect } from 'react';

const DbContext = createContext();

// Safe UUID/unique ID generator for non-secure HTTP contexts
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Initial mock shops
const INITIAL_SHOPS = [
  {
    "id": "a90b4d45-ff1a-4643-982c-d9c087b322a3",
    "name": "Campus Quick Print",
    "address": "123 University Ave, Sector 4",
    "phone": "+919876543210",
    "email": "contact@campusquickprint.com",
    "slug": "campus-quick-print",
    "description": "Fast and affordable document printing for university students.",
    "isActive": true,
    "isApproved": true,
    "adminEmail": "contact@campusquickprint.com",
    "adminName": "Ashish Sharma",
    "createdAt": "2026-05-15T09:00:00",
    "qrVisits": 142,
    "requirements": {
      "acceptedFormats": ["PDF", "JPG", "PNG", "DOCX"],
      "maxFileSizeMb": 25,
      "maxFilesPerJob": 5,
      "pricePerPageBW": 2.00,
      "pricePerPageColor": 10.00
    }
  },
  {
    "id": "b12c4d23-aa2b-4123-981a-e8c077b123b2",
    "name": "Metro Print Hub",
    "address": "45 MG Road, Connaught Place, New Delhi",
    "phone": "+911234567890",
    "email": "metro@printhub.in",
    "slug": "metro-print-hub",
    "description": "Professional printing for corporate documents, brochures and more.",
    "isActive": true,
    "isApproved": true,
    "adminEmail": "owner@printease.com", // Main demo owner
    "adminName": "Rajiv Khanna",
    "createdAt": "2026-05-16T10:30:00",
    "qrVisits": 89,
    "requirements": {
      "acceptedFormats": ["PDF", "JPG", "PNG"],
      "maxFileSizeMb": 50,
      "maxFilesPerJob": 10,
      "pricePerPageBW": 1.50,
      "pricePerPageColor": 8.00
    }
  }
];

// Initial mock jobs
const INITIAL_JOBS = [
  {
    "id": "e4c76b92-ca9d-40c2-bd74-1234a9efb923",
    "accessToken": "1",
    "customerName": "Amit Kumar",
    "customerPhone": "+919988776655",
    "customerEmail": "amit.kumar@example.com",
    "status": "PENDING",
    "shopId": "a90b4d45-ff1a-4643-982c-d9c087b322a3",
    "shopName": "Campus Quick Print",
    "printOptions": {
      "colorPrint": true,
      "copies": 2,
      "paperSize": "A4",
      "doubleSided": false,
      "specialInstructions": "Please bind the pages with a corner staple."
    },
    "adminNotes": null,
    "totalPages": null,
    "estimatedCost": null,
    "files": [
      {
        "id": "409fd02b-a01c-43f1-bd12-f0491cbcd12a",
        "originalName": "assignment_report.pdf",
        "sizeBytes": 4567890,
        "mimeType": "application/pdf",
        "pageCount": null,
        "fileType": "DOCUMENT"
      }
    ],
    "createdAt": "2026-05-23T11:15:00",
    "updatedAt": "2026-05-23T11:15:00"
  },
  {
    "id": "f9c11a03-bb4d-42e1-ac73-998bde4f7812",
    "accessToken": "2",
    "customerName": "Priya Singh",
    "customerPhone": "+919871234567",
    "customerEmail": "priya.singh@example.com",
    "status": "PROCESSING",
    "shopId": "b12c4d23-aa2b-4123-981a-e8c077b123b2",
    "shopName": "Metro Print Hub",
    "printOptions": {
      "colorPrint": false,
      "copies": 1,
      "paperSize": "A4",
      "doubleSided": true,
      "specialInstructions": ""
    },
    "adminNotes": "Printing on 75GSM paper.",
    "totalPages": 20,
    "estimatedCost": 30.00,
    "files": [
      {
        "id": "502fe11c-b12d-44f2-ce23-g1602dcde23b",
        "originalName": "resume_final.pdf",
        "sizeBytes": 1234567,
        "mimeType": "application/pdf",
        "pageCount": 20,
        "fileType": "DOCUMENT"
      }
    ],
    "createdAt": "2026-05-22T09:30:00",
    "updatedAt": "2026-05-22T10:15:00"
  },
  {
    "id": "g7b22b14-cc5e-53f2-bd84-aa7cef5g8923",
    "accessToken": "3",
    "customerName": "Rohan Mehta",
    "customerPhone": "+919909876543",
    "customerEmail": "rohan.mehta@example.com",
    "status": "COMPLETED",
    "shopId": "a90b4d45-ff1a-4643-982c-d9c087b322a3",
    "shopName": "Campus Quick Print",
    "printOptions": {
      "colorPrint": true,
      "copies": 5,
      "paperSize": "A3",
      "doubleSided": false,
      "specialInstructions": "Glossy paper preferred."
    },
    "adminNotes": "Used premium glossy 200GSM.",
    "totalPages": 5,
    "estimatedCost": 250.00,
    "files": [
      {
        "id": "603gf22d-c23e-55g3-df34-h2713eded34c",
        "originalName": "poster_design.jpg",
        "sizeBytes": 8901234,
        "mimeType": "image/jpeg",
        "pageCount": 1,
        "fileType": "IMAGE"
      }
    ],
    "createdAt": "2026-05-21T14:00:00",
    "updatedAt": "2026-05-21T15:30:00"
  }
];

// Bump this version whenever the data shape changes to force a localStorage reset
const DB_VERSION = 3;

export const DbProvider = ({ children }) => {
  const [shops, setShops] = useState(() => {
    const savedVersion = localStorage.getItem('printease_db_version');
    
    // If version mismatch, clear stale data and start fresh
    if (savedVersion !== String(DB_VERSION)) {
      localStorage.removeItem('printease_shops');
      localStorage.removeItem('printease_jobs');
      localStorage.setItem('printease_db_version', String(DB_VERSION));
      return INITIAL_SHOPS;
    }

    const local = localStorage.getItem('printease_shops');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Always merge in INITIAL_SHOPS so demo shops are never lost
          const merged = [...parsed];
          INITIAL_SHOPS.forEach(initialShop => {
            if (!merged.some(s => s.id === initialShop.id)) {
              merged.push(initialShop);
            }
          });
          return merged;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SHOPS;
  });

  const [jobs, setJobs] = useState(() => {
    const local = localStorage.getItem('printease_jobs');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Always merge in INITIAL_JOBS so demo jobs are never lost
          const merged = [...parsed];
          INITIAL_JOBS.forEach(initialJob => {
            if (!merged.some(j => j.id === initialJob.id)) {
              merged.push(initialJob);
            }
          });
          return merged;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_JOBS;
  });

  useEffect(() => {
    localStorage.setItem('printease_shops', JSON.stringify(shops));
  }, [shops]);

  useEffect(() => {
    localStorage.setItem('printease_jobs', JSON.stringify(jobs));
  }, [jobs]);

  // Helper: Generate daily sequential numeric token (resets to 1 each day)
  const generateToken = () => {
    const todayStr = new Date().toISOString().substring(0, 10); // "YYYY-MM-DD"
    const todaysJobs = jobs.filter(j => j.createdAt?.substring(0, 10) === todayStr);
    const nextNumber = todaysJobs.length + 1;
    return String(nextNumber);
  };

  // Customer: Upload print job
  const submitPrintJob = (shopSlug, customerInfo, printOptions, filesList) => {
    const shop = shops.find(s => s.slug === shopSlug);
    if (!shop) return { success: false, error: 'Shop not found' };

    const token = generateToken();
    
    // Compute total pages and cost from individual files
    const totalJobPages = filesList.reduce((sum, f) => sum + (f.pageCount * f.copies), 0);
    const estimatedJobCost = filesList.reduce((sum, f) => {
      const price = f.colorPrint 
        ? shop.requirements.pricePerPageColor 
        : shop.requirements.pricePerPageBW;
      return sum + (f.pageCount * price * f.copies);
    }, 0);

    const newJob = {
      id: generateId(),
      accessToken: token,
      customerName: customerInfo.fullName,
      customerPhone: customerInfo.phone,
      customerEmail: customerInfo.email || null,
      status: 'PENDING',
      shopId: shop.id,
      shopName: shop.name,
      printOptions: {
        colorPrint: filesList[0]?.colorPrint || false,
        copies: filesList[0]?.copies || 1,
        paperSize: printOptions.paperSize || 'A4',
        doubleSided: filesList[0]?.doubleSided || false,
        specialInstructions: printOptions.specialInstructions || ''
      },
      adminNotes: null,
      totalPages: totalJobPages,
      estimatedCost: estimatedJobCost,
      files: filesList.map(f => ({
        id: generateId(),
        originalName: f.name,
        sizeBytes: f.size,
        mimeType: f.type || 'application/octet-stream',
        pageCount: f.pageCount,
        fileType: f.type?.startsWith('image/') ? 'IMAGE' : 'DOCUMENT',
        colorPrint: f.colorPrint,
        copies: f.copies,
        doubleSided: f.doubleSided
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setJobs(prev => [newJob, ...prev]);
    return { success: true, token, job: newJob };
  };

  // Shop Owner: Register shop
  const registerShop = (shopData) => {
    const newShop = {
      id: generateId(),
      name: shopData.name,
      address: shopData.address,
      phone: shopData.phone,
      email: shopData.email,
      slug: shopData.slug,
      description: shopData.description,
      isActive: true,
      isApproved: false, // Under review by default
      adminEmail: shopData.adminEmail,
      adminName: shopData.adminName,
      createdAt: new Date().toISOString(),
      requirements: {
        acceptedFormats: shopData.acceptedFormats || ['PDF', 'JPG', 'PNG', 'DOCX'],
        maxFileSizeMb: parseInt(shopData.maxFileSizeMb) || 25,
        maxFilesPerJob: parseInt(shopData.maxFilesPerJob) || 5,
        pricePerPageBW: parseFloat(shopData.pricePerPageBW) || 2.00,
        pricePerPageColor: parseFloat(shopData.pricePerPageColor) || 10.00
      }
    };

    // Prevent duplicate slugs
    if (shops.some(s => s.slug === newShop.slug)) {
      return { success: false, error: 'Shop URL slug is already taken.' };
    }

    setShops(prev => [...prev, newShop]);
    return { success: true, shop: newShop };
  };

  // Admin: Update job status & calculation
  const updateJob = (jobId, data) => {
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        const updated = {
          ...job,
          status: data.status || job.status,
          totalPages: data.totalPages !== undefined ? data.totalPages : job.totalPages,
          estimatedCost: data.estimatedCost !== undefined ? data.estimatedCost : job.estimatedCost,
          adminNotes: data.adminNotes !== undefined ? data.adminNotes : job.adminNotes,
          updatedAt: new Date().toISOString()
        };

        // Recalculate cost if pages is supplied and cost not overridden
        if (data.totalPages && data.estimatedCost === undefined) {
          const shop = shops.find(s => s.id === job.shopId);
          if (shop) {
            const price = job.printOptions.colorPrint 
              ? shop.requirements.pricePerPageColor 
              : shop.requirements.pricePerPageBW;
            updated.estimatedCost = data.totalPages * price * job.printOptions.copies;
          }
        }
        return updated;
      }
      return job;
    }));
    return { success: true };
  };

  // Admin: Update Shop Profile
  const updateShopProfile = (shopId, profileData) => {
    setShops(prev => prev.map(shop => {
      if (shop.id === shopId) {
        return {
          ...shop,
          name: profileData.name,
          address: profileData.address,
          phone: profileData.phone,
          email: profileData.email,
          description: profileData.description,
          isActive: profileData.isActive,
          requirements: {
            ...shop.requirements,
            acceptedFormats: profileData.acceptedFormats,
            maxFileSizeMb: parseInt(profileData.maxFileSizeMb) || 25,
            maxFilesPerJob: parseInt(profileData.maxFilesPerJob) || 5,
            pricePerPageBW: parseFloat(profileData.pricePerPageBW) || 2.00,
            pricePerPageColor: parseFloat(profileData.pricePerPageColor) || 10.00
          }
        };
      }
      return shop;
    }));
    return { success: true };
  };

  // Super Admin Actions
  const approveShop = (shopId) => {
    setShops(prev => prev.map(s => s.id === shopId ? { ...s, isApproved: true } : s));
    return { success: true };
  };

  const rejectShop = (shopId) => {
    setShops(prev => prev.filter(s => s.id !== shopId));
    return { success: true };
  };

  const toggleShopActive = (shopId) => {
    setShops(prev => prev.map(s => s.id === shopId ? { ...s, isActive: !s.isActive } : s));
    return { success: true };
  };

  const createShop = (shopData) => {
    const newShop = {
      id: generateId(),
      name: shopData.name,
      address: shopData.address,
      phone: shopData.phone,
      email: shopData.email,
      slug: shopData.slug,
      description: shopData.description,
      isActive: true,
      isApproved: true, // Super admin created are auto approved
      adminEmail: shopData.adminEmail,
      adminName: shopData.adminName,
      createdAt: new Date().toISOString(),
      requirements: {
        acceptedFormats: shopData.acceptedFormats || ['PDF', 'JPG', 'PNG', 'DOCX'],
        maxFileSizeMb: parseInt(shopData.maxFileSizeMb) || 25,
        maxFilesPerJob: parseInt(shopData.maxFilesPerJob) || 5,
        pricePerPageBW: parseFloat(shopData.pricePerPageBW) || 2.00,
        pricePerPageColor: parseFloat(shopData.pricePerPageColor) || 10.00
      }
    };

    if (shops.some(s => s.slug === newShop.slug)) {
      return { success: false, error: 'Shop URL slug is already taken.' };
    }

    setShops(prev => [...prev, newShop]);
    return { success: true, shop: newShop };
  };

  const deleteShop = (shopId) => {
    setShops(prev => prev.filter(s => s.id !== shopId));
    // Also delete jobs for this shop
    setJobs(prev => prev.filter(j => j.shopId !== shopId));
    return { success: true };
  };

  const incrementQrVisits = (shopId) => {
    setShops(prev => prev.map(s => {
      if (s.id === shopId) {
        return { ...s, qrVisits: (s.qrVisits || 0) + 1 };
      }
      return s;
    }));
  };

  // Get dynamic platform analytics
  const getAnalytics = (fromDate = "2026-05-01", toDate = "2026-05-31") => {
    const filteredJobs = jobs.filter(j => {
      const date = j.createdAt.substring(0, 10);
      return date >= fromDate && date <= toDate;
    });

    const totalJobs = filteredJobs.length;
    const completedJobs = filteredJobs.filter(j => j.status === 'COMPLETED').length;
    const pendingJobs = filteredJobs.filter(j => j.status === 'PENDING').length;
    const cancelledJobs = filteredJobs.filter(j => j.status === 'CANCELLED').length;
    const processingJobs = filteredJobs.filter(j => j.status === 'PROCESSING').length;

    const totalFilesUploaded = filteredJobs.reduce((acc, job) => acc + (job.files?.length || 0), 0);

    // Compute top shops
    const shopCounts = {};
    filteredJobs.forEach(job => {
      if (!shopCounts[job.shopName]) {
        shopCounts[job.shopName] = { count: 0, completed: 0 };
      }
      shopCounts[job.shopName].count += 1;
      if (job.status === 'COMPLETED') {
        shopCounts[job.shopName].completed += 1;
      }
    });

    const topShops = Object.keys(shopCounts).map(name => ({
      shopName: name,
      jobCount: shopCounts[name].count,
      completionRate: shopCounts[name].count > 0 ? (shopCounts[name].completed / shopCounts[name].count) : 0
    })).sort((a, b) => b.jobCount - a.jobCount);

    // Jobs by Day
    const dateCounts = {};
    filteredJobs.forEach(job => {
      const dateStr = job.createdAt.substring(0, 10);
      dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
    });

    const jobsByDay = Object.keys(dateCounts).map(date => ({
      date,
      count: dateCounts[date]
    })).sort((a, b) => a.date.localeCompare(b.date));

    return {
      period: { from: fromDate, to: toDate },
      totalShops: shops.length,
      activeShops: shops.filter(s => s.isActive && s.isApproved).length,
      totalJobsInPeriod: totalJobs,
      completedJobs,
      cancelledJobs,
      pendingJobs,
      processingJobs,
      totalFilesUploaded,
      topShops,
      jobsByDay
    };
  };

  return (
    <DbContext.Provider value={{
      shops,
      jobs,
      submitPrintJob,
      registerShop,
      updateJob,
      updateShopProfile,
      approveShop,
      rejectShop,
      toggleShopActive,
      createShop,
      deleteShop,
      incrementQrVisits,
      getAnalytics
    }}>
      {children}
    </DbContext.Provider>
  );
};

export const useDb = () => useContext(DbContext);
