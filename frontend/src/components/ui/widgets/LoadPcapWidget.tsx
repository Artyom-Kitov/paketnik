import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { postPcapRemote, getPcap, Pcap } from "../../../api";

export function LoadPcapWidget() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["pcaps"],
    queryFn: getPcap,
  });
  const queryClient = useQueryClient();

  const { mutate: loadAndAnalyzeMutation } = useMutation({
    mutationFn: postPcapRemote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pcaps"] });
      await queryClient.invalidateQueries({ queryKey: ["streams"] });
      setTimeout(async () => {
        await queryClient.invalidateQueries({ queryKey: ["streams"] });
      }, 1000)
      setUploadSuccess(true);
      setUploadError(null);
    },
    onError: (error: Error) => {
      setUploadSuccess(false);
      setUploadError(error.message);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) {
      setSelectedFile(event.target.files[0]);
    }
  };

  function getExtention(fileName: string) {
    return fileName.split(".").pop();
  }

  const handleLoadAndAnalyze = () => {
    if (
      selectedFile &&
      getExtention(selectedFile.name)?.toLocaleLowerCase() === "pcap"
    ) {
      const pcap: Pcap = {
        id: selectedFile.name,
        content: selectedFile,
      };
      loadAndAnalyzeMutation(pcap);
    } else {
      setUploadError("That is not pcap file");
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
                  accept=".pcap"
                  onChange={handleFileChange}
                />
                {uploadSuccess && (
                  <div className="p-2 bg-green-600 bg-opacity-25 border border-green-500 rounded text-green-400">
                    File successfully uploaded
                  </div>
                )}
                {uploadError && (
                  <div className="p-2 bg-red-600 bg-opacity-25 border border-red-500 rounded text-red-400">
                    {uploadError}
                  </div>
                )}
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
