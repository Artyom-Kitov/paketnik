import { useEffect, useState } from "react";
import { ServerMessageWidget } from "./ServerMessageWidget";
import { ClientMessageWidget } from "./ClientMessageWidget";
import { Stream } from "../streamsList/Stream";
import { currentStreamId } from "../streamsList/selectedStream";
import { streamData } from "../../../fixtures/streamData";
import { useAtomValue } from "jotai";

export const StreamInfoWidget = () => {
  const [stream, setStream] = useState<Stream | null>(null);
  const streamId = useAtomValue(currentStreamId);

  useEffect(() => {
    console.log(streamId);
    for (const s of streamData) {
      if (s.id == streamId) {
        setStream(s);
        break;
      }
    }
  });

  return (
    <div className="w-full h-full flex flex-col">
      <div className="text-left text-[#fff] text-2xl font-bold mb-[6px]">
        Stream Info
      </div>
      {stream && (
        <div className="flex flex-col p-4 bg-[#475569] text-white flex-1 overflow-auto">
          <div className="max-h-[700px] overflow-auto space-y-4">
            <ServerMessageWidget
              data={{
                headers: stream.headers,
              }}
            />

            <ClientMessageWidget
              data={{
                srcIp: stream.headers.ip.srcIp,
                dstIp: stream.headers.ip.destIp,
                headers: {
                  tcp: {
                    srcPort: stream.headers.tcp.srcPort,
                    destPort: stream.headers.tcp.destPort,
                    sequenceNumber: stream.headers.tcp.sequenceNumber,
                    ackNumber: stream.headers.tcp.ackNumber,
                    payload: stream.headers.tcp.payload,
                  },
                },
              }}
            />

            <ServerMessageWidget
              data={{
                headers: stream.headers,
              }}
            />

            <ClientMessageWidget
              data={{
                srcIp: stream.headers.ip.srcIp,
                dstIp: stream.headers.ip.destIp,
                headers: {
                  tcp: {
                    srcPort: stream.headers.tcp.srcPort,
                    destPort: stream.headers.tcp.destPort,
                    sequenceNumber: stream.headers.tcp.sequenceNumber,
                    ackNumber: stream.headers.tcp.ackNumber,
                    payload: stream.headers.tcp.payload,
                  },
                },
              }}
            />

            <ServerMessageWidget
              data={{
                headers: stream.headers,
              }}
            />

            <ClientMessageWidget
              data={{
                srcIp: stream.headers.ip.srcIp,
                dstIp: stream.headers.ip.destIp,
                headers: {
                  tcp: {
                    srcPort: stream.headers.tcp.srcPort,
                    destPort: stream.headers.tcp.destPort,
                    sequenceNumber: stream.headers.tcp.sequenceNumber,
                    ackNumber: stream.headers.tcp.ackNumber,
                    payload: stream.headers.tcp.payload,
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
