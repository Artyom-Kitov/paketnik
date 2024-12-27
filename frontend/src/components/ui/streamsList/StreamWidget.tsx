import { useAtomValue } from "jotai";
import { Stream } from "../../../api";
import { currentStreamId } from "./selectedStream";
import { useQuery } from "@tanstack/react-query";
import { getServices } from "../../../api";

export type Props = {
  onContextMenu: (pageX: number, pageY: number) => void;
  onClick: (id: string) => void;
  data: Stream;
};

const StreamWidget = ({ data, onContextMenu, onClick }: Props) => {
  const streamId = useAtomValue(currentStreamId);
  const stream = data;

  const { data: services } = useQuery({
    queryKey: ["service"],
    queryFn: getServices,
  });

  const getService = (port: number) => {
    return services?.find((s) => s.port === port);
  };

  const srcService = getService(stream.srcPort);
  const dstService = getService(stream.dstPort);

  const serviceText = srcService && dstService
    ? <>
      <span style={{ color: srcService.hexColor }} className="bg-slate-100">{srcService.name}</span>
      <span className="text-blue-300"> ↔ </span>
      <span style={{ color: dstService.hexColor }} className="bg-slate-100">{dstService.name}</span>
    </>
    : srcService
      ? <span style={{ color: srcService.hexColor }} className="bg-slate-100">{srcService.name}</span>
      : dstService
        ? <span style={{ color: dstService.hexColor }} className="bg-slate-100">{dstService.name}</span>
        : null;

  return (
    <tr
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(e.pageY, e.pageX);
      }}
      onClick={(e) => {
        e.preventDefault();
        onClick(stream.id);
      }}
      className={`h-[50px] bg-[#1e293b] border-t-2 hover:bg-[#2d3748] border-[#ccc] ${stream.id === streamId ? "bg-[#374151]" : ""
        }`}
    >
      <th className="text-xl text-[#fff] font-bold bg-[#FF4081]">
        {stream.id.slice(0, 5)}
        {serviceText && <span className="ml-2 text-sm">({serviceText})</span>}
      </th>
      <th className="text-xl text-[#e2e8f0] font-bold">{stream.srcIp}</th>
      <th className="text-xl text-[#e2e8f0] font-bold">{stream.srcPort}</th>
      <th className="text-xl text-[#e2e8f0] font-bold">{stream.dstIp}</th>
      <th className="text-xl text-[#e2e8f0] font-bold">{stream.dstPort}</th>
    </tr>
  );
};

const Rules = ({ rules }: { rules: string[] }) => {
  return (
    <tr className="bg-[#1e293b]">
      <th className="text-xl text-[#e2e8f0]">rules: </th>
      <th colSpan={8} className="text-xl text-[#e2e8f0] text-left">
        {rules.join(" ")}
      </th>
    </tr>
  );
};

export { Rules, StreamWidget };
