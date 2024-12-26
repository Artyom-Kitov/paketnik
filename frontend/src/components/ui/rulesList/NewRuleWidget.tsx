import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postRule, Rule } from "../../../api";
import { useState } from "react";

export function NewRuleWidget() {
  const [name, setName] = useState("");
  const [type, setType] = useState("REGEX");
  const [scope, setScope] = useState("INCOMING");
  const [regex, setRegex] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const queryClient = useQueryClient();

  const addRuleMutation = useMutation({
    mutationFn: postRule,
    onSuccess: (data) => {
      if (data.ok) {
        queryClient.invalidateQueries({ queryKey: ["rules"] });
      } else {
        data.text().then((text) => setErrorMessage(text));
      }
    },
  });
  const getIsDataValid = () => {
    return getIsRuleNameValid() && getIsRegexValid() && getIsRegexLengthValid();
  };
  const getIsRuleNameValid = () => {
    return name != "" && name.length <= 64;
  };
  const getIsRegexLengthValid = () => {
    return regex != "" && regex.length <= 200;
  };
  const getIsRegexValid = () => {
    try {
      new RegExp(regex);
    } catch (e) {
      console.log(e);
      return false;
    }
    return true;
  };

  const registerRule = () => {
    setErrorMessage("");
    if (getIsDataValid()) {
      const rule: Rule = {
        id: "0",
        name: name,
        regex: regex,
        type: type,
        scope: scope,
      };
      addRuleMutation.mutate(rule);
    } else {
      let errorString: string = "Data is incorrect!\n";
      if (!getIsRuleNameValid()) {
        errorString = errorString.concat(
          "Service name shouldn't be empty and shouldn't be longer than 64 symbols\n" +
            "length of your rule name is " +
            name.length +
            "\n",
        );
      }
      if (!getIsRegexValid()) {
        errorString = errorString.concat("Regex is invalid\n");
      }
      if (!getIsRegexLengthValid()) {
        errorString = errorString.concat(
          "Regex length is invalid. It shouldn't be empty and shouldn't be longer than 200 symbols\n" +
            "length of your regex is " +
            regex.length +
            "\n",
        );
      }
      setErrorMessage(errorString);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-[#475569] p-4 text-white flex-1 overflow-auto">
        <div className="bg-[#2d3748] p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Add New Rule</h3>
          {errorMessage && (
            <div className="text-red-400 mb-4 whitespace-pre-line">
              {errorMessage}
            </div>
          )}

          <div className="my-2">
            <label className="block text-sm mb-1">Rule Name</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]"
              placeholder="Enter rule name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="my-2">
            <label className="block text-sm mb-1">Type</label>
            <select
              className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="REGEX">REGEX</option>
            </select>
          </div>
          <div className="my-2">
            <label className="block text-sm mb-1">Regex</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]"
              placeholder="Enter regex"
              value={regex}
              onChange={(e) => setRegex(e.target.value)}
            />
          </div>
          <div className="my-2">
            <label className="block text-sm mb-1">Scope</label>
            <select
              className="w-full p-2 rounded bg-[#1e293b] border border-[#4a5568]"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
            >
              <option value="INCOMING">INCOMING</option>
              <option value="OUTGOING">OUTGOING</option>
              <option value="BOTH">BOTH</option>
            </select>
          </div>
          <button
            className="bg-[#4a5568] px-4 py-2 rounded hover:bg-[#2d3748] transition-colors"
            onClick={() => {
              registerRule();
            }}
          >
            Add Rule
          </button>
        </div>
      </div>
    </div>
  );
}
