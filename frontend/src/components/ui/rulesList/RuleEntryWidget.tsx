import { updateRule, deleteRule, Rule } from "../../../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { X, Save } from "lucide-react";
import { Button } from "../shadcn/button";

export type Props = {
  data: Rule;
};

export const RuleEntryWidget = ({ data }: Props) => {
  const [name, setName] = useState(data.name);
  const [type, setType] = useState(data.type);
  const [scope, setScope] = useState(data.scope);
  const [regex, setRegex] = useState(data.regex);

  const queryClient = useQueryClient();

  const updateRuleMutation = useMutation({
    mutationFn: updateRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rules"] });
    },
  });
  const deleteRuleMutation = useMutation({
    mutationFn: deleteRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rules"] });
    },
    onError: () => {
      console.log("error");
    },
  });

  return (
    <tr className="h-[50px] border-t-2 hover:bg-[#2d3748] bg-[#1e293b] border-[#ccc]">
      <th className="text-xl text-[#fff] font-bold">
        <input
          type="text"
          className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]"
          placeholder="Enter rule name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </th>
      <th className="text-xl text-[#e2e8f0] font-bold">
        <select
          className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="REGEX">REGEX</option>
        </select>
      </th>
      <th className="text-xl text-[#e2e8f0] font-bold">
        <select
          className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
        >
          <option value="INCOMING">INCOMING</option>
          <option value="OUTGOING">OUTGOING</option>
          <option value="BOTH">BOTH</option>
        </select>
      </th>
      <th className="text-xl text-[#e2e8f0] font-bold">
        <input
          type="text"
          className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]"
          placeholder="Enter regex"
          value={regex}
          onChange={(e) => setRegex(e.target.value)}
        />
      </th>
      <th className="text-xl text-[#e2e8f0] font-bold">
        <div className="grid grid-cols-2 gap-1 content-center">
          <div>
            <Button
              variant="outline"
              size="icon"
              className="bg-[#2d3748] rounded hover:bg-[#252c3a] transition-colors text-white font-bold"
              onClick={() => {
                deleteRuleMutation.mutate(data.id);
                console.log(data.id);
              }}
            >
              <X />
            </Button>
          </div>
          <div>
            <Button
              variant="outline"
              size="icon"
              className="bg-[#2d3748] rounded hover:bg-[#252c3a] transition-colors text-white font-bold"
              onClick={() => {
                const rule: Rule = {
                  id: data.id,
                  name: name,
                  regex: regex,
                  type: type,
                  scope: scope,
                };
                updateRuleMutation.mutate(rule);
              }}
            >
              <Save />
            </Button>
          </div>
        </div>
      </th>
    </tr>
  );
};
