import Link from "next/link";
import Example from "@/components/navbar";

export const metadata = {
  title: "Privacy & Data Protection — DermaDrishti",
  description: "How DermaDrishti collects, stores, protects and deletes patient and doctor data.",
};

// TODO before publishing: replace the three bracketed placeholders below with
// the real grievance officer details. The DPDP Act requires a published
// contact for data-principal requests.
const GRIEVANCE_OFFICER = {
  name: "[Grievance Officer name]",
  email: "[grievance email address]",
  address: "[postal address of Ankad Cutiscience]",
};

const LAST_UPDATED = "21 September 2026";

const H2 = ({ children }) => <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-10 mb-3">{children}</h2>;
const P = ({ children }) => <p className="text-gray-700 leading-relaxed mb-3">{children}</p>;
const UL = ({ children }) => <ul className="list-disc pl-6 space-y-1.5 text-gray-700 mb-3">{children}</ul>;

export default function PrivacyPage() {
  return (
    <div className="bg-white w-full min-h-screen">
      <Example />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900">Privacy &amp; Data Protection Notice</h1>
        <p className="text-sm text-gray-500 mt-2">Last updated {LAST_UPDATED}</p>

        <P>
          DermaDrishti is a dermoscopy reporting service operated by Ankad Cutiscience (&ldquo;we&rdquo;). Doctors upload
          clinical and dermoscopic photographs of their patients, together with brief clinical details, and receive a
          specialist report. This notice explains what we collect, why, how it is protected, how long it is kept and the
          rights of the people it concerns, in line with the Digital Personal Data Protection Act, 2023.
        </P>

        <H2>Who this covers</H2>
        <UL>
          <li><strong>Doctors</strong> who create an account and submit cases.</li>
          <li><strong>Patients</strong> whose photographs and details are submitted by their treating doctor. The doctor obtains the patient&rsquo;s informed consent and confirms this at the time of upload; we record that confirmation with a timestamp.</li>
        </UL>

        <H2>What we collect</H2>
        <UL>
          <li><strong>Doctor account:</strong> name, email, phone number, age, qualification, password (stored only as a salted hash), optional authenticator-app enrolment.</li>
          <li><strong>Patient case:</strong> first and last name, age, gender, site and duration of the condition, previous treatment, clinical impression, one clinical photograph and one or more dermoscopic photographs, and the specialist&rsquo;s annotated copies and findings.</li>
          <li><strong>Payment:</strong> the Razorpay order and payment identifiers and the amount. Card and bank details are handled by Razorpay and never reach us.</li>
          <li><strong>Security records:</strong> an audit log of sign-ins, failed sign-ins, and which account viewed, created or deleted which case, with the IP address and browser used.</li>
        </UL>

        <H2>Why we use it</H2>
        <UL>
          <li>To produce the dermoscopy report the doctor has requested for that patient.</li>
          <li>To operate accounts, take payment and prevent fraud.</li>
          <li>To keep the service secure and to investigate and, where required, notify about security incidents.</li>
        </UL>
        <P>We do not use patient photographs for any other purpose, including research, marketing or training, without separate explicit consent.</P>

        <H2>How it is protected</H2>
        <UL>
          <li>Photographs are stripped of embedded metadata (location, device) on upload and stored as private assets that cannot be opened without a signed link that expires within 30 minutes.</li>
          <li>All traffic is encrypted in transit; data is encrypted at rest by our hosting providers.</li>
          <li>Doctors see only their own patients. Every access to a patient record is logged.</li>
          <li>Accounts are protected by strong-password rules, rate limiting, automatic lockout and optional two-step verification with an authenticator app.</li>
        </UL>

        <H2>Where it is stored and who processes it</H2>
        <P>
          Data is stored with MongoDB Atlas (database), Cloudinary (photographs) and Render/Vercel (application hosting), and payments are processed by Razorpay. These providers act on our instructions and may store data outside India. Emails (verification codes, password resets, alerts) are sent through Google Workspace/Gmail.
        </P>

        <H2>How long we keep it</H2>
        <UL>
          <li><strong>Abandoned submissions</strong> (uploaded but never paid for) are deleted automatically after 7 days.</li>
          <li><strong>Original photographs</strong> are deleted automatically 90 days after the report is issued; the annotated copies on the report remain as the medical record.</li>
          <li><strong>Completed reports</strong> are retained as medical records for the period required by applicable medical-records regulations, and then deleted.</li>
          <li><strong>Doctor accounts</strong> are kept until the doctor asks us to close them.</li>
          <li><strong>Audit logs</strong> are kept for security and legal purposes.</li>
        </UL>

        <H2>Your rights</H2>
        <P>Patients and doctors can ask us to:</P>
        <UL>
          <li>tell them what personal data we hold about them and how it is used;</li>
          <li>correct inaccurate data;</li>
          <li>erase their data, subject to medical-records retention obligations;</li>
          <li>withdraw consent for future processing.</li>
        </UL>
        <P>
          Patients should normally make these requests through their treating doctor, who submitted the case; either can contact the grievance officer below directly. We respond within 30 days.
        </P>

        <H2>Grievance officer</H2>
        <div className="surface p-4 sm:p-5 text-gray-800">
          <p className="font-semibold">{GRIEVANCE_OFFICER.name}</p>
          <p>{GRIEVANCE_OFFICER.email}</p>
          <p className="text-gray-600 text-sm mt-1">{GRIEVANCE_OFFICER.address}</p>
        </div>
        <P>
          If you are not satisfied with our response you may approach the Data Protection Board of India.
        </P>

        <H2>Changes</H2>
        <P>We will update this notice when our practices change and revise the date at the top. Material changes to how patient data is used will require fresh consent.</P>

        <p className="mt-10 text-sm">
          <Link href="/" className="link-brand">Back to home</Link>
        </p>
      </main>
    </div>
  );
}
