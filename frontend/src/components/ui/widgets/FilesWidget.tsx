
export function FilesWidget() {
    return (
        <div className="w-full h-full flex flex-col">
            <div className="text-left text-[#fff] text-2xl font-bold mb-[6px]">
                Files
            </div>
            <div className="bg-[#475569] p-4 text-white flex-1 overflow-auto">
                <div className="space-y-4">
                    <div className="bg-[#2d3748] p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3">Saved Captures</h3>
                        <div className="space-y-2">
                            {['capture1.pcap', 'capture2.pcap', 'capture3.pcap'].map((file) => (
                                <div key={file} className="flex items-center justify-between p-2 bg-[#1e293b] rounded">
                                    <span>{file}</span>
                                    <div className="space-x-2">
                                        <button className="px-3 py-1 bg-[#4a5568] rounded hover:bg-[#2d3748] transition-colors">
                                            Download
                                        </button>
                                        <button className="px-3 py-1 bg-[#e53e3e] rounded hover:bg-[#c53030] transition-colors">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#2d3748] p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3">Upload Capture</h3>
                        <div className="space-y-3">
                            <input
                                type="file"
                                className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]"
                                accept=".pcap,.pcapng"
                            />
                            <button className="w-full bg-[#4a5568] px-4 py-2 rounded hover:bg-[#2d3748] transition-colors">
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 