import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ServiceRegistrationWidget } from "../serviceRegistration/ServiceRegistrationWidget";
import { StreamsListWidget } from "../streamsList/StreamsListWidget";
import { Sidebar } from "../sidebar/sidebar";
import { RulesWidget } from "../rulesList/RulesWidget";
import { ConfigWidget } from "../widgets/ConfigWidget";
import { FilesWidget } from "../widgets/FilesWidget";
import { LoadPcapWidget } from "../widgets/LoadPcapWidget";
import { StreamInfoWidget } from "../streamInfoWidget/StreamInfoWidget";
import { ServicesListWidget } from "../serviceList/ServicesListWidget";
import { SearchBar } from "../searchbar/SearchBar";


export function MainScreen() {
  const [currentWidget, setCurrentWidget] = useState<string>("");


  const renderCurrentWidget = () => {
    switch (currentWidget) {
      case "Services":
        return <ServicesListWidget setCurrentWidget={setCurrentWidget} />;
      case "ServiceRegistation":
        return <ServiceRegistrationWidget />;
      case "Rules":
        return <RulesWidget />;
      case "Files":
        return <FilesWidget />;
      case "Config":
        return <ConfigWidget />;
      case "Load PCAP":
        return <LoadPcapWidget />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#1e293b]">
      <PanelGroup direction="horizontal" className="min-h-screen">
        <Panel minSize={97}>
          <PanelGroup direction="vertical">
            <Panel maxSize={5} className="mt-[12px] ml-[11px] mr-[12px]">
              <h1 className="font-bold text-3xl text-white min-h-[30px]">
                Paketnik
              </h1>
              <SearchBar />
            </Panel>
            <Panel minSize={91}>
              <PanelGroup direction="horizontal" className="right-widget-group">
                <Panel
                  defaultSize={currentWidget ? 33 : 50}
                  minSize={20}
                  className="mb-[28px] ml-[11px] mr-[7px]"
                >
                  <StreamsListWidget />
                </Panel>
                <PanelResizeHandle className="resize-handle" />
                <Panel
                  defaultSize={currentWidget ? 33 : 50}
                  minSize={20}
                  className="mb-[28px] ml-[6px] mr-[7px]"
                >
                  <StreamInfoWidget />
                </Panel>
                {currentWidget && (
                  <>
                    <PanelResizeHandle className="resize-handle" />
                    <Panel
                      defaultSize={33}
                      minSize={20}
                      className="mb-[28px] ml-[6px] mr-[24px]"
                    >
                      {renderCurrentWidget()}
                    </Panel>
                  </>
                )}
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </Panel>
        <Panel minSize={3} className="bg-[#475569] ml-[12px]">
          <Sidebar
            setCurrentWidget={setCurrentWidget}
            currentWidget={currentWidget}
          />
        </Panel>
      </PanelGroup>
    </div>
  );
}
