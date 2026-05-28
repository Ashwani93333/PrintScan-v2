# PrintEase — Complete Frontend Design Prompt

## Project Overview

**PrintEase** is a SaaS platform for managing print shops. It connects customers who need documents printed with local print shop owners, all managed by a Super Admin. The platform has three distinct user roles:

- **Customers** (public, no login) — Find shops, upload files, track jobs
- **Shop Admins** (ROLE_ADMIN) — Manage their own shop, handle print jobs
- **Super Admins** (ROLE_SUPER_ADMIN) — Platform-wide control, analytics, shop approvals

---

## Design Direction

**Aesthetic**: Clean industrial-utility with warm ink-and-paper accents. Think a premium printing press meets modern SaaS. Use a dark navy/charcoal primary with warm amber/ochre accents and clean off-white surfaces. Typography should feel editorial — a strong slab serif or geometric display font for headings, a crisp readable sans-serif for body. The brand mark should evoke a print grid or paper stack.

**Color Palette (suggested)**:
- Background: `#0F1117` (deep ink black) or `#F7F4EF` (paper white) — pick one and go all in
- Primary: `#1A2035` (navy ink)
- Accent: `#E8A838` (warm amber/gold)
- Surface: `#FFFFFF` or `#1E2435`
- Muted: `#8A8FA3`
- Success: `#2DB87A`
- Danger: `#E84040`
- Status colors: PENDING `#E8A838`, PROCESSING `#3B82F6`, COMPLETED `#2DB87A`, CANCELLED `#E84040`

**Typography**: Pair a strong display typeface (e.g. `DM Serif Display`, `Playfair Display`, or `Fraunces`) with a utilitarian body font (e.g. `IBM Plex Sans`, `Sora`, or `DM Sans`). Import from Google Fonts.

**Motion**: Subtle entrance animations on page load (staggered fade-up), smooth tab/route transitions, skeleton loaders, hover lift effects on cards.

---

## Pages & Screens to Build

---

### PAGE 1: Landing / Home (`/`)

**Purpose**: Marketing/welcome page for all visitors.

**Sections**:

1. **Navbar**
   - Logo: "PrintEase" with a small print-grid icon (SVG)
   - Links: Home, Find a Shop, Track My Print
   - CTA Button: "Register Your Shop" (outlined) + "Login" (filled)
   - Mobile hamburger menu

2. **Hero Section**
   - Headline: "Your Documents. Printed Instantly."
   - Sub-headline: "Upload files from anywhere. Track your order in real-time. Collect at any PrintEase partner shop near you."
   - Two CTAs: "Find a Print Shop Near You" (primary) + "Track My Print Job" (ghost)
   - Hero visual: Abstract illustration of document pages flying into a printer, or a grid of QR codes / document icons. Use SVG shapes.
   - Background: Subtle dot-grid or grain texture

3. **How It Works** (3 steps, horizontal cards)
   - Step 1: "Find Your Shop" — Search or scan QR at a nearby PrintEase partner
   - Step 2: "Upload Your Files" — PDF, JPG, DOCX — configure copies, color, paper size
   - Step 3: "Track & Collect" — Get a token, track status live, pick up when ready

4. **Features Section** (icon grid, 6 features)
   - Real-time job tracking
   - QR code upload
   - Multi-format file support
   - Instant cost estimate
   - Email notifications
   - Secure file storage

5. **For Shop Owners Section** (split layout)
   - Left: Text — "Grow your print business with PrintEase"
   - Right: Mock dashboard screenshot (can be a styled placeholder card)
   - CTA: "Register Your Shop — It's Free"

6. **Footer**
   - Logo + tagline
   - Links: Privacy Policy, Terms of Service, Contact
   - Copyright

---

### PAGE 2: Find a Shop (`/shops`)

**Purpose**: Public shop directory. No login required.

**Layout**:
- Page title: "Find a Print Shop"
- Search bar (full-width) with placeholder "Search by shop name or area..."
- Results grid: Cards in 3-column layout (responsive to 1 col on mobile)

**Shop Card** (each card contains):
- Shop name (bold heading)
- Address with location pin icon
- Phone number with phone icon
- Email
- Price badges: "₹X BW / page" and "₹X Color / page"
- Accepted formats chips: PDF, JPG, PNG, DOCX (small pill badges)
- Max file size & max files per job (small metadata row)
- Two action buttons: "Upload Files →" (primary) and "View Details" (ghost)

