import { DotsVerticalIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { Stream } from "../streamsList/Stream";

type ClientMessageWidgetProps = {
  data: Stream,
};

export const ClientMessageWidget: React.FC<ClientMessageWidgetProps> = ({ data }) => {
  const [height, setHeight] = useState(200);
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
    <div style={{ height }} className="relative bg-[#2d3748] p-4 pl-8 ml-[100px] rounded-lg shadow-md overflow-hidden">
      <DotsVerticalIcon
        className="absolute bottom-2 left-2 text-gray-200 cursor-move"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      />
      <h2 className="text-lg font-semibold">
        POST {data.srcIp}:{data.headers.tcp.srcPort} ➔ {data.dstIp}:{data.headers.tcp.destPort}
      </h2>
      <div className="text-sm mt-2 whitespace-normal">
        <p className="font-semibold">Headers:</p>
        <p>Sequence Number: {data.headers.tcp.sequenceNumber}</p>
        <p>Acknowledgment Number: {data.headers.tcp.ackNumber}</p>
      </div>
      <div className="text-sm mt-2 mb-3 whitespace-normal">
        <p className="font-semibold">Body:</p>
        <p>{data.headers.tcp.payload}</p>
      </div>
    </div>
  );
};

