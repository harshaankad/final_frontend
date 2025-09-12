import { Facebook, Instagram, Twitter } from "lucide-react";
import React from "react";

export const FooterSection = () => {
  // Quick links data
  const quickLinks = [
    { name: "Home", href: "#" },
    { name: "Patients", href: "#" },
  ];

  // Services data
  const services = [
    { name: "Clinical Examination", href: "#" },
    { name: "Reports", href: "#" },
    { name: "Imaging", href: "#" },
    { name: "Consultations", href: "#" },
  ];

  // Social media icons
  const socialIcons = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
  ];

  return (
    <footer className="w-full bg-[#E4F4E8] py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 lg:gap-20">
          {/* Brand and description */}
          <div className="space-y-4 sm:space-y-6 col-span-1 sm:col-span-2 lg:col-span-1 lg:mr-12">
            <h2 className="font-bold text-brandGreen text-2xl sm:text-[28px] font-['Anek_Telugu-Bold',Helvetica]">
              Ankad Cutiscience
            </h2>
            <p className="text-[#242424] pt-2 max-w-[260px] text-sm sm:text-base font-paragraph font-[number:var(--paragraph-font-weight)] text-[length:var(--paragraph-font-size)] tracking-[var(--paragraph-letter-spacing)] leading-[var(--paragraph-line-height)] [font-style:var(--paragraph-font-style)]">
              Trusted dermatology reports and care, led by Dr. B. S. Ankad with 20+ years of expertise.
            </p>
            <div className="flex space-x-4">
              {socialIcons.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-[#242424] hover:text-[#2dcf57] transition-colors duration-200 p-1"
                  aria-label={`Follow us on ${social.icon.name}`}
                >
                  <social.icon size={22} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="font-semibold text-[#242424] text-lg sm:text-xl font-['Anek_Telugu-SemiBold',Helvetica]">
              Quick Links
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-[#242424] text-sm sm:text-base tracking-[0.40px] underline font-['Anek_Telugu-Regular',Helvetica] hover:text-[#2dcf57] transition-colors duration-200 block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="font-semibold text-[#242424] text-lg sm:text-xl font-['Anek_Telugu-SemiBold',Helvetica]">
              Services
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href={service.href}
                    className="text-[#242424] text-sm sm:text-base tracking-[0.40px] underline font-['Anek_Telugu-Regular',Helvetica] hover:text-[#2dcf57] transition-colors duration-200 block"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div className="space-y-4 sm:space-y-6 col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-[#242424] text-lg sm:text-xl font-['Anek_Telugu-SemiBold',Helvetica]">
              Location
            </h3>
            <address className="text-[#242424] text-sm sm:text-base tracking-[0.40px] font-['Anek_Telugu-Regular',Helvetica] not-italic">
              5MHR+2GP, Rotary circle, Deepam Colony, <br />
              Kaulpet, Bagalkote, Karnataka 587101
            </address>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#242424] my-6 sm:my-8"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-[#242424] text-sm sm:text-base tracking-[0.32px] font-['Anek_Telugu-Regular',Helvetica]">
            ©2025 All Right Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
