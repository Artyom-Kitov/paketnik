import { useState } from "react";


export function FilesWidget() {
    const [selectedFile, setSelectedFile] = useState<undefined|number>(undefined)

    return (
        <div className="w-full h-full flex flex-col">
            <div className="text-left text-[#fff] text-2xl font-bold mb-[6px]">
                Files
            </div>
            <div className="bg-[#475569] p-4 text-white flex-1 overflow-auto">
                <div className="space-y-4">
                    <div className="bg-[#2d3748] p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3">PCAP Dumps</h3>
                        <div className="space-y-2">
                            {[{id : 1, name : 'capture1.pcap'}, {id : 2, name : 'capture2.pcap'}, {id : 3, name : 'capture3.pcap'}].map((file) => (
                                <div 
                                key={file.id} 
                                onClick={() => setSelectedFile(file.id)}  
                                style={{background: selectedFile==file.id ? '#4a5568' : '#1e293b'}}
                                className="flex items-center hover:!bg-[#4a5568] justify-between p-2 rounded"
                                >
                                    <span>{file.name}</span>
                                </div>
                            ))}
                        </div>
                        <div className="space-x-2 mt-2">
                            <button className="px-3 py-1 bg-[#4a5568] rounded hover:bg-[#2d3748] transition-colors">
                                Analysis
                            </button>
                            <button className="px-3 py-1 bg-[#e53e3e] rounded hover:bg-[#c53030] transition-colors">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
