import { PacketWidget } from "./PacketWidget";
import { currentStreamId } from "../streamsList/selectedStream";
import { getPackets } from "../../../api";
import { useAtomValue } from "jotai";
import { useQuery } from "@tanstack/react-query";

type StreamInfoWidgetProps = {
  searchQuery: string;
};

export const StreamInfoWidget: React.FC<StreamInfoWidgetProps> = () => {
  const streamId = useAtomValue(currentStreamId);
  const { isPending, isError, data, error } = useQuery({
    queryKey: [streamId],
    queryFn: async () => {
      if (streamId != undefined) {
        console.log(streamId);
        const data = await getPackets(streamId);
        return data;
      } else {
        console.log("No id");
        return undefined;
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

  return (
    <div className="w-full h-full flex flex-col">
      <div className="text-left text-[#fff] text-2xl font-bold mb-[6px]">
        Stream Info
      </div>
      {data != undefined && data != null && (
        <div className="flex flex-col p-4 bg-[#475569] text-white flex-1 overflow-auto">
          <div className="overflow-auto space-y-4">
            {data.map((message, index) => (
              <PacketWidget key={index} data={message} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
