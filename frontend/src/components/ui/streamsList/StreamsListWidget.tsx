import { useEffect, useState } from "react";
import { streamData } from "../../../fixtures/streamData";
import { StreamWidget, Rules } from "./StreamWidget";
import { ContextMenu } from "./ContextMenu";
import { Stream } from "./Stream";

export const StreamsListWidget = () => {
  const [streams, setStream] = useState<Stream[]>([]);
  const [show, setShow] = useState(false);
  const [points, setPoints] = useState({ top: 0, left: 0 });

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
  return (
    <div className="w-full h-fit">
      <div className="text-right text-[#fff] text-2xl font-bold">Streams</div>
      <div className="w-full h-fit bg-[#475569] p-[7px]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="h-[50px]">
              <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
                service
              </th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
                srcip
              </th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
                srcport
              </th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
                dstip
              </th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
                dstport
              </th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
                started_at
              </th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
                duration
              </th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
                up
              </th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
                down
              </th>
            </tr>
            <tr className="h-[12px] bg-[#1e293b]"></tr>
            <tr className="h-[7px]"> </tr>
          </thead>
          <tbody>
            {streams.map((stream) => [
              <StreamWidget onContextMenu={showContextMenu} data={stream} />,
              <Rules rules={stream.rules} />,
            ])}
          </tbody>
        </table>
      </div>
      {show && <ContextMenu top={points.top} left={points.left} />}
    </div>
  );
};