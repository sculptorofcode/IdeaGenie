import React from "react";

export default function SettingsLayout({ children }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto pt-8 pb-16">
        {children}
      </div>
    </div>
  );
}
