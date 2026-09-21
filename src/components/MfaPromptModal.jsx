"use client";

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ShieldCheckIcon, DevicePhoneMobileIcon, QrCodeIcon, KeyIcon, ClockIcon } from "@heroicons/react/24/outline";

const STEPS = [
  {
    icon: DevicePhoneMobileIcon,
    title: "Install an authenticator app",
    text: "Google Authenticator, Microsoft Authenticator or Authy — any of them works.",
  },
  {
    icon: QrCodeIcon,
    title: "Scan the QR code we show you",
    text: "The app starts showing a 6-digit code that changes every 30 seconds.",
  },
  {
    icon: KeyIcon,
    title: "Enter the code once to confirm",
    text: "Then save your backup codes somewhere safe, in case you lose your phone.",
  },
];

/**
 * Shown right after a successful login when the account has two-step
 * verification switched off. Explains why it matters and how to turn it on;
 * the doctor can activate now or skip for this session.
 */
export default function MfaPromptModal({ open, onActivate, onSkip }) {
  return (
    <Dialog open={open} onClose={onSkip} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-[#0f1f14]/60 backdrop-blur-sm transition duration-200 ease-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <DialogPanel
          transition
          className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden
                     transition duration-200 ease-out
                     data-[closed]:opacity-0 data-[closed]:translate-y-6 sm:data-[closed]:translate-y-0 sm:data-[closed]:scale-95"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-[#5F8D4E] to-[#285430] px-6 pt-6 pb-5 sm:pt-7 sm:pb-6 text-white">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" aria-hidden="true" />
            <div className="absolute right-10 -bottom-10 h-24 w-24 rounded-full bg-white/5" aria-hidden="true" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/30">
                <ShieldCheckIcon className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-semibold leading-snug">
                  Protect your patients&rsquo; records
                </DialogTitle>
                <p className="text-sm text-white/80 mt-0.5">Turn on two-step verification</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 pt-5 pb-5">
            <p className="text-sm sm:text-[15px] text-gray-600 leading-relaxed">
              Your login opens patient records and clinical photographs. If your password is ever guessed or
              phished, a code from your phone is what keeps everyone else out.
            </p>

            <ol className="mt-5 space-y-4">
              {STEPS.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="flex gap-3.5">
                  <div className="relative shrink-0 self-stretch">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E4F4E8] text-[#285430]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="absolute left-1/2 top-11 -bottom-3 w-px -translate-x-1/2 bg-gray-200" aria-hidden="true" />
                    )}
                  </div>
                  <div className="pt-0.5">
                    <p className="text-sm font-semibold text-gray-900">{title}</p>
                    <p className="text-sm text-gray-500 leading-snug mt-0.5">{text}</p>
                  </div>
                </li>
              ))}
            </ol>

          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 bg-gray-50 px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-4">
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={onSkip}
                className="inline-flex h-11 items-center justify-center rounded-xl px-4 text-[15px] font-medium text-gray-600
                           border border-gray-200 bg-white sm:border-transparent sm:bg-transparent
                           hover:bg-white hover:border-gray-300 hover:text-gray-900 transition-colors
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5F8D4E]/40"
              >
                Skip for now
              </button>
              <button
                type="button"
                onClick={onActivate}
                className="inline-flex h-11 items-center justify-center rounded-xl px-5 text-[15px] font-semibold text-white
                           bg-gradient-to-r from-[#5F8D4E] to-[#4a7a3a] shadow-sm
                           hover:from-[#4a7a3a] hover:to-[#3d6330] hover:shadow-md transition-all
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5F8D4E]/40 focus-visible:ring-offset-2"
              >
                Activate two-step verification
              </button>
            </div>
            <p className="mt-3 flex items-center justify-center sm:justify-start gap-1.5 text-xs text-gray-400">
              <ClockIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>About a minute &middot; also available later under Security</span>
            </p>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
