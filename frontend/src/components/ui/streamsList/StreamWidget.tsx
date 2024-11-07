import { Stream } from "./Stream";

export type Props = {
  onContextMenu: (pageX: number, pageY: number) => void;
  data: Stream;
};

const StreamWidget = ({ data, onContextMenu }: Props) => {
  const stream = data;
  return (
    <tr
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(e.pageY, e.pageX);
      }}
      className="h-[50px] bg-[#1e293b] border-t-2 border-[#ccc]"
    >
      <th className="text-xl text-[#fff] font-bold bg-[#FF4081]">
        {stream.serviceName}
      </th>
      <th className="text-xl text-[#e2e8f0] font-bold">{stream.srcIp}</th>
      <th className="text-xl text-[#e2e8f0] font-bold">{stream.srcPort}</th>
      <th className="text-xl text-[#e2e8f0] font-bold">{stream.dstIp}</th>
      <th className="text-xl text-[#e2e8f0] font-bold">{stream.dstPort}</th>
      <th className="text-xl text-[#e2e8f0] font-bold">{stream.startTime}</th>
      <th className="text-xl text-[#e2e8f0] font-bold">{stream.duration}</th>
      <th className="text-xl text-[#e2e8f0] font-bold">{stream.up}</th>
      <th className="text-xl text-[#e2e8f0] font-bold">{stream.down}</th>
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
