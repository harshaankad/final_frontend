"use client";

import { ShieldCheckIcon } from "@heroicons/react/24/outline";

/**
 * Shown right after a successful login when the account has two-step
 * verification switched off. Explains why it matters and how to turn it on;
 * the doctor can activate now or skip for this session.
 */
export default function MfaPromptModal({ open, onActivate, onSkip }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mfa-prompt-title"
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-left">
        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-full bg-[#285430]/10 p-3">
            <ShieldCheckIcon className="h-7 w-7 text-[#285430]" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h2 id="mfa-prompt-title" className="text-xl sm:text-2xl font-semibold text-gray-900">
              Protect your account with two-step verification
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
              Your login gives access to patient records and clinical photographs. If your password is
              ever guessed, leaked or phished, a code from your phone is what stops someone else getting in.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-gray-50 border border-gray-200 p-4 sm:p-5">
          <p className="text-sm font-semibold text-gray-900 mb-3">It takes about a minute:</p>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-3">
              <span className="shrink-0 h-6 w-6 rounded-full bg-[#285430] text-white text-xs font-semibold flex items-center justify-center">1</span>
              <span>Install an authenticator app on your phone — <strong>Google Authenticator</strong>, <strong>Microsoft Authenticator</strong> or <strong>Authy</strong> all work.</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 h-6 w-6 rounded-full bg-[#285430] text-white text-xs font-semibold flex items-center justify-center">2</span>
              <span>Scan the QR code we show you with the app.</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 h-6 w-6 rounded-full bg-[#285430] text-white text-xs font-semibold flex items-center justify-center">3</span>
              <span>Type the 6-digit code from the app to confirm, then save your backup codes somewhere safe.</span>
            </li>
          </ol>
          <p className="mt-3 text-xs text-gray-500">
            From then on, logging in asks for your password and the current code from the app.
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button type="button" onClick={onSkip} className="btn-secondary">
            Skip for now
          </button>
          <button type="button" onClick={onActivate} className="btn-primary">
            Activate two-step verification
          </button>
        </div>
      </div>
    </div>
  );
}
