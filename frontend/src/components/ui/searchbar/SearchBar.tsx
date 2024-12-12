import React, { useState } from "react";
import { MagnifyingGlassIcon, ChevronDownIcon } from "@radix-ui/react-icons";

type SearchBarProps = {
  onSearch: (query: string, filters: Filters) => void;
};

type Filters = {
  timeRange?: { from?: string; to?: string };
  sourceIp?: string;
  destinationIp?: string;
  protocol?: string;
};

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    timeRange: { from: "", to: "" },
    sourceIp: "",
    destinationIp: "",
    protocol: "",
  });

  const handleSearch = () => {
    try {
      new RegExp(query);
      onSearch(query, filters);
      setError("");
    } catch {
      setError("Invalid Regular Expression");
    }
  };

  const toggleFilters = () => {
    setFiltersVisible((prev) => !prev);
  };

  return (
    <div className="absolute top-0 right-0 m-2  mr-64 z-50">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search by RegExp..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-6 py-3 w-[400px] bg-[#475569] text-[15.5px] text-gray-100 outline-none focus:ring-0"
        />
        <button
          onClick={handleSearch}
          className="bg-[#475569] text-white px-4 py-4 flex items-center space-x-1"
        >
          <MagnifyingGlassIcon />
        </button>
        <button
          onClick={toggleFilters}
          className="bg-[#475569] text-white px-4 py-4 flex items-center"
        >
          <ChevronDownIcon
            className={`transition-transform duration-300 ${
              filtersVisible ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </div>

      <div
        className={`overflow-hidden transition-max-h duration-300 ${
          filtersVisible ? "max-h-[400px]" : "max-h-0"
        }`}
      >
        <div className="bg-[#1e293b] border border-gray-600 text-gray-100 rounded shadow-lg p-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm">Time From:</label>
              <input
                type="datetime-local"
                value={filters.timeRange?.from || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    timeRange: { ...filters.timeRange, from: e.target.value },
                  })
                }
                className="px-4 py-2 bg-gray-500 text-gray-200 rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm">Time To:</label>
              <input
                type="datetime-local"
                value={filters.timeRange?.to || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    timeRange: { ...filters.timeRange, to: e.target.value },
                  })
                }
                className="px-4 py-2 bg-gray-500 text-gray-200 rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm">Source IP:</label>
              <input
                type="text"
                placeholder="e.g., 192.168.1.1"
                value={filters.sourceIp || ""}
                onChange={(e) =>
                  setFilters({ ...filters, sourceIp: e.target.value })
                }
                className="px-4 py-2 bg-gray-500 text-gray-200 rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm">Destination IP:</label>
              <input
                type="text"
                placeholder="e.g., 192.168.1.2"
                value={filters.destinationIp || ""}
                onChange={(e) =>
                  setFilters({ ...filters, destinationIp: e.target.value })
                }
                className="px-4 py-2 bg-gray-500 text-gray-200 rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm">Protocol:</label>
              <select
                value={filters.protocol || ""}
                onChange={(e) =>
                  setFilters({ ...filters, protocol: e.target.value })
                }
                className="px-4 py-2 bg-gray-500 text-gray-200 rounded"
              >
                <option value="">Any</option>
                <option value="TCP">TCP</option>
                <option value="UDP">UDP</option>
                <option value="HTTP">HTTP</option>
                <option value="HTTPS">HTTPS</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {error && <span className="text-red-500 ml-4">{error}</span>}
    </div>
  );
};
