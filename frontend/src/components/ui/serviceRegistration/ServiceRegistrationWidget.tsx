import React from "react";
import { useState } from "react";
import { NewServiceForm } from "./NewServiceForm";
import { RegisteredServiceForm } from "./RegisteredServiceForm";

export function ServiceRegistrationWidget() {
  const [serviceName, setServiceName] = useState("");
  const [port, setPort] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [highlightColor, setHighlightColor] = useState("#000000");
  const [isRegistered, setIsRegistered] = React.useState(false);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="text-left text-[#fff] text-2xl font-bold mb-[6px]">
        Services
      </div>
      <div className="bg-[#475569] p-4 text-white flex-1 overflow-auto">
        <div className="space-y-4">
          <div className="bg-[#2d3748] p-4 rounded-lg">
            {!isRegistered ? (
              <NewServiceForm
                serviceName={serviceName}
                port={port}
                serviceDescription={serviceDescription}
                highlightColor={highlightColor}
                isRegistered={isRegistered}
                setServiceName={setServiceName}
                setPort={setPort}
                setServiceDescription={setServiceDescription}
                setHighlightColor={setHighlightColor}
                setIsRegistered={setIsRegistered}
              />
            ) : (
              <RegisteredServiceForm
                serviceName={serviceName}
                port={port}
                serviceDescription={serviceDescription}
                highlightColor={highlightColor}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
