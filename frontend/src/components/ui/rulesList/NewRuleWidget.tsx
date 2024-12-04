import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postRule, Rule } from "../../../api";
import { useState } from "react";


export function NewRuleWidget() {

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [scope, setScope] = useState("");
    const [regex, setRegex] = useState("");


  const queryClient = useQueryClient();

  const addRuleMutation = useMutation({
    mutationFn: postRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rules"] });
    },
  });
    return (
      <div className="w-full h-full flex flex-col">
        <div className="bg-[#475569] p-4 text-white flex-1 overflow-auto">
            <div className="bg-[#2d3748] p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Add New Rule</h3>
              <form className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">Rule Name</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]"
                    placeholder="Enter rule name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Type</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]"
                    placeholder="Enter pule type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Regex</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]"
                    placeholder="Enter regex"
                    value={regex}
                    onChange={(e) => setRegex(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Scope</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]"
                    placeholder="Enter rule scope"
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                  />
                </div>
                <button className="bg-[#4a5568] px-4 py-2 rounded hover:bg-[#2d3748] transition-colors" onClick={()=>
                {
                    const rule: Rule = {
                        id: "0",
                        name: name,
                        regex: regex,
                        type: type,
                        scope: scope,
                    };
                    addRuleMutation.mutate(rule);
                }}>
                  Add Rule
                </button>
              </form>
            </div>
          </div>
        </div>
    );
  }
  