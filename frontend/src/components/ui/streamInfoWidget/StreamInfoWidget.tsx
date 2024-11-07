import React from "react";
import ServerMessageWidget from "./ServerMessageWidget";
import ClientMessageWidget from "./ClientMessageWidget";
import { streamData } from "@/fixtures/streamData";


const StreamInfoWidget = () => {
  return (
    <div className="flex flex-col p-4  bg-[#475569] text-white ">
      <div className="max-h-[700px] overflow-auto space-y-4">
        <ServerMessageWidget
          data={{
            headers: streamData[0].headers,
          }}
        />

        <ClientMessageWidget
          data={{
            srcIp: streamData[0].headers.ip.srcIp,
            dstIp: streamData[0].headers.ip.destIp,
            headers: {
              tcp: {
                srcPort: streamData[0].headers.tcp.srcPort,
                destPort: streamData[0].headers.tcp.destPort,
                sequenceNumber: streamData[0].headers.tcp.sequenceNumber,
                ackNumber: streamData[0].headers.tcp.ackNumber,
                payload: streamData[0].headers.tcp.payload,
              },
            },
          }}
        />

        <ServerMessageWidget
          data={{
            headers: streamData[0].headers,
          }}
        />

        <ClientMessageWidget
          data={{
            srcIp: streamData[0].headers.ip.srcIp,
            dstIp: streamData[0].headers.ip.destIp,
            headers: {
              tcp: {
                srcPort: streamData[0].headers.tcp.srcPort,
                destPort: streamData[0].headers.tcp.destPort,
                sequenceNumber: streamData[0].headers.tcp.sequenceNumber,
                ackNumber: streamData[0].headers.tcp.ackNumber,
                payload: streamData[0].headers.tcp.payload,
              },
            },
          }}
        />

        <ServerMessageWidget
          data={{
            headers: streamData[0].headers,
          }}
        />

        <ClientMessageWidget
          data={{
            srcIp: streamData[0].headers.ip.srcIp,
            dstIp: streamData[0].headers.ip.destIp,
            headers: {
              tcp: {
                srcPort: streamData[0].headers.tcp.srcPort,
                destPort: streamData[0].headers.tcp.destPort,
                sequenceNumber: streamData[0].headers.tcp.sequenceNumber,
                ackNumber: streamData[0].headers.tcp.ackNumber,
                payload: streamData[0].headers.tcp.payload,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default StreamInfoWidget;
