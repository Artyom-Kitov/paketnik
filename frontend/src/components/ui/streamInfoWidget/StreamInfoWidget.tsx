import { PacketWidget } from "./PacketWidget";
import { currentStreamId } from "../streamsList/selectedStream";
import { getPackets } from "../../../api";
import { useAtomValue } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { searchResult } from "../searchbar/searchResult";
import { SearchMatch } from "../../../api";
import { useMemo } from "react";

export const StreamInfoWidget: React.FC = () => {
  const streamId = useAtomValue(currentStreamId);
  const searchData = useAtomValue(searchResult);

  const getSearches = (packetIndex: number): SearchMatch[] => {
    const highlights: SearchMatch[] = [];
    searchData?.matches.forEach((match) => {
      if (match.packet == packetIndex) {
        highlights.push(match);
      }
    });
    return highlights;
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: [streamId],
    queryFn: async () => {
      if (streamId != undefined) {
        const data = await getPackets(streamId);
        if (data == undefined) {
          throw new Error("An error occurred while fetching packets");
        } else {
          return data;
        }
      } else {
        return null;
      }
    },
  });

  // Determine the left side IP by finding the first packet with IPv4 layer
  const leftSideIp = useMemo(() => {
    if (!data?.length) {
      return undefined;
    }

    const firstPacketWithIp = data.find((packet) => packet.layers.ipv4);
    return firstPacketWithIp?.layers.ipv4?.srcIp;
  }, [data]);

  if (isPending) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="text-right text-[#fff] text-2xl font-bold mb-2">
          Loading... {data}
        </div>
      </div>
    );
  } else if (isError) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="text-right text-[#fff] text-2xl font-bold mb-2 text-red-600">
          Error: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="text-left text-[#fff] text-2xl font-bold mb-[6px]">
        Stream Info ({streamId?.slice(0, 5) ?? "none"})
      </div>
      {data != undefined && data != null && (
        <div className="flex flex-col p-4 bg-[#475569] text-white flex-1 overflow-auto">
          <div className="overflow-auto space-y-4">
            {data.map((message, index) => (
              <PacketWidget
                key={index}
                data={message}
                highlights={getSearches(message.index)}
                leftSideIp={leftSideIp}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
