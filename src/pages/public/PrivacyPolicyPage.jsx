import React from 'react';
import Navbar from '../../components/Navbar';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-surface-dark border border-border rounded-2xl p-8 md:p-12 shadow-xl prose prose-invert max-w-none">
          <h1 className="text-3xl font-serif font-extrabold text-white mb-2">Privacy Policy</h1>
          <p className="text-muted text-sm mb-8">
            <strong>PrintEase</strong><br />
            Effective date: 2026-07-08<br />
            Last updated: 2026-07-09
          </p>

          <hr className="border-border my-8" />

          <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Introduction</h2>
          <p className="text-muted mb-4 leading-relaxed">
            PrintEase ("we", "us", "our", "PrintEase") operates an online platform that connects customers with local print shops, allowing users to upload documents, place print jobs, and track and collect orders from partner shops ("the Service").
          </p>
          <p className="text-muted mb-4 leading-relaxed">
            This Privacy Policy explains what information we collect, how we use it, who we share it with, and the choices you have. It applies to all users of PrintEase, including customers placing print jobs, shop owners/partners managing their shop, and visitors to our website.
          </p>
          <p className="text-muted mb-4 leading-relaxed">
            By using PrintEase, you agree to the practices described in this policy. If you do not agree, please do not use the Service.
          </p>
          <p className="text-muted mb-8 leading-relaxed">
            If you have questions about this policy, contact us at: <strong>printease455@gmail.com</strong>
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Information We Collect</h2>
          <h3 className="text-lg font-semibold text-white mt-6 mb-3">2.1 Information you provide directly</h3>
          <ul className="list-disc pl-5 text-muted mb-6 space-y-2">
            <li><strong>Account information</strong>: name, email address, phone number, password (stored as a secure hash, never in plain text), and role (customer, shop owner, admin).</li>
            <li><strong>Shop information</strong> (for shop partners): shop name, address, phone number, shop slug/URL, business details, and bank/payment details for payouts (if applicable).</li>
            <li><strong>Print job files</strong>: documents, images, or PDFs you upload for printing. These may contain personal or sensitive information depending on what you choose to upload (e.g. ID cards, admit cards, resumes, assignments).</li>
            <li><strong>Print job details</strong>: page count, color/B&W preference, number of copies, special instructions, and status of your order.</li>
            <li><strong>Communications</strong>: messages, feedback, or support requests you send us.</li>
          </ul>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">2.2 Information collected automatically</h3>
          <ul className="list-disc pl-5 text-muted mb-6 space-y-2">
            <li><strong>Log and device data</strong>: IP address, browser type, device type, operating system, and access timestamps, collected automatically when you use the Service.</li>
            <li><strong>Cookies and similar technologies</strong>: we use a small number of cookies, primarily an authentication cookie (<code>printease_token</code>) that keeps you securely logged in, and a CSRF-protection cookie. These are essential to the Service functioning and are described further in Section 7.</li>
            <li><strong>Usage data</strong>: pages visited, features used, and general interaction patterns with the Service, used to improve reliability and performance.</li>
          </ul>

          {/* <h3 className="text-lg font-semibold text-white mt-6 mb-3">2.3 Information from third parties</h3>
          <ul className="list-disc pl-5 text-muted mb-8 space-y-2">
            <li>If you sign in or interact with PrintEase through a third-party service (if applicable in the future, e.g. Google sign-in), we may receive basic profile information from that provider.</li>
            <li>Payment processors (if used) may share limited transaction confirmation data with us; we do not receive or store full payment card details.</li>
          </ul> */}

          <h2 className="text-xl font-bold text-white mt-8 mb-4">3. How We Use Your Information</h2>
          <p className="text-muted mb-4 leading-relaxed">We use the information we collect to:</p>
          <ol className="list-decimal pl-5 text-muted mb-6 space-y-2">
            <li>Create and manage your account, and authenticate your login sessions securely.</li>
            <li>Process, route, and track print jobs between customers and partner shops.</li>
            <li>Store and deliver uploaded files to the relevant print shop for fulfillment.</li>
            <li>Generate unique job tokens/access codes so you can track and collect your print jobs.</li>
            <li>Communicate with you about your orders, account activity, or support requests.</li>
            <li>Detect, prevent, and investigate fraud, abuse, or security incidents.</li>
            <li>Improve, maintain, and monitor the performance and reliability of the Service.</li>
            <li>Comply with legal obligations where applicable.</li>
          </ol>
          <p className="text-muted mb-8 leading-relaxed">
            We do <strong>not</strong> sell your personal information to third parties, and we do not use your uploaded documents for any purpose other than fulfilling your print job.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">4. How We Store and Protect Your Information</h2>
          <ul className="list-disc pl-5 text-muted mb-6 space-y-2">
            <li><strong>Database</strong>: account and order information is stored in a secured, access-controlled PostgreSQL database hosted by our infrastructure provider.</li>
            <li><strong>File storage</strong>: uploaded documents are stored using secure cloud object storage (e.g. Cloudflare R2 / AWS S3-compatible storage). Files are associated with a unique, non-guessable identifier and are not publicly indexed or searchable.</li>
            <li><strong>Passwords</strong>: stored using industry-standard one-way hashing; we cannot view your plain-text password.</li>
            <li><strong>Authentication</strong>: session tokens are stored in secure, <code>httpOnly</code> cookies that are inaccessible to client-side scripts, reducing the risk of theft via malicious code.</li>
            <li><strong>Transport security</strong>: all data transmitted between your browser and our servers is encrypted using HTTPS/TLS.</li>
            <li><strong>Access control</strong>: internal access to user data and files is limited to authorized personnel who need it to operate the Service (e.g. resolving a support issue).</li>
          </ul>
          <p className="text-muted mb-8 leading-relaxed">
            While we take reasonable technical and organizational measures to protect your information, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">5. File Retention and Deletion</h2>
          <ul className="list-disc pl-5 text-muted mb-8 space-y-2">
            <li>Uploaded print job files are retained for a limited period after job completion (e.g. <strong>7-30 days</strong>) to allow reprints or dispute resolution, after which they are automatically deleted from our storage.</li>
            <li>You may request earlier deletion of your uploaded files by contacting us at the email listed in Section 1.</li>
            <li>Account and order metadata (excluding file contents) may be retained longer for accounting, fraud prevention, and legal compliance purposes, even after file deletion.</li>
          </ul>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">6. Who We Share Information With</h2>
          <p className="text-muted mb-4 leading-relaxed">We share information only in the following circumstances:</p>
          <ul className="list-disc pl-5 text-muted mb-6 space-y-2">
            <li><strong>Print shop partners</strong>: when you place a print job, the relevant shop receives access to your uploaded file(s) and job details necessary to fulfill your order (e.g. file, page count, special instructions). Shops do not receive your full account details beyond what's needed for the order.</li>
            <li><strong>Service providers</strong>: we use trusted third-party infrastructure providers to operate the Service, including cloud hosting providers, database hosting, object storage providers, and frontend hosting/CDN providers. These providers process data only on our behalf and under contractual confidentiality and security obligations.</li>
            <li><strong>Legal requirements</strong>: we may disclose information if required by law, regulation, legal process, or governmental request, or to protect the rights, property, or safety of PrintEase, our users, or the public.</li>
            <li><strong>Business transfers</strong>: if PrintEase is involved in a merger, acquisition, or sale of assets, user information may be transferred as part of that transaction, subject to this policy or a policy offering at least equivalent protections.</li>
          </ul>
          <p className="text-muted mb-8 leading-relaxed">
            We do not share your uploaded documents with any party other than the specific shop you selected to fulfill that job.
          </p>

          {/* <h2 className="text-xl font-bold text-white mt-8 mb-4">7. Cookies</h2>
          <p className="text-muted mb-4 leading-relaxed">
            PrintEase uses a minimal set of cookies necessary for the Service to function:
          </p>
          <div className="overflow-x-auto mb-6 border border-border rounded-lg">
            <table className="min-w-full divide-y divide-border text-sm text-left">
              <thead className="bg-surface-ink text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Cookie</th>
                  <th className="px-4 py-3 font-semibold">Purpose</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-muted">
                <tr>
                  <td className="px-4 py-3"><code>printease_token</code></td>
                  <td className="px-4 py-3">Keeps you securely logged in (authentication)</td>
                  <td className="px-4 py-3">Essential, httpOnly</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">CSRF token cookie</td>
                  <td className="px-4 py-3">Protects against cross-site request forgery attacks</td>
                  <td className="px-4 py-3">Essential</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-muted mb-8 leading-relaxed">
            We do not use third-party advertising or tracking cookies. Because our cookies are essential to core functionality (staying logged in, securing your session), disabling them will prevent you from using account-based features of the Service.
          </p> */}

          <h2 className="text-xl font-bold text-white mt-8 mb-4">7. Your Rights and Choices</h2>
          <p className="text-muted mb-4 leading-relaxed">Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-5 text-muted mb-6 space-y-2">
            <li><strong>Access</strong> the personal information we hold about you.</li>
            <li><strong>Correct</strong> inaccurate or incomplete information.</li>
            <li><strong>Delete</strong> your account and associated personal data, subject to legal/record-keeping exceptions.</li>
            <li><strong>Request deletion</strong> of specific uploaded files.</li>
            <li><strong>Object to or restrict</strong> certain processing of your data.</li>
            <li><strong>Withdraw consent</strong>, where processing is based on consent, without affecting the lawfulness of processing before withdrawal.</li>
          </ul>
          <p className="text-muted mb-8 leading-relaxed">
            To exercise any of these rights, contact us at <strong>printease455@gmail.com</strong>. We may need to verify your identity before fulfilling certain requests.
          </p>

          {/* <h2 className="text-xl font-bold text-white mt-8 mb-4">9. Children's Privacy</h2>
          <p className="text-muted mb-8 leading-relaxed">
            PrintEase is not intended for use by children under the age of 13 (or the minimum age required in your jurisdiction). We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us so we can delete it.
          </p> */}

          {/* <h2 className="text-xl font-bold text-white mt-8 mb-4">10. International Users</h2>
          <p className="text-muted mb-8 leading-relaxed">
            If you access PrintEase from outside the country where our servers are located, your information may be transferred to, stored, and processed in a different country. By using the Service, you consent to this transfer, in accordance with this Privacy Policy.
          </p> */}

          <h2 className="text-xl font-bold text-white mt-8 mb-4">8. Data Breach Notification</h2>
          <p className="text-muted mb-8 leading-relaxed">
            In the event of a data breach that poses a risk to your rights and freedoms, we will notify affected users and relevant authorities as required by applicable law, without undue delay.
          </p>

          {/* <h2 className="text-xl font-bold text-white mt-8 mb-4">12. Third-Party Links</h2>
          <p className="text-muted mb-8 leading-relaxed">
            Our Service may contain links to third-party websites (e.g. partner shop websites, payment gateways). We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies separately.
          </p> */}

          <h2 className="text-xl font-bold text-white mt-8 mb-4">9. Changes to This Policy</h2>
          <p className="text-muted mb-8 leading-relaxed">
            We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will post the updated policy on this page with a revised "Last updated" date. Material changes may also be communicated via email or an in-app notice.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">10. Contact Us</h2>
          <p className="text-muted mb-8 leading-relaxed">
            If you have any questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us at:
          </p>
          <div className="bg-surface-ink border border-border p-4 rounded-xl text-muted text-sm space-y-1">
            <p><strong>PrintEase</strong></p>
            <p>Email: printease455@gmail.com</p>
            <p>WhatsApp: 7303028574</p>
            <p>Instagram: ___ashwani01</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
