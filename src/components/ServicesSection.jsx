import { Card, CardContent } from "@/components/ui/card";
import { Eye, Hospital, Pill, Shield, Thermometer, Users } from "lucide-react";
import React from "react";

export default function ServicesSection() {
  const services = [
    {
      title: "Counseling",
      description:
        "Eu sit proin amet quis malesuada vitae elit. Vel consectetur nibh quis ullamcorper quis. Quam enim tortor.",
      icon: <Users className="w-16 h-16 text-app-primary text-green-600" />,
    },
    {
      title: "Support groups",
      description:
        "Eu sit proin amet quis malesuada vitae elit. Vel consectetur nibh quis ullamcorper quis. Quam enim tortor.",
      icon: <Shield className="w-16 h-16 text-app-primary text-green-600" />,
    },
    {
      title: "Prescription medicine",
      description:
        "Eu sit proin amet quis malesuada vitae elit. Vel consectetur nibh quis ullamcorper quis. Quam enim tortor.",
      icon: <Pill className="w-16 h-16 text-app-primary text-green-600" />,
    },
    {
      title: "Therapies",
      description:
        "Eu sit proin amet quis malesuada vitae elit. Vel consectetur nibh quis ullamcorper quis. Quam enim tortor.",
      icon: <Thermometer className="w-16 h-16 text-app-primary text-green-600" />,
    },
    {
      title: "Brain stimulation",
      description:
        "Eu sit proin amet quis malesuada vitae elit. Vel consectetur nibh quis ullamcorper quis. Quam enim tortor.",
      icon: <Hospital className="w-16 h-16 text-app-primary text-green-600" />,
    },
    {
      title: "Eye Movement",
      description:
        "Eu sit proin amet quis malesuada vitae elit. Vel consectetur nibh quis ullamcorper quis. Quam enim tortor.",
      icon: <Eye className="w-16 h-16 text-app-primary text-green-600" />,
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto py-20 px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-[#242424] mb-4">Our Services</h2>
        <p className="text-[#242424] max-w-lg mx-auto font-paragraph">
          Eu sit proin amet quis malesuada vitae elit. Vel consectetur nibh quis
          ullamcorper quis. Quam enim tortor, id sed
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <Card key={index} className="rounded-[10px] border-2 border-gray-300 overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">
            <CardContent className="p-0">
              <div className="p-8">
                <div className="flex justify-start mb-12">{service.icon}</div>
                <h3 className="font-semibold text-xl text-app-primary tracking-[0.40px] mb-4 font-['Anek_Telugu-SemiBold',Helvetica]">
                  {service.title}
                </h3>
                <p className="text-[#5A5A5A] font-paragraph">{service.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
