import { RuleEntryWidget } from "./RuleEntryWidget";
import { getRules } from "../../../api";
import { useQuery } from "@tanstack/react-query";

export const RulesTableWidget = () => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["rules"],
    queryFn: getRules,
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
      <div className="text-right text-[#fff] text-2xl font-bold mb-2">
        Rules
      </div>
      <div className="w-full bg-[#475569] p-[7px] flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-[#475569] z-10">
            <tr className="h-[50px]">
              <th className="text-xl text-[#e2e8f0] font-bold sticky">
                Rule name
              </th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky">
                Type
              </th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky">
                Scope
              </th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky px-[40px]">
                Regex
              </th>
              <th className="text-xl text-[#e2e8f0] font-bold sticky">
                Action
              </th>
            </tr>
            <tr className="h-[12px] bg-[#1e293b]"></tr>
            <tr className="h-[7px]"> </tr>
          </thead>
          <tbody>
            {data?.map((rule) => (
              <RuleEntryWidget key={rule.id} data={rule} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
