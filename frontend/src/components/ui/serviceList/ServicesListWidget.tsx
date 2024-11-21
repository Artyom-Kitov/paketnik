import { ServiceWidget } from "./ServiceWidget";
import { getServices } from "../../../api"
import {useQuery } from '@tanstack/react-query'



export const ServicesListWidget = ({
  setCurrentWidget,
}: {
  setCurrentWidget: (widget: string) => void;
}) => {
  const query = useQuery({ queryKey: ['service'], queryFn: getServices })


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
            {query.data && query.data?.length > 0 && query.data?.map((service) => (
            <ServiceWidget key={service.id} data={service} />
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
