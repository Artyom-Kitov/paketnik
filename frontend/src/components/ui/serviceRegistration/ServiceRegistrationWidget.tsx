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
    <div>
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
      ) : null}
      {isRegistered ? (
        <RegisteredServiceForm
          serviceName={serviceName}
          port={port}
          serviceDescription={serviceDescription}
          highlightColor={highlightColor}
        />
      ) : null}
    </div>
  );
}
