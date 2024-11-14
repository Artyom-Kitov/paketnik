import { Input } from "../shadcn/input";
import { Textarea } from "../shadcn/textarea";

export function RegisteredServiceForm({
  serviceName,
  port,
  serviceDescription,
  highlightColor,
}: {
  serviceName: string;
  port: string;
  serviceDescription: string;
  highlightColor: string;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Registered Service Info</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Service Name</label>
          <Input
            type="text"
            className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]"
            value={serviceName}
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Port</label>
          <div className="text-lg">{port}</div>
        </div>

        <div>
          <label className="block text-sm mb-1">Service Description</label>
          <Textarea
            className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]"
            value={serviceDescription}
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Highlight Color</label>
          <div
            className="w-20 h-10 rounded border border-[#4a5568]"
            style={{ backgroundColor: highlightColor }}
          ></div>
        </div>
      </div>
    </div>
  );
}
