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
          <div className="relative bg-gradient-to-br from-[#5F8D4E] to-[#285430] px-6 pt-7 pb-6 text-white">
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
          <div className="px-6 pt-5 pb-6">
            <p className="text-sm sm:text-[15px] text-gray-600 leading-relaxed">
              Your login opens patient records and clinical photographs. If your password is ever guessed or
              phished, a code from your phone is what keeps everyone else out.
            </p>

            <ol className="mt-5 space-y-4">
              {STEPS.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="flex gap-3.5">
                  <div className="relative shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E4F4E8] text-[#285430]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="absolute left-1/2 top-10 h-4 w-px -translate-x-1/2 bg-[#E4F4E8]" aria-hidden="true" />
                    )}
                  </div>
                  <div className="pt-0.5">
                    <p className="text-sm font-semibold text-gray-900">{title}</p>
                    <p className="text-sm text-gray-500 leading-snug mt-0.5">{text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex flex-col gap-2.5">
              <button type="button" onClick={onActivate} className="btn-primary w-full">
                Activate two-step verification
              </button>
              <button
                type="button"
                onClick={onSkip}
                className="h-10 w-full rounded-lg text-sm font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors"
              >
                Skip for now
              </button>
            </div>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-400">
              <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" /> Takes about a minute. You can also do this later from Security.
            </p>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
