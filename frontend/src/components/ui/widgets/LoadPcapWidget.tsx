import React, { useState, useEffect } from "react";
import { postPcapLocal, getPcap } from "../../../api";

export function LoadPcapWidget() {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const pcapFiles = await getPcap();
        console.log("Fetched PCAP Files:", pcapFiles);
        const fileList = pcapFiles.map((pcap) => pcap.id);
        setFiles(fileList);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    }
    fetchFiles();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleLoadAndAnalyze = async () => {
    if (selectedFile) {
      const pcap = {
        id: selectedFile.name,
        content: selectedFile,
      };
      try {
        await postPcapLocal(pcap);
        const updatedFiles = await getPcap();
        const updatedFileList = updatedFiles.map((pcap) => pcap.id);
        setFiles(updatedFileList);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

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
                  onChange={handleFileChange}
                />
                <div>
                  <label className="block text-sm mb-1">Analysis Options</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="deep-inspection" />
                      <label htmlFor="deep-inspection">
                        Deep Packet Inspection
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="extract-files" />
                      <label htmlFor="extract-files">Extract Files</label>
                    </div>
                  </div>
                </div>
                <button
                  className="w-full bg-[#4a5568] px-4 py-2 rounded hover:bg-[#2d3748] transition-colors"
                  onClick={handleLoadAndAnalyze}
                >
                  Load and Analyze
                </button>
              </div>
            </div>

            <div className="bg-[#2d3748] p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Recent Files</h3>
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file}
                    className="flex items-center justify-between p-2 bg-[#1e293b] rounded"
                  >
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
