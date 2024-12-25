import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { postPcapRemote, getPcap, Pcap } from "../../../api";

export function LoadPcapWidget() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [serverAnswer, setAnswer] = useState<string | undefined>(undefined);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["pcaps"],
    queryFn: getPcap,
  });
  const queryClient = useQueryClient();

  const { mutate: loadAndAnalyzeMutation } = useMutation({
    mutationFn: postPcapRemote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pcaps"] });
      setAnswer("Ok : file successfully upload");
    },
    onError: (error: Error) => {
      setAnswer("Error:" + error.message);
      console.error("Error uploading file:", error);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleLoadAndAnalyze = () => {
    if (selectedFile) {
      const pcap: Pcap = {
        id: selectedFile.name,
        content: selectedFile,
      };
      loadAndAnalyzeMutation(pcap);
    }
  };

  if (isPending) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="text-right text-[#fff] text-2xl font-bold mb-2">
          Loading... {data}
        </div>
      </div>
    );
  } else if (isError) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="text-right text-[#fff] text-2xl font-bold mb-2 text-red-600">
          Error: {error.message}
        </div>
      </div>
    );
  }

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
                <div>{serverAnswer}</div>
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
                {data.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2 bg-[#1e293b] rounded"
                  >
                    <span title={file.id} className="truncate">
                      {file.id}
                    </span>
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
