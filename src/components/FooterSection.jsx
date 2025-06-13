import { Facebook, Instagram, Twitter } from "lucide-react";
import React from "react";

export const FooterSection = () => {
  // Quick links data
  const quickLinks = [
    { name: "Home", href: "#" },
    { name: "About", href: "#" },
    { name: "Doctors", href: "#" },
    { name: "Services", href: "#" },
    { name: "Contact", href: "#" },
  ];

  // Services data
  const services = [
    { name: "Vaccination", href: "#" },
    { name: "NDD", href: "#" },
    { name: "Filled Prescription As Is", href: "#" },
    { name: "Patient Referral", href: "#" },
    { name: "Other roofing", href: "#" },
  ];

  // Social media icons
  const socialIcons = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
  ];

  return (
    <footer className="w-full bg-[#E4F4E8] py-20">
      <div className="container mx-auto px-20 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pr-20">
          {/* Brand and description */}
          <div className="space-y-6">
            <h2 className="font-bold text-[#2dcf57] text-[28px] font-['Anek_Telugu-Bold',Helvetica]">
              oxcare
            </h2>
            <p className="text-[#242424] pt-2 w-[260px] font-paragraph font-[number:var(--paragraph-font-weight)] text-[length:var(--paragraph-font-size)] tracking-[var(--paragraph-letter-spacing)] leading-[var(--paragraph-line-height)] [font-style:var(--paragraph-font-style)]">
              Eu sit proin amet quis malesuada vitae elit. Eu sit proin amet quis malesuada vitae elit.
            </p>
            <div className="flex space-x-4">
              {socialIcons.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-[#242424]  hover:text-[#2dcf57] transition-colors"
                >
                  <social.icon size={22} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6 ml-20">
            <h3 className="font-semibold text-[#242424]  text-xl font-['Anek_Telugu-SemiBold',Helvetica]">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-[#242424]  text-md tracking-[0.40px] underline font-['Anek_Telugu-Regular',Helvetica] hover:text-[#2dcf57] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="font-semibold text-[#242424] text-xl font-['Anek_Telugu-SemiBold',Helvetica]">
              Services
            </h3>
            <ul className="space-y-4">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href={service.href}
                    className="text-[#242424] text-md tracking-[0.40px] underline font-['Anek_Telugu-Regular',Helvetica] hover:text-[#2dcf57] transition-colors"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div className="space-y-6">
            <h3 className="font-semibold text-[#242424] text-xl font-['Anek_Telugu-SemiBold',Helvetica]">
              Location
            </h3>
            <p className="text-[#242424] text-md tracking-[0.40px] font-['Anek_Telugu-Regular',Helvetica]">
              2972 Westheimer Rd. Santa Ana, Illinois 85486
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#242424] my-8"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-[#242424] text-base tracking-[0.32px] font-['Anek_Telugu-Regular',Helvetica]">
            ©2022 All Right Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