**Pagination**: Simple prev/next with page count at bottom

**Empty state**: Illustrated empty state if no shops found

---

### PAGE 3: Shop Detail (`/shops/:slug`)

**Purpose**: Public detail page for a single shop.

**Layout**:
- Breadcrumb: Home > Shops > [Shop Name]
- Two-column layout:
  - **Left (2/3)**: 
    - Shop name (large heading)
    - Description paragraph
    - Address, phone, email in a clean info list
    - "Upload Files to This Shop" — large CTA button
  - **Right (1/3)**:
    - QR Code display card (show QR image from `/api/public/shops/:slug/qr`) with "Scan to Upload" label
    - Requirements card:
      - Accepted Formats (pill chips)
      - Max File Size
      - Max Files Per Job
      - Price per page BW
      - Price per page Color

---

### PAGE 4: Upload Files (`/shops/:slug/upload`)

**Purpose**: Customer file upload form.

**Layout**: Centered single-column form, max-width ~640px

**Form Fields**:
1. **Customer Info section** (card):
   - Full Name (required)
   - Phone Number (required)
   - Email Address (optional)

2. **File Upload section** (card):
   - Drag-and-drop zone with dashed border
   - "Drop files here or click to browse"
   - File type hint: "Accepted: PDF, JPG, PNG, DOCX"
   - Uploaded file list (name, size, remove button)

3. **Print Options section** (card):
   - Color Print: Toggle switch (B&W / Color)
   - Paper Size: Select dropdown (A4, A3, Letter, Legal)
   - Number of Copies: Number input (min 1)
   - Double-Sided: Toggle switch
   - Special Instructions: Textarea

4. **Submit button**: "Submit Print Job →" (full-width, large)

**After submit — Success State**:
- Replace form with a success card:
  - Green checkmark icon
  - "Job Submitted Successfully!"
  - Your Token: **E9A4F8** (large monospace display)
  - "Track your job at: /track/E9A4F8" (clickable link)
  - "Save this token — you'll need it to track your order"
  - CTA: "Track My Job →"

---

### PAGE 5: Track Print Job (`/track/:token`)

**Purpose**: Live job status page for customers.

**Layout**: Centered card, max-width ~560px

**Header**:
- Token display: "Job #E9A4F8" (large monospace)
- Shop name + address

**Status Banner** (full-width colored banner based on status):
- PENDING → Amber — "Waiting for review"
- PROCESSING → Blue — "Your job is being printed"
- COMPLETED → Green — "Ready for collection!"
- CANCELLED → Red — "This job was cancelled"

**Status Timeline** (vertical stepper):
- Step 1: Submitted ✓
- Step 2: Under Review (active if PENDING)
- Step 3: Printing (active if PROCESSING)
- Step 4: Ready to Collect (active if COMPLETED)

**Job Details Card**:
- Files uploaded: count
- Print options: Color/BW, copies, paper size, double-sided
- Special instructions (if any)
- Estimated cost (if available, else "Calculating...")
- Submitted at timestamp

**Refresh button**: "Refresh Status" with last-updated time

---

### PAGE 6: Shop Registration (`/register`)

**Purpose**: Public form for print shop owners to apply.

**Layout**: Two-column on desktop (left: form, right: benefits sidebar), single column mobile

**Left — Form** (multi-step or single long form with sections):

Step 1 — Shop Information:
- Shop Name
- Shop Address
- Shop Phone
- Shop Email
- Shop Slug (auto-generated from name, editable) with preview: "Your URL: printease.com/shops/your-slug"
- Description (textarea)

Step 2 — Admin Account:
- Your Full Name
- Your Email
- Password
- Confirm Password

Step 3 — Pricing & Requirements:
- Price per page (B&W): number input with ₹ prefix
- Price per page (Color): number input with ₹ prefix
- Max file size (MB): number input
- Max files per job: number input
- Accepted formats: multi-select checkbox group (PDF, JPG, PNG, DOCX)

**Submit**: "Submit Registration Request →"

**After submit — Pending State**:
- Success illustration
- "Registration Submitted!"
- "Your shop is under review. Our team will verify your details and notify you at [email] within 24-48 hours."

**Right — Benefits Sidebar**:
- "Why Join PrintEase?"
- 4 bullet benefits with icons
- Testimonial quote card (placeholder)

