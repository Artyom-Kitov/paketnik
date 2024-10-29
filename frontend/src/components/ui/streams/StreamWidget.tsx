import React, { useState } from 'react';
import { streamData } from "../../../fixtures/streamData";
import './StreamWidget.css'; 

const StreamWidget: React.FC = () => {
  const [isButtonVisible, setButtonVisible] = useState(false); 
  const stream = streamData[0];

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault(); 
    setButtonVisible(prev => !prev); 
  };

  return (
    <div className="stream-widget" onContextMenu={handleContextMenu}>
      <div className="stream-info">
        <span className="stream-service-name">{stream.serviceName}</span>
        <span>{stream.srcIp}</span>
        <span>{stream.srcPort}</span>
        <span>{stream.dstIp}</span>
        <span>{stream.dstPort}</span>
        <span>{stream.startTime}</span>
        <span>{stream.duration}</span>
        <span>{stream.up}</span>
        <span>{stream.down}</span>
      </div>
      <div className="stream-rules">
        <span className="stream-rules-text">Rules: </span>
        <span>{stream.rules.join(" ")}</span> 
      </div>
      <div className={`download-button-container ${isButtonVisible ? 'show' : 'hide'}`}>
        <button className="download-button">
          Download as PCAP
        </button>
      </div>
    </div>
  );
};

export default StreamWidget;