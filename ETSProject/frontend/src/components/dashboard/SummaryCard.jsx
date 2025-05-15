import React from "react";

const SummaryCard = ({ icon, text, number,color }) => {
  return (
    <div className="rounded flex bg-white shadow-md p-3 w-full">
      <div className={`text-3xl flex justify-center items-center ${color} text-white p-4 rounded-md`}>
        {icon}
      </div>
      <div className="pl-4">
        <p className="text-sm text-gray-500">{text}</p>
        <p className="text-xl font-bold text-gray-800">{number}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