---

### PAGE 7: Login (`/login`)

**Purpose**: Login for Shop Admins and Super Admins.

**Layout**: Split-screen — left decorative brand panel, right form

**Left Panel**:
- Large PrintEase logo
- Tagline
- Background: brand gradient or pattern

**Right Panel — Form**:
- Heading: "Welcome back"
- Sub: "Sign in to manage your shop"
- Email input
- Password input with show/hide toggle
- "Forgot Password?" link (non-functional, just UI)
- "Sign In" button (full-width)
- Divider
- "Don't have a shop?" → "Register your shop" link

**Error state**: Inline error banner below form on failed login

---

### PAGE 8: Change Password (`/settings/password`)

**Purpose**: Logged-in user can change their password.

**Layout**: Settings page shell (sidebar nav + main content area)

**Form Card** (centered, ~480px):
- Current Password
- New Password (with strength indicator bar)
- Confirm New Password
- "Update Password" button
- Validation: passwords must match, min length 8

---

### PAGE 9: Shop Admin Dashboard (`/admin/dashboard`)

**Purpose**: Overview home for a logged-in shop admin.

**Layout**: Sidebar nav + top header + main content

**Sidebar Navigation**:
- Logo
- Dashboard (home icon)
- Print Jobs (jobs icon) with badge showing pending count
- Shop Profile (store icon)
- Settings (gear icon)
- Logout

**Top Header**:
- Page title
- Shop name chip
- Avatar/initials circle

**Dashboard Main Content**:

1. **Stats Row** (4 stat cards):
   - Total Jobs (all time)
   - Pending Jobs (amber)
   - Completed Jobs (green)
   - Cancelled Jobs (red)

2. **Recent Jobs Table** (last 5-10 jobs):
   - Columns: Token, Customer Name, Status Badge, Files, Created At, Actions
   - Row actions: "View" button
   - "View All Jobs →" link below table

3. **Quick Actions Card**:
   - "Update Shop Profile"
   - "View All Pending Jobs"

---

### PAGE 10: Shop Admin — Print Jobs List (`/admin/jobs`)

**Purpose**: Full paginated job queue for the shop admin.

**Layout**: Same sidebar + header shell

**Content**:

1. **Filter Bar** (horizontal row):
   - Status filter: All / Pending / Processing / Completed / Cancelled (segmented buttons)
   - Search input: "Search by customer name or token..."
   - Date range: from / to date pickers
   - "Apply Filters" button

2. **Jobs Table**:
   - Columns: Token (monospace), Customer Name, Phone, Status (badge), Files Count, Estimated Cost, Created At, Actions
   - Action buttons per row: "View Details" (primary), "Cancel" (danger, only for active jobs)
   - Sortable column headers (UI only)
   - Empty state for no jobs

3. **Pagination**: Page numbers with prev/next

---

### PAGE 11: Shop Admin — Job Detail (`/admin/jobs/:jobId`)

**Purpose**: Full detail view of a single print job.

**Layout**: Same shell, content area with two columns

**Left Column (2/3)**:

1. **Job Header Card**:
   - Token (large monospace): E9A4F8
   - Status badge (large)
   - Submitted at / Updated at timestamps

2. **Customer Info Card**:
   - Name, Phone, Email

3. **Print Options Card**:
   - Color: Yes/No
   - Copies
   - Paper Size
   - Double-Sided: Yes/No
   - Special Instructions (blockquote style if present)

4. **Files Card**:
   - List of uploaded files:
     - File icon (PDF/image based on type)
     - Filename
     - File size (human readable)
     - Page count (if available)
     - "Download" button

**Right Column (1/3)**:

5. **Job Management Card**:
   - Update Status section:
     - Status dropdown: PENDING / PROCESSING / COMPLETED / CANCELLED
     - Total Pages input (number, triggers auto cost calculation)
     - Admin Notes textarea
     - "Update Status" button

6. **Cost Override Card**:
   - Estimated Cost input (₹ prefix)
   - Admin Notes textarea
   - "Save Notes & Cost" button

7. **Danger Zone Card**:
   - "Cancel This Job" (red outlined button)
   - Confirm modal on click

---

### PAGE 12: Shop Admin — Shop Profile (`/admin/profile`)

**Purpose**: Edit the shop's public information.

**Layout**: Same shell, centered form card

