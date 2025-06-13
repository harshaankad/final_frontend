import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
  } from "@/components/ui/navigation-menu";
  import React from "react";
  
  const NavigationSection = () => {
    const navItems = [
      { name: "Home", isActive: true },
      { name: "Patients", isActive: false },
    ];
  
    return (
      <header className="w-full h-[72px] bg-green-dark flex items-center">
        <div className="flex items-center ml-[99px]">
          {/* Logo placeholder */}
          <img className="w-[23px] h-6" alt="Logo" src="" />
  
          <NavigationMenu className="ml-[43px]">
            <NavigationMenuList className="flex gap-10">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                  {item.isActive ? (
                    <div className="relative w-[173px] h-[60px] flex items-center justify-center bg-[url(/bg.svg)] bg-[100%_100%]">
                      <span className="font-['Poppins-SemiBold',Helvetica] font-semibold text-green-dark text-base">
                        {item.name}
                      </span>
                    </div>
                  ) : (
                    <NavigationMenuLink className="font-['Poppins-SemiBold',Helvetica] font-semibold text-green-lite text-base">
                      {item.name}
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>
    );
  };
  
  export default NavigationSection;
  