import React from "react";
const Header: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-4">
      <img src="../icons/daytime.png" alt="icon" className="w-8 h-8 mr-2" />
      <h1 className="text-black text-2xl font-semibold">Weather Forecast </h1>
    </div>
  );
};
export default Header;
