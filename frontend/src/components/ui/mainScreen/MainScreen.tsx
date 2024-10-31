import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "./MainScreen.css";
const MainScreen: React.FC = () => {
  return (
    <div className="main-screen">
    <PanelGroup direction="horizontal" className="panel-group">
      <Panel minSize={97}>
        <PanelGroup direction="vertical"> 
          <Panel maxSize={8}>
            <PanelGroup direction="horizontal" >
              <Panel defaultSize={50} className="left-top-widget">
                <h1 className="title">Paketnik</h1>
              </Panel>
              <Panel defaultSize={50} className="right-top-widget">
                <h1 className="title">Right top widget</h1>
              </Panel>
            </PanelGroup>
          </Panel>
          <Panel minSize={92}>
            <PanelGroup direction="horizontal" className="right-widget-group">
              <Panel defaultSize={50} minSize={20} className="left-bottom-widget">
                <h1 className="streams-title">Streams</h1>
                Left bottom widget
              </Panel>
              <PanelResizeHandle className="resize-handle" />
              <Panel defaultSize={50} minSize={20} className="right-bottom-widget">
                Right bottom widget
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </Panel>
      <Panel minSize={3} className="sidebar">
      </Panel>
    </PanelGroup>
    </div>
  );
};

export default MainScreen;
