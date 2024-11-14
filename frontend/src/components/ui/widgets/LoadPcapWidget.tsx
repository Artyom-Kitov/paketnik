
export function LoadPcapWidget() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="text-left text-[#fff] text-2xl font-bold mb-[6px]">
        Load PCAP
      </div>
      <div className="bg-[#475569] p-4 text-white flex-1 overflow-auto">
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="bg-[#2d3748] p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Select PCAP File</h3>
              <div className="space-y-3">
                <input
                  type="file"
                  className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]"
                  accept=".pcap,.pcapng"
                />
                <div>
                  <label className="block text-sm mb-1">Analysis Options</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="deep-inspection" />
                      <label htmlFor="deep-inspection">Deep Packet Inspection</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="extract-files" />
                      <label htmlFor="extract-files">Extract Files</label>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-[#4a5568] px-4 py-2 rounded hover:bg-[#2d3748] transition-colors">
                  Load and Analyze
                </button>
              </div>
            </div>

            <div className="bg-[#2d3748] p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Recent Files</h3>
              <div className="space-y-2">
                {['recent1.pcap', 'recent2.pcap', 'recent3.pcap'].map((file) => (
                  <div key={file} className="flex items-center justify-between p-2 bg-[#1e293b] rounded">
                    <span>{file}</span>
                    <button className="px-3 py-1 bg-[#4a5568] rounded hover:bg-[#2d3748] transition-colors">
                      Load
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 