**Form**:
- Shop Name
- Address
- Phone
- Email
- Description (textarea)
- Active Status: toggle switch ("Shop is currently OPEN / CLOSED")

**Requirements Sub-section**:
- Accepted Formats: multi-checkbox (PDF, JPG, PNG, DOCX)
- Max File Size (MB)
- Max Files Per Job
- Price per page BW (₹)
- Price per page Color (₹)

**Save button**: "Save Changes"

---

### PAGE 13: Super Admin Dashboard (`/superadmin/dashboard`)

**Purpose**: Platform-wide overview for Super Admin.

**Layout**: Different sidebar (wider, darker) + header + main

**Sidebar Navigation**:
- Logo + "Super Admin" badge
- Dashboard
- Shops
- All Print Jobs
- Analytics
- Settings
- Logout

**Dashboard Main Content**:

1. **Platform Stats Row** (5 stat cards):
   - Total Shops
   - Active Shops
   - Pending Approval (amber badge)
   - Total Jobs (all time)
   - Jobs This Month

2. **Pending Approvals Card** (highlighted section):
   - List of shops awaiting approval
   - Each row: Shop Name, Owner, Submitted At, "Approve" (green) + "Reject" (red) buttons

3. **Recent Jobs Across Platform** (mini table, last 10)

---

### PAGE 14: Super Admin — Shops List (`/superadmin/shops`)

**Purpose**: Full management of all shops.

**Layout**: Same super admin shell

**Content**:

1. **Filter Bar**:
   - Search: shop name, email
   - Active filter: All / Active / Inactive
   - Approved filter: All / Approved / Pending

2. **"+ Create New Shop" button** (top right, opens modal or navigates to form)

3. **Shops Table**:
   - Columns: Shop Name, Owner, Email, Slug, Status (Active badge), Approved (badge), Created At, Actions
   - Actions: "View / Edit" | "Approve/Disapprove" toggle | "Activate/Deactivate" toggle | "Delete" (danger)

4. **Pagination**

---

### PAGE 15: Super Admin — Create Shop (`/superadmin/shops/new`)

**Purpose**: Manually provision a new shop.

**Layout**: Form page (same as public register form but in admin shell)

**Form** (same fields as shop registration):
- Shop info section
- Admin account section
- Requirements & pricing section
- "Create Shop" button (auto-approved, or specify `isApproved` toggle)

---

### PAGE 16: Super Admin — All Jobs (`/superadmin/jobs`)

**Purpose**: View all print jobs across every shop.

**Layout**: Same super admin shell

**Content**:
- Filter by shop name (dropdown)
- Filter by status
- Date range filter
- Jobs table with columns: Token, Customer, Shop Name, Status, Pages, Cost, Created At
- Pagination

---

### PAGE 17: Super Admin — Analytics (`/superadmin/analytics`)

**Purpose**: Platform performance dashboard.

**Layout**: Same super admin shell, dashboard-style grid

**Content**:

1. **Date Range Selector**: From / To date pickers + "Apply" button

2. **KPI Cards Row**:
   - Total Shops
   - Active Shops
   - Total Jobs in Period
   - Completed Jobs
   - Cancelled Jobs
   - Pending Jobs
   - Total Files Uploaded

3. **Bar Chart**: Jobs by Day (use a charting library — Recharts or Chart.js)
   - X-axis: date, Y-axis: job count

4. **Top Shops Table**:
   - Columns: Shop Name, Job Count, Completion Rate (progress bar)

---

## Shared Components to Design

1. **Navbar** (public) — Logo, nav links, CTA buttons, mobile responsive
2. **Sidebar** (admin) — Collapsible on mobile, active route highlight
3. **Status Badge** — Color-coded pill for PENDING / PROCESSING / COMPLETED / CANCELLED
4. **Job Card** (compact) — Token, customer, status, date, action button
5. **Shop Card** (public listing) — Name, address, pricing, formats, CTA
6. **File Upload Zone** — Drag-and-drop with file list management
7. **Stat Card** — Icon, label, number, optional trend indicator
8. **Modal / Confirm Dialog** — Generic confirm/cancel modal for destructive actions
9. **Toast Notifications** — Success / error / info toasts (top-right)
10. **Loading Skeleton** — Placeholder cards/rows while fetching
11. **Pagination Controls** — Prev/next + page numbers
12. **Empty State** — Illustrated empty states for tables and lists
13. **404 Page** — Friendly not-found page with "Go Home" link

