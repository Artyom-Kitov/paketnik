import { useEffect, useState } from "react";
import { streamData } from "../../../fixtures/streamData";
import { StreamWidget, Rules } from "./StreamWidget";
import { ContextMenu } from "./ContextMenu";
import { Stream } from "./Stream";
import { currentStreamId } from "./selectedStream";
import { useSetAtom } from "jotai";

export const StreamsListWidget = () => {
  const [streams, setStream] = useState<Stream[]>([]);
  const [show, setShow] = useState(false);
  const [points, setPoints] = useState({ top: 0, left: 0 });
  const setCurrentStreamId = useSetAtom(currentStreamId);

  useEffect(() => {
    const handleClick = () => setShow(false);
    window.addEventListener("click", handleClick);
    setStream(streamData);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  function showContextMenu(pageX: number, pageY: number) {
    setPoints({ top: pageX, left: pageY });
    setShow(true);
  }

  function onClick(id: number) {
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
              <th className="text-xl text-[#e2e8f0] font-bold sticky">
                started_at
              </th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky">
                duration
              </th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky">up</th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky">down</th>
            </tr>
          </thead>
          <tbody>
            {streams.map((stream) => [
              <StreamWidget
                key={stream.id}
                onClick={onClick}
                onContextMenu={showContextMenu}
                data={stream}
              />,
              <Rules key={stream.id} rules={stream.rules} />,
            ])}
          </tbody>
        </table>
      </div>
      {show && <ContextMenu top={points.top} left={points.left} />}
    </div>
  );
};
