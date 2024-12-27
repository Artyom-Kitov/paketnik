import { Service } from "../../../api";

export const ServiceWidget = ({ service }: { service: Service }) => {
  return (
    <>
      <td className="text-center text-[#e2e8f0] text-xl font-bold">
        {service.name}
      </td>
      <td className="text-center text-[#e2e8f0] text-xl font-bold">
        {service.id}
      </td>
      <td className="text-center text-[#e2e8f0] text-xl font-bold">
        {service.port}
      </td>
      <td className="text-center text-[#e2e8f0] text-xl font-bold">
        {service.hexColor}
      </td>
    </>
  );
};
