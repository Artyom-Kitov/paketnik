import { Stream } from "../../../api";

export type Props = {
  onContextMenu: (pageX: number, pageY: number) => void;
  onClick: (id: string) => void;
  data: Stream;
};

const StreamWidget = ({ data, onContextMenu, onClick }: Props) => {
  const stream = data;
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
      className="h-[50px] bg-[#1e293b] border-t-2 hover:bg-[#2d3748] border-[#ccc]"
    >
      <th className="text-xl text-[#fff] font-bold bg-[#FF4081]">
        {stream.id}
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
