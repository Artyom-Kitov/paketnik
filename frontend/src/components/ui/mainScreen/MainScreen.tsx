import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import StreamInfoWidget from "../streamInfoWidget/streamInfoWidget";
import { StreamsListWidget } from "../streamsList/StreamsListWidget"; 

export function MainScreen() {
  return (
    <div className="bg-[#1e293b]">
      <PanelGroup direction="horizontal" className="min-h-screen">
        <Panel minSize={97}>
          <PanelGroup direction="vertical">
            <Panel maxSize={9}>
              <PanelGroup direction="horizontal">
                <Panel
                  defaultSize={50}
                  className="mt-[18px] ml-[11px] mr-[7px]"
                >
                  <h1 className="font-bold text-5xl text-white min-h-[69px]">
                    Paketnik
                  </h1>
                </Panel>
                <Panel
                  defaultSize={50}
                  className="bg-[#475569] mt-[18px] ml-[6px] mr-[12px]"
                >
                  <h1 className="font-bold text-2xl text-[#E2E8F0] h-[33px] mb-[16px] mt-[15px] ml-[22px]">
                    PCAP dumps:
                  </h1>
                </Panel>
              </PanelGroup>
            </Panel>
            <Panel minSize={91}>
              <PanelGroup direction="horizontal" className="right-widget-group">
                <Panel
                  defaultSize={60}
                  minSize={20}
                  className="bg-[#808080] mb-[28px] ml-[11px] mr-[7px]"
                >
                  <h1 className="font-bold text-2xl text-white h-[32px] text-right">
                  </h1>
                  <StreamsListWidget />
                </Panel>
                <PanelResizeHandle className="resize-handle" />
                <Panel
                  defaultSize={40}
                  minSize={20}
                  className="bg-[#475569] mb-[28px] mt-[38px] ml-[6px] mr-[12px]"
                >
                  <StreamInfoWidget />
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </Panel>
        <Panel minSize={3} className="bg-[#475569]"></Panel>
      </PanelGroup>
    </div>
  );
}
