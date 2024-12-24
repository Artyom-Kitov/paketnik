import { useState } from "react";
import { getPcap, deletePcap } from "../../../api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function FilesWidget() {
  const [selectedFile, setSelectedFile] = useState<undefined | string>(
    undefined,
  );
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["pcaps"],
    queryFn: getPcap,
  });
  const queryClient = useQueryClient();
  const deletePcapMutation = useMutation({
    mutationFn: deletePcap,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pcaps"] });
    },
  });

  function onDeleteClick(id: undefined | string) {
    if (id != undefined) {
      deletePcapMutation.mutate(id);
    }
  }

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
        Files
      </div>
      <div className="bg-[#475569] p-4 text-white flex-1 overflow-auto">
        <div className="space-y-4">
          <div className="bg-[#2d3748] p-4 rounded-lg">
            <h3 className="text-lg  font-semibold mb-3">PCAP Dumps</h3>
            <div className="space-y-2">
              {data?.map((file) => (
                <div
                  key={file.id}
                  onClick={() => setSelectedFile(file.id)}
                  style={{
                    background: selectedFile == file.id ? "#4a5568" : "#1e293b",
                  }}
                  className="flex items-center hover:!bg-[#4a5568] justify-between p-2 rounded"
                >
                  <span title={file.id} className="truncate">
                    {file.id}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-x-2 mt-2">
              <button
                onClick={() => onDeleteClick(selectedFile)}
                className="px-3 py-1 bg-[#e53e3e] rounded hover:bg-[#c53030] transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
