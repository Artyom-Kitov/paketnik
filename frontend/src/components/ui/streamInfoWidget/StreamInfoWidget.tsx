import { useEffect, useState } from "react";
import { ServerMessageWidget } from "./ServerMessageWidget";
import { ClientMessageWidget } from "./ClientMessageWidget";
import { currentStreamId } from "../streamsList/selectedStream";
import { streamData } from "../../../fixtures/streamData";
import { useAtomValue } from "jotai";
import { Stream } from "../streamsList/Stream";

export const StreamInfoWidget = () => {
  const [stream, setStream] = useState<Stream | null>(null);
  const streamId = useAtomValue(currentStreamId);

  useEffect(() => {
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
              data={stream}
            />

            <ClientMessageWidget
              data={stream}
            />

            <ServerMessageWidget
              data={stream}
            />

            <ClientMessageWidget
              data={stream}
            />

            <ServerMessageWidget
              data={stream}
            />

            <ClientMessageWidget
              data={stream}
            />
          </div>
        </div>
      )}
    </div>
  );
};
