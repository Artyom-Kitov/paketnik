
export function ConfigWidget() {
    return (
        <div className="w-full h-full flex flex-col">
            <div className="text-left text-[#fff] text-2xl font-bold mb-[6px]">
                Configuration
            </div>
            <div className="bg-[#475569] p-4 text-white flex-1 overflow-auto">
                <div className="space-y-4">
                    <div className="bg-[#2d3748] p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3">General Settings</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm mb-1">Interface</label>
                                <select className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]">
                                    <option>eth0</option>
                                    <option>wlan0</option>
                                    <option>lo</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Capture Buffer Size (MB)</label>
                                <input
                                    type="number"
                                    className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]"
                                    defaultValue="64"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="promiscuous" />
                                <label htmlFor="promiscuous">Promiscuous Mode</label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#2d3748] p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3">Display Settings</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm mb-1">Theme</label>
                                <select className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]">
                                    <option>Dark</option>
                                    <option>Light</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Time Format</label>
                                <select className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]">
                                    <option>24-hour</option>
                                    <option>12-hour</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 