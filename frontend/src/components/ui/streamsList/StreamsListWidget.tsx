import React, { useState } from "react";

export const StreamsListWidget = () => {
  const [streams, setStream] = useState([]);

  return (
    <div className="w-full h-fit">
      <div className="text-right text-[#fff] text-2xl font-bold">Streams</div>
      <table className="w-full mb-[12px]">
        <thead className="bg-[#475569] h-[50px] w-full">
          <tr>
            <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
              service
            </th>
            <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
              srcip
            </th>
            <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
              srcport
            </th>
            <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
              dstip
            </th>
            <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
              dstport
            </th>
            <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
              started_at
            </th>
            <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
              duration
            </th>
            <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
              up
            </th>
            <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
              down
            </th>
          </tr>
        </thead>
      </table>
      <div className="h-[870px] bg-[#475569]">
        {streams.map((stream) => (
          <div></div>
        ))}
      </div>
    </div>
  );
};
