import React, { useState } from "react";
import { MagnifyingGlassIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { getSearchResults, SearchRequest } from "../../../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { searchResult } from "./searchResult";
import { useSetAtom } from "jotai";

type Filters = {
  timeRange?: { from?: string; to?: string };
  sourceIp?: string;
  destinationIp?: string;
  protocol?: string;
  filename?: string;
};

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    timeRange: { from: "", to: "" },
    sourceIp: "",
    destinationIp: "",
    protocol: "",
    filename: "",
  });
  const setSearchResult = useSetAtom(searchResult);

  const queryClient = useQueryClient();

  const searchRegexMutation = useMutation({
    mutationFn: getSearchResults,
    onSuccess: (data) => {
      setError("");
      setSuccess("Found " + data.matches.length + " matches");
      setSearchResult(data);
      queryClient.invalidateQueries({ queryKey: ["searches"] });
    },
    onError: (error: Error) => {
      setSuccess("");
      setError(error.message);
    },
  });

  const getIsRuleNameValid = () => {
    return filters.filename != undefined && filters.filename.length <= 69;
  };
  const getIsRegexValid = () => {
    try {
      new RegExp(query);
    } catch (e) {
      console.log(e);
      return false;
    }
    return true;
  };

  const handleSearch = () => {
    let errorString: string = "Data is incorrect!\n";
    if (!getIsRuleNameValid()) {
      errorString = errorString.concat(
        "Service name shouldn't be empty and shouldn't be longer than 69 symbols\n",
      );
    }
    if (!getIsRegexValid()) {
      errorString = errorString.concat("Regex is invalid\n");
    }
    if (getIsRuleNameValid() && getIsRegexValid()) {
      const searchRequest: SearchRequest = {
        regex: query,
        filename: filters.filename!,
      };
      searchRegexMutation.mutate(searchRequest);
    } else {
      setSuccess("");
      setError(errorString);
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
            className={`transition-transform duration-300 ${filtersVisible ? "rotate-180" : "rotate-0"
              }`}
          />
        </button>
      </div>

      <div
        className={`overflow-hidden transition-max-h duration-300 ${filtersVisible ? "max-h-[400px]" : "max-h-0"
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
            <div className="flex flex-col">
              <label className="text-sm">Filename:</label>
              <input
                type="text"
                placeholder="example.pcap"
                value={filters.filename || ""}
                onChange={(e) =>
                  setFilters({ ...filters, filename: e.target.value })
                }
                className="px-4 py-2 bg-gray-500 text-gray-200 rounded"
              />
            </div>
          </div>
        </div>
      </div>
      {error && (
        <span className="text-red-500 ml-4 font-semibold">{error}</span>
      )}
      {success && (
        <span className="text-green-500 ml-4 font-semibold">{success}</span>
      )}
    </div>
  );
};
