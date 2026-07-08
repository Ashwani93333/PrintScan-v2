# Privacy Policy

**PrintEase**
Effective date: [Insert date]
Last updated: [Insert date]

---

## 1. Introduction

PrintEase ("we", "us", "our", "PrintEase") operates an online platform that connects customers with local print shops, allowing users to upload documents, place print jobs, and track and collect orders from partner shops ("the Service").

This Privacy Policy explains what information we collect, how we use it, who we share it with, and the choices you have. It applies to all users of PrintEase, including customers placing print jobs, shop owners/partners managing their shop, and visitors to our website.

By using PrintEase, you agree to the practices described in this policy. If you do not agree, please do not use the Service.

If you have questions about this policy, contact us at: **[insert support/privacy email, e.g. privacy@printease.com]**

---

## 2. Information We Collect

### 2.1 Information you provide directly

- **Account information**: name, email address, phone number, password (stored as a secure hash, never in plain text), and role (customer, shop owner, admin).
- **Shop information** (for shop partners): shop name, address, phone number, shop slug/URL, business details, and bank/payment details for payouts (if applicable).
- **Print job files**: documents, images, or PDFs you upload for printing. These may contain personal or sensitive information depending on what you choose to upload (e.g. ID cards, admit cards, resumes, assignments).
- **Print job details**: page count, color/B&W preference, number of copies, special instructions, and status of your order.
- **Communications**: messages, feedback, or support requests you send us.

### 2.2 Information collected automatically

- **Log and device data**: IP address, browser type, device type, operating system, and access timestamps, collected automatically when you use the Service.
- **Cookies and similar technologies**: we use a small number of cookies, primarily an authentication cookie (`printease_token`) that keeps you securely logged in, and a CSRF-protection cookie. These are essential to the Service functioning and are described further in Section 7.
- **Usage data**: pages visited, features used, and general interaction patterns with the Service, used to improve reliability and performance.

### 2.3 Information from third parties

- If you sign in or interact with PrintEase through a third-party service (if applicable in the future, e.g. Google sign-in), we may receive basic profile information from that provider.
- Payment processors (if used) may share limited transaction confirmation data with us; we do not receive or store full payment card details.

---

## 3. How We Use Your Information

We use the information we collect to:

1. Create and manage your account, and authenticate your login sessions securely.
2. Process, route, and track print jobs between customers and partner shops.
3. Store and deliver uploaded files to the relevant print shop for fulfillment.
4. Generate unique job tokens/access codes so you can track and collect your print jobs.
5. Communicate with you about your orders, account activity, or support requests.
6. Detect, prevent, and investigate fraud, abuse, or security incidents.
7. Improve, maintain, and monitor the performance and reliability of the Service.
8. Comply with legal obligations where applicable.

We do **not** sell your personal information to third parties, and we do not use your uploaded documents for any purpose other than fulfilling your print job.

---

## 4. How We Store and Protect Your Information

- **Database**: account and order information is stored in a secured, access-controlled PostgreSQL database hosted by our infrastructure provider.
- **File storage**: uploaded documents are stored using secure cloud object storage (e.g. Cloudflare R2 / AWS S3-compatible storage). Files are associated with a unique, non-guessable identifier and are not publicly indexed or searchable.
- **Passwords**: stored using industry-standard one-way hashing; we cannot view your plain-text password.
- **Authentication**: session tokens are stored in secure, `httpOnly` cookies that are inaccessible to client-side scripts, reducing the risk of theft via malicious code.
- **Transport security**: all data transmitted between your browser and our servers is encrypted using HTTPS/TLS.
- **Access control**: internal access to user data and files is limited to authorized personnel who need it to operate the Service (e.g. resolving a support issue).

While we take reasonable technical and organizational measures to protect your information, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.

---

## 5. File Retention and Deletion

- Uploaded print job files are retained for a limited period after job completion (e.g. **[insert retention period, such as 7-30 days]**) to allow reprints or dispute resolution, after which they are automatically deleted from our storage.
- You may request earlier deletion of your uploaded files by contacting us at the email listed in Section 1.
- Account and order metadata (excluding file contents) may be retained longer for accounting, fraud prevention, and legal compliance purposes, even after file deletion.

---

## 6. Who We Share Information With

We share information only in the following circumstances:

- **Print shop partners**: when you place a print job, the relevant shop receives access to your uploaded file(s) and job details necessary to fulfill your order (e.g. file, page count, special instructions). Shops do not receive your full account details beyond what's needed for the order.
- **Service providers**: we use trusted third-party infrastructure providers to operate the Service, including:
  - Cloud hosting providers (e.g. Railway) for running our backend servers
  - Database hosting (e.g. Neon) for storing structured data
  - Object storage providers (e.g. Cloudflare R2 / AWS S3) for storing uploaded files
  - Frontend hosting/CDN providers (e.g. Vercel) for delivering our website

  These providers process data only on our behalf and under contractual confidentiality and security obligations — they do not use your data for their own purposes.
- **Legal requirements**: we may disclose information if required by law, regulation, legal process, or governmental request, or to protect the rights, property, or safety of PrintEase, our users, or the public.
- **Business transfers**: if PrintEase is involved in a merger, acquisition, or sale of assets, user information may be transferred as part of that transaction, subject to this policy or a policy offering at least equivalent protections.

We do not share your uploaded documents with any party other than the specific shop you selected to fulfill that job.

---

## 7. Cookies

PrintEase uses a minimal set of cookies necessary for the Service to function:

| Cookie | Purpose | Type |
|---|---|---|
| `printease_token` | Keeps you securely logged in (authentication) | Essential, httpOnly |
| CSRF token cookie | Protects against cross-site request forgery attacks | Essential |

We do not use third-party advertising or tracking cookies. Because our cookies are essential to core functionality (staying logged in, securing your session), disabling them will prevent you from using account-based features of the Service.

---

## 8. Your Rights and Choices

Depending on your location, you may have the right to:

- **Access** the personal information we hold about you.
- **Correct** inaccurate or incomplete information.
- **Delete** your account and associated personal data, subject to legal/record-keeping exceptions.
- **Request deletion** of specific uploaded files.
- **Object to or restrict** certain processing of your data.
- **Withdraw consent**, where processing is based on consent, without affecting the lawfulness of processing before withdrawal.

To exercise any of these rights, contact us at **[insert privacy email]**. We may need to verify your identity before fulfilling certain requests.

---

## 9. Children's Privacy

PrintEase is not intended for use by children under the age of 13 (or the minimum age required in your jurisdiction). We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us so we can delete it.

---

## 10. International Users

If you access PrintEase from outside the country where our servers are located, your information may be transferred to, stored, and processed in a different country. By using the Service, you consent to this transfer, in accordance with this Privacy Policy.

---

## 11. Data Breach Notification

In the event of a data breach that poses a risk to your rights and freedoms, we will notify affected users and relevant authorities as required by applicable law, without undue delay.

---

## 12. Third-Party Links

Our Service may contain links to third-party websites (e.g. partner shop websites, payment gateways). We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies separately.

---

## 13. Changes to This Policy

We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will post the updated policy on this page with a revised "Last updated" date. Material changes may also be communicated via email or an in-app notice.

---

## 14. Contact Us

If you have any questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us at:

**PrintEase**
Email: [insert email]
Address: [insert business address, if applicable]

---

*This document is provided as a general template and does not constitute legal advice. We recommend having this policy reviewed by a qualified lawyer familiar with data protection law in your operating jurisdiction (e.g. India's Digital Personal Data Protection Act, 2023, and/or GDPR if you serve EU users) before publishing it live, to ensure full compliance with applicable regulations.*
