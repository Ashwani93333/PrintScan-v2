# PrintEase — Role-Based Feature Specification

This document provides a comprehensive breakdown of all features and modules implemented in the **PrintEase** platform, organized by user roles.

---

## 1. Public Customer Role

The customer-facing flow is optimized for quick, mobile-first QR-code scanning at shop counters, allowing seamless document transmissions without registering an account.

### A. Shop Discovery & QR Code Landing
- **QR Code Entry**: Scanning a shop's physical QR code redirects the customer to their landing page (`/shops/:slug`) showing pricing rates, store hours, status (Open/Closed), and accepted formats.
- **Dashed Upload Zone**: Customers click or drag-and-drop documents into the upload landing page (`/shops/:slug/upload`).

### B. Document Configuration & Auto-Pricing
- **Format & Size Validation**: Enforces shop-specific restrictions (e.g., maximum file sizes like 25MB and accepted formats like PDF, JPG, PNG, DOCX).
- **Client-Side Page Parsing**: 
  - Automatically extracts page counts from PDF metadata (`/Count` indicator) within the first 200KB of the file.
  - Image files default to 1 page.
  - Other text/document formats estimate page counts dynamically based on size.
- **Per-File Option Control**:
  - **Color Mode Toggle**: Segmented B&W vs Color button.
  - **Copies Counter**: Dynamic stepper (`-` / `+`) to set the number of copies.
  - **Duplex Mode Switch**: Toggle double-sided printing.
- **Real-Time Price Calculation**: 
  - Dynamically calculates estimated cost per file: `pages * copies * rate` (using shop B&W or Color rate).
  - Displays a consolidated total cost (`Total ₹X`) and a payment notice (`Pay at counter`) in the bottom utility bar.

### C. Contact Collection & Job Submission
- **Contact Modal**: Clicking "Send Files" opens a overlay form collecting:
  - Full Name (Required)
  - Phone Number (Required)
  - Email Address (Optional)
  - Special Instructions (Optional, e.g., "Staple top-left", "Landscape orientation").
- **Job Router Submission**: Saves the job request, generates a unique 6-character uppercase tracking token (e.g., `#B4K9X2`), and transitions to the success screen.

### D. Live Progress Tracking
- **Tracking Page (`/track/:token`)**:
  - Live status stepper timeline containing steps: `Job Submitted` ➔ `Under Review` ➔ `Printing` ➔ `Ready to Collect`.
  - Displays detailed print specifications (color mode, copies, files list, duplex choices, special instructions).
  - Displays staff notes (e.g. "Spotted paper size error, printing on legal instead").
  - Shows the exact calculated job cost and total print pages.

---

## 2. Shop Admin (Shop Manager) Role

Allows individual shop operators to manage their queues, print documents directly from browser tabs, and update shop rates.

### A. Admin Dashboard
- **Analytics Indicators**: Real-time counter widgets for Total Jobs, Total Pages Printed, and Total Revenue (INR).
- **Recent Uploads**: Live-monitored list of incoming print jobs showing token, customer name, status, exact calculated price, and page count.
- **QR Code Generator Poster**:
  - Custom branded counter poster with the shop's URL and scan details.
  - Features options to download the QR image (.png) or print the poster layout directly.

### B. Print Jobs Queue (`/admin/jobs`)
- **Queue Overview**: Tabbed views filterable by status (`Pending`, `Processing`, `Completed`, `Cancelled`).
- **Detailed Search**: Filter by token, customer name, or phone number.
- **Pages (Files) Counter**: Displays total print pages and file count in the list (e.g. `6 pgs (1 files)`).

### C. Job Operations & Direct Printing
- **Status Changer**: Transition jobs from Pending ➔ Processing ➔ Completed ➔ Cancelled.
- **Staff Operations Sidebar**:
  - Displays total pages and exact cost.
  - Allows manual overrides for calculated page counts and estimated costs (for custom paper or binding fees).
  - Admin note field for communications shown on customer tracking.
- **Transmitted Files List**:
  - Displays individual file specifications (duplex, copies, color, size, format).
  - **Download Button**: Downloads the file to the local machine.
  - **Print Button**: Streams the document to a local spool ticket template and opens the browser's native print interface automatically.

### D. Store Profile Config (`/admin/profile`)
- **Public Store Info**: Edit name, phone, email, address, description, and status (toggle accepting jobs).
- **Rates and Restrictions**:
  - Black & White print rate (INR per page).
  - Color print rate (INR per page).
  - Max size limit per file (MB) and max files per job.
  - Accepted file formats selection checkboxes.

---

## 3. Super Admin Role

Provides global oversight and control of all registered print shops.

### A. Platform Analytics
- **Aggregated Metrics**: Total shops registered, active/approved shops, total platform jobs, cancelled/completed jobs count, and date-based job volume charts.
- **Shop Completion Rate**: Compares performance between different print hubs.

### B. Shop Approval Pipeline
- **Registrations List**: Review newly submitted applications by shop owners.
- **Action Triggers**: Approve or Reject registrations. Only approved shops receive public slugs and can accept customer uploads.

### C. Global Shop Management
- **Shop Creator Form**: Super admins can directly instantiate pre-approved shops.
- **Delete & Toggle Status**: Permanently remove shops or toggle their operational status.
