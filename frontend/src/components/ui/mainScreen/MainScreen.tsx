import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ServiceRegistrationWidget } from "../serviceRegistration/ServiceRegistrationWidget";
import { PcapDumpsWidget } from "../pcapDumps/PcapDumpsWidget";
import { StreamsListWidget } from "../streamsList/StreamsListWidget";
import { Sidebar } from "../sidebar/sidebar";

export function MainScreen() {
  const [isServiceRegistrationWidget, setServiceRegistrationWidget] =
    useState(false);
  const [isStreamsListWidget, setStreamsListWidget] = useState(false);

  function setServicesWidgets(visibility: boolean) {
    setServiceRegistrationWidget(visibility);
  }
  function setRulesWidgets() {
    //TODO()
  }
  function setFilesWidgets(visibility: boolean) {
    setStreamsListWidget(visibility);
  }
  function setConfigWidgets() {
    //TODO()
  }

  function setLoadPcapWidgets() {
    //TODO()
  }

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
                  className="bg-[#475569] flex mt-[18px] ml-[6px] mr-[12px]"
                >
                  <h1 className="font-bold text-2xl text-[#E2E8F0] h-[33px] mb-[16px] mt-[15px] ml-[22px]">
                    PCAP dumps:
                  </h1>
                  <PcapDumpsWidget />
                </Panel>
              </PanelGroup>
            </Panel>
            <Panel minSize={91}>
              <PanelGroup direction="horizontal" className="right-widget-group">
                <Panel
                  defaultSize={50}
                  minSize={20}
                  className="mb-[28px] ml-[11px] mr-[7px]"
                >
                  {isStreamsListWidget ? <StreamsListWidget /> : null}
                </Panel>
                <PanelResizeHandle className="resize-handle" />
                <Panel
                  defaultSize={50}
                  minSize={20}
                  className="bg-[#475569] mb-[28px] mt-[38px] ml-[6px] mr-[12px]"
                >
                  {isServiceRegistrationWidget ? (
                    <ServiceRegistrationWidget />
                  ) : null}
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </Panel>
        <Panel minSize={3} className="bg-[#475569]">
          <Sidebar
            setServicesWidgets={setServicesWidgets}
            setRulesWidgets={setRulesWidgets}
            setFilesWidgets={setFilesWidgets}
            setConfigWidgets={setConfigWidgets}
            setLoadPcapWidgets={setLoadPcapWidgets}
          />
        </Panel>
      </PanelGroup>
    </div>
  );
}
