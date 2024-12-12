import { useEffect, useState } from "react";
import { StreamWidget } from "./StreamWidget";
import { ContextMenu } from "./ContextMenu";
import { currentStreamId } from "./selectedStream";
import { useSetAtom } from "jotai";
import { getStreams } from "../../../api";
import { useQuery } from "@tanstack/react-query";

export const StreamsListWidget = () => {
  const [show, setShow] = useState(false);
  const [points, setPoints] = useState({ top: 0, left: 0 });
  const setCurrentStreamId = useSetAtom(currentStreamId);


  const { isPending, isError, data, error } = useQuery({
    queryKey: ["streams"],
    queryFn: getStreams,
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

  useEffect(() => {
    const handleClick = () => setShow(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  function showContextMenu(pageX: number, pageY: number) {
    setPoints({ top: pageX, left: pageY });
    setShow(true);
  }

  function onClick(id: string) {
    setCurrentStreamId(id);
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="text-right text-[#fff] text-2xl font-bold mb-2">
        Streams
      </div>
      <div className="w-full bg-[#475569] px-[7px] pb-[7px] flex-1 mt-0 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-[#475569] sticky top-0">
            <tr className="h-[50px]">
              <th className="text-xl text-[#e2e8f0] font-bold sticky">
                service
              </th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky">srcip</th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky">
                srcport
              </th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky">dstip</th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky">
                dstport
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((stream, i) => [
              <StreamWidget
                key={i}
                onClick={onClick}
                onContextMenu={showContextMenu}
                data={stream}
              />,
              //<Rules key={stream.id} rules={stream.ta} />,
            ])}
          </tbody>
        </table>
      </div>
      {show && <ContextMenu top={points.top} left={points.left} />}
    </div>
  );
};
