import React, { useState } from "react";
import { Packet } from "../../../api";
import { SearchMatch } from "../../../api";
import { ChevronDown, ChevronRight, Copy } from "lucide-react";

type ServerMessageWidgetProps = {
  data: Packet;
  highlights: SearchMatch[];
};

type SectionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

const Section: React.FC<SectionProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-700 py-2">
      <button
        className="flex items-center w-full text-left font-semibold hover:bg-gray-700/30 rounded px-2 py-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
        {title}
      </button>
      {isOpen && <div className="pl-6 mt-2">{children}</div>}
    </div>
  );
};

export const PacketWidget: React.FC<ServerMessageWidgetProps> = ({
  data,
  highlights,
}) => {
  const setHighlightedSymbols = (): number[] => {
    const numbers: number[] = [];
    highlights.forEach((match) => {
      const rawText = unescape(encodeURIComponent(match.string));
      for (let i = match.offset; i < match.offset + rawText.length; i++) {
        numbers.push(i);
      }
    });
    return numbers;
  };

  const highlightedSymbols: number[] = setHighlightedSymbols();

  const getBody = () => {
    const decodedBody = window.atob(data.encodedData);
    return (
      <span>
        {Array.from(decodedBody).map((part, i) => (
          <span
            key={i}
            style={
              highlightedSymbols.indexOf(i) > -1
                ? { background: "#FFC107" }
                : {}
            }
          >
            {part}
          </span>
        ))}
      </span>
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="relative bg-[#252c3a] p-4 rounded-lg shadow-md overflow-y-auto h-80 max-h-fit min-h-28 resize-y">
      <div className="space-y-2">
        <Section title="Basic Info" defaultOpen={true}>
          <p>Received at: {data.receivedAt}</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {data.tags.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-gray-700/50 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
        </Section>

        {data.httpInfo && (
          <Section title="HTTP Layer">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <p>Method: {data.httpInfo.method}</p>
                <p>Status: {data.httpInfo.statusCode}</p>
              </div>
              <p>URL: {data.httpInfo.url}</p>

              {data.httpInfo.headers && (
                <div className="mt-2">
                  <p className="font-semibold mb-1">Headers:</p>
                  <div className="bg-gray-800/30 p-2 rounded">
                    {Object.entries(data.httpInfo.headers).map((entry, i) => (
                      <p key={i} className="text-sm">
                        <span className="text-gray-400">{entry[0]}:</span> {entry[1]}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {data.encodedData && (
          <Section title="Packet Body" defaultOpen={true}>
            <div className="relative">
              <button
                onClick={() => copyToClipboard(window.atob(data.encodedData))}
                className="absolute right-0 top-0 p-1 hover:bg-gray-700/50 rounded"
                title="Copy body"
              >
                <Copy className="w-4 h-4" />
              </button>
              <div className="font-mono text-sm bg-gray-800/30 p-2 rounded mt-2 break-words">
                {getBody()}
              </div>
            </div>
          </Section>
        )}

        {data.layers.ipv4 && (
          <Section title="IPv4 Layer">
            <div className="grid grid-cols-2 gap-2">
              <p>Source IP: {data.layers.ipv4.srcIp}</p>
              <p>Destination IP: {data.layers.ipv4.dstIp}</p>
              <p>Version: {data.layers.ipv4.version}</p>
              <p>Total Length: {data.layers.ipv4.length}</p>
              <p>TTL: {data.layers.ipv4.ttl}</p>
              <p>Fragment Offset: {data.layers.ipv4.fragmentOffset}</p>
              <p>Don't Fragment: {data.layers.ipv4.doNotFragment ? "Yes" : "No"}</p>
              <p>More Fragments: {data.layers.ipv4.moreFragments ? "Yes" : "No"}</p>
              <p>Checksum: {data.layers.ipv4.headerChecksum}</p>
            </div>
          </Section>
        )}

        {data.layers.tcp && (
          <Section title="TCP Layer">
            <div className="grid grid-cols-2 gap-2">
              <p>Source Port: {data.layers.tcp.srcPort}</p>
              <p>Destination Port: {data.layers.tcp.dstPort}</p>
              <p>Sequence Number: {data.layers.tcp.sequenceNumber}</p>
              <p>Acknowledgment: {data.layers.tcp.ackNumber}</p>
              <p>Window Size: {data.layers.tcp.windowSize}</p>
              <p>Data Offset: {data.layers.tcp.dataOffset}</p>
            </div>

            <div className="mt-2">
              <p className="font-semibold mb-1">Flags:</p>
              <div className="flex flex-wrap gap-2">
                {data.layers.tcp.ack && <span className="px-2 py-1 bg-blue-500/20 rounded-full text-xs">ACK</span>}
                {data.layers.tcp.syn && <span className="px-2 py-1 bg-green-500/20 rounded-full text-xs">SYN</span>}
                {data.layers.tcp.fin && <span className="px-2 py-1 bg-red-500/20 rounded-full text-xs">FIN</span>}
                {data.layers.tcp.rst && <span className="px-2 py-1 bg-yellow-500/20 rounded-full text-xs">RST</span>}
                {data.layers.tcp.psh && <span className="px-2 py-1 bg-purple-500/20 rounded-full text-xs">PSH</span>}
                {data.layers.tcp.urg && <span className="px-2 py-1 bg-orange-500/20 rounded-full text-xs">URG</span>}
                {data.layers.tcp.cwr && <span className="px-2 py-1 bg-gray-500/20 rounded-full text-xs">CWR</span>}
                {data.layers.tcp.ece && <span className="px-2 py-1 bg-gray-500/20 rounded-full text-xs">ECE</span>}
              </div>
            </div>
          </Section>
        )}

        {data.layers.udp && (
          <Section title="UDP Layer">
            <div className="grid grid-cols-2 gap-2">
              <p>Source Port: {data.layers.udp.srcPort}</p>
              <p>Destination Port: {data.layers.udp.dstPort}</p>
              <p>Length: {data.layers.udp.length}</p>
              <p>Checksum: {data.layers.udp.checksum}</p>
            </div>
          </Section>
        )}

        {data.layers.ethernet && (
          <Section title="Ethernet Layer">
            <div className="grid grid-cols-2 gap-2">
              <p>Source MAC: {data.layers.ethernet.srcMac}</p>
              <p>Destination MAC: {data.layers.ethernet.dstMac}</p>
            </div>
          </Section>
        )}
      </div>
    </div>
  );
};
