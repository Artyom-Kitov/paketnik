import { ServerMessageWidget } from "./ServerMessageWidget";
import { ClientMessageWidget } from "./ClientMessageWidget";
import { currentStreamId } from "../streamsList/selectedStream";
import { getPackets, Stream } from "../../../api";
import { useAtomValue } from "jotai";
import { useQuery } from "@tanstack/react-query";

type StreamInfoWidgetProps = {
  searchQuery: string;
};

type Message = {
  type: "Server" | "Client";
} & (Stream[])[number];

export const StreamInfoWidget: React.FC<StreamInfoWidgetProps> = ({
  searchQuery,
}) => {


  const streamId = useAtomValue(currentStreamId);
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["streams"],
    queryFn: async () => {
      if(streamId != undefined){
        const data = await getPackets(streamId)
        return data
      } else{
        return null
      }
    },
  });
  if (isPending) {
    <div className="w-full h-full flex flex-col">
      <div className="text-right text-[#fff] text-2xl font-bold mb-2">
        Loading... {data}
      </div>
    </div>;
  } else if (isError) {
    <div className="w-full h-full flex flex-col">
      <div className="text-right text-[#fff] text-2xl font-bold mb-2 text-red-600">
        Error: {error.message}
      </div>
    </div>;
  }
  const stream = data?.find((s) => s.id === streamId);

  const filterMessages = (messages: Message[]) => {
    if (!searchQuery) {
      return messages;
    }

    try {
      const regex = new RegExp(searchQuery, "i");
      return messages.filter((message) =>
        Object.values(message).some(
          (value) =>
            (typeof value === "string" && regex.test(value)) ||
            (Array.isArray(value) && value.some((item) => regex.test(item))),
        ),
      );
    } catch {
      return messages;
    }
  };

  const filteredMessages: Message[] = stream
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
