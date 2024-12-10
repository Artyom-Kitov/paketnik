export function RulesWidget() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="text-left text-[#fff] text-2xl font-bold mb-[6px]">
        Rules
      </div>
      <div className="bg-[#475569] p-4 text-white flex-1 overflow-auto">
        <div className="space-y-4">
          <div className="bg-[#2d3748] p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Active Rules</h3>

            <ul className="list-disc list-inside space-y-2">
              <li>HTTP Traffic (Port 80)</li>
              <li>HTTPS Traffic (Port 443)</li>
              <li>DNS Queries (Port 53)</li>
            </ul>
          </div>

          <div className="bg-[#2d3748] p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Add New Rule</h3>
            <form className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Rule Name</label>
                <input
                  type="text"
                  className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]"
                  placeholder="Enter rule name"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Type</label>
                <input
                  type="text"
                  className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]"
                  placeholder="Enter pule type"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Regex</label>
                <input
                  type="text"
                  className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]"
                  placeholder="Enter regex"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Scope</label>
                <input
                  type="text"
                  className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]"
                  placeholder="Enter rule scope"
                />
              </div>
              <button className="bg-[#4a5568] px-4 py-2 rounded hover:bg-[#2d3748] transition-colors">
                Add Rule
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
