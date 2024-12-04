import { ServerMessageWidget } from "./ServerMessageWidget";
import { ClientMessageWidget } from "./ClientMessageWidget";
import { currentStreamId } from "../streamsList/selectedStream";
import { streamData } from "../../../fixtures/streamData";
import { useAtomValue } from "jotai";

type StreamInfoWidgetProps = {
  searchQuery: string;
};

export const StreamInfoWidget: React.FC<StreamInfoWidgetProps> = ({
  searchQuery,
}) => {
  const streamId = useAtomValue(currentStreamId);
  const stream = streamData.find((s) => s.id == streamId);

  const filterMessages = (messages: any[]) => {
    if (!searchQuery) return messages;

    try {
      const regex = new RegExp(searchQuery, "i");
      return messages.filter((message) =>
        Object.values(message).some(
          (value) => typeof value === "string" && regex.test(value),
        ),
      );
    } catch {
      return messages;
    }
  };

  const filteredMessages = stream
    ? filterMessages([
        { type: "Server", ...stream },
        { type: "Client", ...stream },
        { type: "Server", ...stream },
        { type: "Client", ...stream },
      ])
    : [];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="text-left text-[#fff] text-2xl font-bold mb-[6px]">
        Stream Info
      </div>
      {stream && (
        <div className="flex flex-col p-4 bg-[#475569] text-white flex-1 overflow-auto">
          <div className="max-h-[700px] overflow-auto space-y-4">
            {filteredMessages.map((message, index) =>
              message.type === "Server" ? (
                <ServerMessageWidget key={index} data={message} />
              ) : (
                <ClientMessageWidget key={index} data={message} />
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
};
