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
      <h1 className="font-bold text-2xl text-white m-3">
        Registered service info:
      </h1>
      <div className="max-w-4xl mx-auto font-[sans-serif] p-6">
        <form>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-white font-semibold text-lg text-xl mb-2 block">
                Service name:
              </label>
              <Input
                name="name"
                type="text"
                className="h-12 bg-[#F1F5F9] w-full text-gray-800 text-xl px-4 py-3.5 rounded-md outline-[#5273bf] transition-all"
                placeholder="Enter service name"
                value={serviceName}
              />
            </div>
            <div>
              <label className="text-white font-semibold text-lg text-xl mb-2 block">
                Port:
              </label>
              <label className="text-white font-semibold text-lg text-3xl mb-2 block">
                {port}
              </label>
            </div>
            <div>
              <label className="text-white font-semibold text-lg text-xl mb-2 block">
                Service description:
              </label>
              <Textarea
                name="email"
                className="h-36 bg-[#F1F5F9] w-full text-gray-800 text-xl px-4 py-3.5 rounded-md outline-[#5273bf] transition-all"
                value={serviceDescription}
              />
            </div>
            <div>
              <label className="text-white font-semibold text-lg text-xl mb-2 block">
                Highlight color:
              </label>
              <div
                className="box-border bg-[--color] border-gray-200 h-12 w-20 p-4 border-4 rounded-md"
                style={{ "--color": highlightColor } as React.CSSProperties}
              ></div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
