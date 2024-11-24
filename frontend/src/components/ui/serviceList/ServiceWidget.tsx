import { Service } from "../../../api";

export type Props = {
  service: Service;
};

const ServiceWidget = ({ service }: Props) => {
  return (
    <tr
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      className="h-[50px] bg-[#1e293b] border-t-2 border-[#ccc]"
    >
      <th
        className="text-xl text-[#fff] font-bold"
        style={{ backgroundColor: service.hexColor }}
      >
        {service.name}
      </th>
      <th className="text-xl text-[#e2e8f0] font-bold">{service.id}</th>
      <th className="text-xl text-[#e2e8f0] font-bold">{service.port}</th>
      <th className="text-xl text-[#e2e8f0] font-bold">{service.hexColor}</th>
    </tr>
  );
};

export { ServiceWidget };
