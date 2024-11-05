import React from "react";
import { useState } from "react";

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
      <h1 className="font-bold text-2xl text-white m-3">
        Register new service:
      </h1>
      <label className="text-red-500 font-semibold text-lg text-xl mb-2 block px-4 whitespace-pre-line">
        {errorMessage}
      </label>
      <div className="max-w-4xl mx-auto font-[sans-serif] p-6">
        <form>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-white font-semibold text-xl text-sm mb-2 block">
                Service name
                <sup className="text-red-400 font-semibold text-xl align-bottom">
                  *
                </sup>
              </label>
              <input
                name="name"
                type="text"
                className="h-12 bg-[#F1F5F9] w-full text-gray-800 text-xl px-4 py-3.5 rounded-md outline-[#5273bf] transition-all"
                placeholder="Enter service name"
                value={serviceName}
                onChange={(e) => {
                  setServiceName(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="text-white font-semibold text-xl text-sm mb-2 block">
                Port
                <sup className="text-red-400 font-semibold text-xl align-bottom">
                  *
                </sup>
              </label>
              <input
                name="lname"
                type="number"
                className="h-12 bg-[#F1F5F9] w-full text-gray-800 text-xl px-4 py-3.5 rounded-md outline-[#5273bf] transition-all"
                placeholder="Enter port"
                value={port}
                onChange={(e) => {
                  setPort(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="text-white font-semibold text-xl text-sm mb-2 block">
                Service description
              </label>
              <textarea
                name="email"
                className="h-36 bg-[#F1F5F9] w-full text-gray-800 text-xl px-4 py-3.5 rounded-md outline-[#5273bf] transition-all"
                placeholder="Enter service description"
                value={serviceDescription}
                onChange={(e) => {
                  setServiceDescription(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="text-white font-semibold text-xl text-sm mb-2 block">
                Highlight color
                <sup className="text-red-400 font-semibold text-xl align-bottom">
                  *
                </sup>
              </label>
              <input
                type="color"
                className="pl-0.5 pr-0.5 h-12 w-20 block border-gray-200 cursor-pointer rounded-md"
                value={highlightColor}
                onChange={(e) => {
                  setHighlightColor(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="!mt-12">
            <button
              type="button"
              className="py-3.5 px-7 text-sm font-semibold tracking-wider rounded-md text-white bg-[#0F172A] hover:bg-[#5273bf] focus:outline-none"
              onClick={registerService}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
