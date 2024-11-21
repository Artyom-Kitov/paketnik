import { useState } from "react";
import { Input } from "../shadcn/input";
import { Textarea } from "../shadcn/textarea";

export function NewServiceForm({
  serviceName,
  port,
  serviceDescription,
  highlightColor,
  setServiceName,
  setPort,
  setServiceDescription,
  setHighlightColor,
  setIsRegistered,
}: {
  serviceName: string;
  port: string;
  serviceDescription: string;
  highlightColor: string;
  isRegistered: boolean;
  setServiceName: React.Dispatch<React.SetStateAction<string>>;
  setPort: React.Dispatch<React.SetStateAction<string>>;
  setServiceDescription: React.Dispatch<React.SetStateAction<string>>;
  setHighlightColor: React.Dispatch<React.SetStateAction<string>>;
  setIsRegistered: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [errorMessage, setErrorMessage] = useState("");

  const getIsDataValid = () => {
    return (
      getIsServiceNameValid() &&
      getIsPortValid() &&
      getIsServiceDescriptionValid()
    );
  };
  const getIsServiceNameValid = () => {
    return serviceName != "" && serviceName.length <= 64;
  };
  const getIsPortValid = () => {
    return port != "" && parseInt(port) >= 1 && parseInt(port) <= 49151;
  };
  const getIsServiceDescriptionValid = () => {
    return serviceDescription.length <= 256;
  };

  const registerService = () => {
    if (getIsDataValid()) {
      setIsRegistered(true);
    } else {
      let errorString: string = "Data is incorrect!\n";
      if (!getIsServiceNameValid()) {
        errorString = errorString.concat(
          "Service name shouldn't be empty and shouldn't be longer than 64 symbols\n",
        );
      }
      if (!getIsPortValid()) {
        errorString = errorString.concat(
          "Port should be not empty and should be a decimal number from 1 to 49151\n",
        );
      }
      if (!getIsServiceDescriptionValid()) {
        errorString = errorString.concat(
          "Service description should be shorter than 256 symbols\n",
        );
      }
      setErrorMessage(errorString);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Register New Service</h3>
      {errorMessage && (
        <div className="text-red-400 mb-4 whitespace-pre-line">
          {errorMessage}
        </div>
      )}
      <form className="space-y-3">
        <div>
          <label className="block text-sm mb-1">
            Service Name
            <span className="text-red-400 ml-1">*</span>
          </label>
          <Input
            type="text"
            className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]"
            placeholder="Enter service name"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
            Port
            <span className="text-red-400 ml-1">*</span>
          </label>
          <Input
            type="number"
            className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]"
            placeholder="Enter port"
            value={port}
            onChange={(e) => setPort(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Service Description</label>
          <Textarea
            className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]"
            placeholder="Enter service description"
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
            Highlight Color
            <span className="text-red-400 ml-1">*</span>
          </label>
          <Input
            type="color"
            className="w-20 h-10 p-1 rounded bg-[#1e293b] border border-[#4a5568]"
            value={highlightColor}
            onChange={(e) => setHighlightColor(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="bg-[#4a5568] px-4 py-2 rounded hover:bg-[#2d3748] transition-colors"
          onClick={registerService}
        >
          Register Service
        </button>
      </form>
    </div>
  );
}
