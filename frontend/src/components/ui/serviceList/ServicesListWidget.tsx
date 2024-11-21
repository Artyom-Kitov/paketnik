import { useEffect, useState } from "react";
import { servicesData } from "../../../fixtures/servicesData";
import { ServiceWidget } from "./ServiceWidget";
import { Service } from "./Service";

export const ServicesListWidget = ({
  setCurrentWidget,
}: {
  setCurrentWidget: (widget: string) => void;
}) => {
  const [streams, setStream] = useState<Service[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleClick = () => setShow(false);
    window.addEventListener("click", handleClick);
    setStream(servicesData);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="text-right text-[#fff] text-2xl font-bold mb-2">
        Services
      </div>
      <div className="w-full bg-[#475569] p-[7px] flex-1 overflow-auto">
        <button
          type="button"
          className="bg-[#2d3748] px-4 py-2 rounded hover:bg-[#252c3a] transition-colors text-white font-bold"
          onClick={() => {
            setCurrentWidget("ServiceRegistation");
          }}
        >
          Register new Service
        </button>
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-[#475569] z-10">
            <tr className="h-[50px]">
              <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
                service
              </th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
                id
              </th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
                port
              </th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
                hex color
              </th>
            </tr>
            <tr className="h-[12px] bg-[#1e293b]"></tr>
            <tr className="h-[7px]"> </tr>
          </thead>
          <tbody>
            {streams.map((stream) => [
              <ServiceWidget key={stream.id} data={stream} />,
            ])}
          </tbody>
        </table>
      </div>
      {show}
    </div>
  );
};
