import { ServiceWidget } from "./ServiceWidget";
import { getServices, deleteService } from "../../../api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const ServicesListWidget = ({
  setCurrentWidget,
}: {
  setCurrentWidget: (widget: string) => void;
}) => {
  const queryClient = useQueryClient();
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["service"],
    queryFn: getServices,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service"] });
    },
  });

  if (isPending) {
    <div className="w-full h-full flex flex-col">
      <div className="text-right text-[#fff] text-2xl font-bold mb-2">
        Loading... {data}
      </div>
    </div>;
  } else if (isError) {
    <div className="w-full h-full flex flex-col">
      <div className="text-right text-[#fff] text-2xl font-bold mb-2 text-red-600">
        Error: {error.message}
      </div>
    </div>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="text-left text-[#fff] text-2xl font-bold mb-2">
        Services
      </div>
      <div className="w-full bg-[#475569] p-[7px] flex-1 overflow-auto">
        <button
          type="button"
          className="bg-[#2d3748] px-4 py-2 rounded hover:bg-[#252c3a] transition-colors text-white font-bold"
          onClick={() => {
            setCurrentWidget("ServiceRegistation");
          }}
        >
          Register new Service
        </button>
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-[#475569] z-10">
            <tr className="h-[50px]">
              <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
                service
              </th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
                id
              </th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
                port
              </th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
                hex color
              </th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky px-20.45">
                actions
              </th>
            </tr>
            <tr className="h-[12px] bg-[#1e293b]"></tr>
            <tr className="h-[7px]"> </tr>
          </thead>
          <tbody>
            {data?.map((service) => (
              <tr
                key={service.id}
                className="h-[50px] bg-[#1e293b] mb-[7px] hover:bg-[#252c3a]"
              >
                <ServiceWidget service={service} />
                <td className="text-center text-[#e2e8f0] text-xl">
                  <button
                    onClick={() => deleteMutation.mutate(service.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
