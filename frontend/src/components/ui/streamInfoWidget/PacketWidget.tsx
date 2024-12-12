import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { Packet } from "../../../api";

type ServerMessageWidgetProps = {
  data: Packet;
};

export const PacketWidget: React.FC<ServerMessageWidgetProps> = ({ data }) => {
  console.log(data);
  const [height, setHeight] = useState(230);
  const [isResizing, setIsResizing] = useState(false);
  const [initialMousePosition, setInitialMousePosition] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    setInitialMousePosition(e.clientY);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing) {
      const newHeight = height + (e.clientY - initialMousePosition);
      setHeight(newHeight > 50 ? newHeight : 50);
      setInitialMousePosition(e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const handleDoubleClick = () => {
    setHeight((prevHeight) => (prevHeight !== 50 ? 50 : 230));
  };

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div
      style={{ height }}
      className="relative bg-[#252c3a] p-4 pl-8 mr-[100px] rounded-lg shadow-md overflow-hidden"
    >
      <DotsHorizontalIcon
        className="absolute bottom-2 left-2 text-gray-200 cursor-move"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      />
      <h2 className="text-lg font-semibold">Packet</h2>
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
          <p className="break-words">{data.encodedData}</p>
        </div>
      )}
    </div>
  );
};