---

## Responsiveness Requirements

- **Mobile-first** design. All pages must work on 375px width.
- Tables convert to card-list on mobile.
- Sidebar collapses to bottom nav or hamburger overlay on mobile.
- Upload form stacks vertically on mobile.
- Landing page hero adjusts to single column.

---

## Technical Notes for AI Implementation

- Use **React** with functional components and hooks.
- Use **React Router** for client-side routing (all routes listed above).
- Use **Tailwind CSS** for styling (or plain CSS-in-JS with the design tokens defined).
- All API calls are **mocked / stubbed** — use hardcoded JSON matching the API response shapes shown below. No real API calls needed.
- Use **localStorage** to simulate auth state (store `accessToken`, `role`).
- Protected routes: `/admin/*` requires `role === "ADMIN"`, `/superadmin/*` requires `role === "SUPER_ADMIN"`.
- Implement **React Context** for auth state (user, role, token).
- Use **Recharts** for analytics charts.

---

## Mock Data to Use Throughout

```json
// Shops
[
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
    "requirements": {
      "acceptedFormats": ["PDF", "JPG", "PNG"],
      "maxFileSizeMb": 50,
      "maxFilesPerJob": 10,
      "pricePerPageBW": 1.50,
      "pricePerPageColor": 8.00
    }
  }
]

// Print Jobs
[
  {
    "id": "e4c76b92-ca9d-40c2-bd74-1234a9efb923",
    "accessToken": "E9A4F8",
    "customerName": "Amit Kumar",
    "customerPhone": "+919988776655",
    "customerEmail": "amit.kumar@example.com",
    "status": "PENDING",
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
    "accessToken": "B3K9X2",
    "customerName": "Priya Singh",
    "customerPhone": "+919871234567",
    "customerEmail": "priya.singh@example.com",
    "status": "PROCESSING",
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
    "accessToken": "T7M3P5",
    "customerName": "Rohan Mehta",
    "customerPhone": "+919909876543",
    "customerEmail": "rohan.mehta@example.com",
    "status": "COMPLETED",
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
]

// Analytics
{
  "period": { "from": "2026-05-01", "to": "2026-05-31" },
  "totalShops": 2,
  "activeShops": 2,
  "totalJobsInPeriod": 3,
  "completedJobs": 1,
  "cancelledJobs": 0,
  "pendingJobs": 1,
  "totalFilesUploaded": 3,
  "topShops": [
    { "shopName": "Campus Quick Print", "jobCount": 2, "completionRate": 0.5 },
    { "shopName": "Metro Print Hub", "jobCount": 1, "completionRate": 1.0 }
  ],
  "jobsByDay": [
    { "date": "2026-05-21", "count": 1 },
    { "date": "2026-05-22", "count": 1 },
    { "date": "2026-05-23", "count": 1 }
  ]
}

// Test Login Credentials
// Shop Admin: email: "owner@printease.com", password: "Password123!", role: "ADMIN"
// Super Admin: email: "superadmin@printease.com", password: "SuperAdmin123!", role: "SUPER_ADMIN"
```

---

## Route Summary

| Route | Page | Auth |
|---|---|---|
| `/` | Landing / Home | Public |
| `/shops` | Find a Shop | Public |
| `/shops/:slug` | Shop Detail | Public |
| `/shops/:slug/upload` | Upload Files | Public |
| `/track/:token` | Track Job | Public |
| `/register` | Shop Registration | Public |
| `/login` | Login | Public |
| `/admin/dashboard` | Shop Admin Dashboard | ADMIN |
| `/admin/jobs` | Shop Admin Jobs List | ADMIN |
| `/admin/jobs/:jobId` | Job Detail | ADMIN |
| `/admin/profile` | Shop Profile Edit | ADMIN |
| `/admin/settings/password` | Change Password | ADMIN |
| `/superadmin/dashboard` | Super Admin Dashboard | SUPER_ADMIN |
| `/superadmin/shops` | All Shops List | SUPER_ADMIN |
| `/superadmin/shops/new` | Create Shop | SUPER_ADMIN |
| `/superadmin/jobs` | All Jobs | SUPER_ADMIN |
| `/superadmin/analytics` | Analytics | SUPER_ADMIN |
| `*` | 404 Not Found | Public |
