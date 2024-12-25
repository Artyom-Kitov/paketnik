import React from "react";
import { Packet } from "../../../api";
import { SearchMatch, getRequest } from "../../../api";

type ServerMessageWidgetProps = {
  data: Packet;
  streamId: string;
  highlights: SearchMatch[];
};

export const PacketWidget: React.FC<ServerMessageWidgetProps> = ({
  data,
  streamId,
  highlights,
}) => {
  const setHighlightedSymbols = (): number[] => {
    const numbers: number[] = [];
    highlights.forEach((match) => {
      const rawText = unescape(encodeURIComponent(match.string));
      for (let i = match.offset; i < match.offset + rawText.length; i++) {
        numbers.push(i);
      }
    });
    return numbers;
  };

  const highlightedSymbols: number[] = setHighlightedSymbols();

  const getBody = () => {
    return (
      <span>
        {" "}
        {Array.from(data.encodedData).map((part, i) => (
          <span
            key={i}
            style={
              highlightedSymbols.indexOf(i) > -1
                ? { background: "#FFC107" }
                : {}
            }
          >
            {part}
          </span>
        ))}{" "}
      </span>
    );
  };

  return (
    <div className="relative bg-[#252c3a] p-4 pl-8 mr-[100px] rounded-lg shadow-md overflow-hidden h-72 max-h-fit min-h-28 resize-y">
      <h2 className="text-lg inline font-semibold">Packet</h2>
      <div className="inline float-right">
        <div className="inline mr-2">Export:</div>
        <button onClick={ () => getRequest(streamId, data.index, "curl")} className="inline mr-2 bg-[#4a5568] px-1 rounded hover:bg-[#2d3748] transition-colors">curl</button>
        <button onClick={ () => getRequest(streamId, data.index, "python")} className="inline bg-[#4a5568] px-1 rounded hover:bg-[#2d3748] transition-colors">python request</button>
      </div>
      <div className="text-sm mt-2 whitespace-normal">
        <p>Received at: {data.receivedAt}</p>
        {data.tags.map((tag, i) => (
          <p key={i}>{tag}</p>
        ))}
      </div>
      {data.layers.ethernet && (
        <div className="text-sm mt-2 whitespace-normal">
          <p className="font-semibold">Ethernet</p>
          <p>Src: {data.layers.ethernet.srcMac}</p>
          <p>Dst: {data.layers.ethernet.dstMac}</p>
        </div>
      )}
      {data.layers.ipv4 && (
        <div className="text-sm mt-2 whitespace-normal">
          <p className="font-semibold">Ipv4</p>
          <p>Src: {data.layers.ipv4.srcIp}</p>
          <p>Dst: {data.layers.ipv4.dstIp}</p>
          <p>Version: {data.layers.ipv4.version}</p>
          <p>Total length: {data.layers.ipv4.length}</p>
          <p>Don&apos;t fragment: {data.layers.ipv4.doNotFragment}</p>
          <p>Fragment offset: {data.layers.ipv4.fragmentOffset}</p>
          <p>Time to Live: {data.layers.ipv4.ttl}</p>
          <p>More fragments: {data.layers.ipv4.moreFragments}</p>
          <p>Header Checksum: {data.layers.ipv4.headerChecksum}</p>{" "}
        </div>
      )}
      {data.layers.tcp && (
        <div className="text-sm mt-2 whitespace-normal">
          <p className="font-semibold">TCP</p>
          <p>Source Port: {data.layers.tcp.srcPort}</p>
          <p>Destination Port: {data.layers.tcp.dstPort}</p>
          <p>Sequence Number: {data.layers.tcp.sequenceNumber}</p>
          <p>Ackmowledgment number: {data.layers.tcp.ackNumber}</p>
          <p>
            Flags:
            <div>
              {data.layers.tcp.ack && <p>ACK</p>}
              {data.layers.tcp.cwr && <p>CWR</p>}
              {data.layers.tcp.ece && <p>ECE</p>}
              {data.layers.tcp.fin && <p>FIN</p>}
              {data.layers.tcp.psh && <p>PSH</p>}
              {data.layers.tcp.rst && <p>RST</p>}
              {data.layers.tcp.syn && <p>SYN</p>}
              {data.layers.tcp.urg && <p>URG</p>}
            </div>
          </p>
          <p>Window: {data.layers.tcp.windowSize}</p>
          <p>Checksum: {data.layers.tcp.checksum}</p>
          <p>Data Offset: {data.layers.tcp.dataOffset}</p>
          <p>Urgent pointer: {data.layers.tcp.urgentPointer}</p>
          <p>Payload: {data.layers.tcp.payload}</p>
        </div>
      )}
      {data.layers.udp && (
        <div className="text-sm mt-2 whitespace-normal">
          <p className="font-semibold">UDP</p>
          <p>Source Port: {data.layers.udp.srcPort}</p>
          <p>Destination Port: {data.layers.udp.dstPort}</p>
          <p>Length: {data.layers.udp.length}</p>
          <p>Checksum: {data.layers.udp.checksum}</p>
          <p>Data: {data.layers.udp.data}</p>
        </div>
      )}
      {data.encodedData && (
        <div className="text-sm mt-2 mb-3 whitespace-normal">
          <p className="font-semibold ">Body:</p>
          <p className="break-words">{getBody()}</p>
        </div>
      )}
    </div>
  );
};
