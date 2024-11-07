import React, { useState } from "react";
import { PiDotsSixBold } from "react-icons/pi";

type ServerMessageWidgetProps = {
  data: {
    headers: {
      ethernet: {
        srcMac: string;
        destMac: string;
      };
      ip: {
        srcIp: string;
        destIp: string;
      };
      tcp: {
        payload: string;
      };
    };
  };
};

const ServerMessageWidget: React.FC<ServerMessageWidgetProps> = ({ data }) => {
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
    setHeight(prevHeight => (prevHeight !== 50 ? 50 : 230));
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
    <div style={{ height }} className="relative bg-[#252c3a] p-4 pl-8 mr-[100px] rounded-lg shadow-md overflow-hidden">
      <PiDotsSixBold
        className="absolute bottom-2 left-2 text-gray-200 cursor-move"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      />
      <h2 className="text-lg font-semibold">HTTP/1.1 200</h2>
      <div className="text-sm mt-2 whitespace-normal">
        <p className="font-semibold">Headers:</p>
        <p>Src MAC: {data.headers.ethernet.srcMac}</p>
        <p>Dest MAC: {data.headers.ethernet.destMac}</p>
        <p>Src IP: {data.headers.ip.srcIp}</p>
        <p>Dest IP: {data.headers.ip.destIp}</p>
      </div>
      <div className="text-sm mt-2 mb-3 whitespace-normal">
        <p className="font-semibold">Body:</p>
        <p>{data.headers.tcp.payload}</p>
      </div>
    </div>
  );
};

export default ServerMessageWidget;
