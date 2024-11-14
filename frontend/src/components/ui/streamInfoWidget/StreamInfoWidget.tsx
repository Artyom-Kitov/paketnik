import React from "react";
import ServerMessageWidget from "./ServerMessageWidget";
import ClientMessageWidget from "./ClientMessageWidget";

type StreamInfoWidgetProps = {
  data: {
    id: number;
    srcIp: string;
    dstIp: string;
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
        srcPort: number;
        destPort: number;
        sequenceNumber: number;
        ackNumber: number;
        payload: string;
      };
    };
  };
};

const StreamInfoWidget: React.FC<StreamInfoWidgetProps> = ({ data }) => {
  return (
    <div className="flex flex-col p-4  bg-[#475569] text-white ">
      <div className="max-h-[700px] overflow-auto space-y-4">
        <ServerMessageWidget
          data={{
            headers: data.headers,
          }}
        />

        <ClientMessageWidget
          data={{
            srcIp: data.headers.ip.srcIp,
            dstIp: data.headers.ip.destIp,
            headers: {
              tcp: {
                srcPort: data.headers.tcp.srcPort,
                destPort: data.headers.tcp.destPort,
                sequenceNumber: data.headers.tcp.sequenceNumber,
                ackNumber: data.headers.tcp.ackNumber,
                payload: data.headers.tcp.payload,
              },
            },
          }}
        />

        <ServerMessageWidget
          data={{
            headers: data.headers,
          }}
        />

        <ClientMessageWidget
          data={{
            srcIp: data.headers.ip.srcIp,
            dstIp: data.headers.ip.destIp,
            headers: {
              tcp: {
                srcPort: data.headers.tcp.srcPort,
                destPort: data.headers.tcp.destPort,
                sequenceNumber: data.headers.tcp.sequenceNumber,
                ackNumber: data.headers.tcp.ackNumber,
                payload: data.headers.tcp.payload,
              },
            },
          }}
        />

        <ServerMessageWidget
          data={{
            headers: data.headers,
          }}
        />

        <ClientMessageWidget
          data={{
            srcIp: data.headers.ip.srcIp,
            dstIp: data.headers.ip.destIp,
            headers: {
              tcp: {
                srcPort: data.headers.tcp.srcPort,
                destPort: data.headers.tcp.destPort,
                sequenceNumber: data.headers.tcp.sequenceNumber,
                ackNumber: data.headers.tcp.ackNumber,
                payload: data.headers.tcp.payload,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default StreamInfoWidget;
