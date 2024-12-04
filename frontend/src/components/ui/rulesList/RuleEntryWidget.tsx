import {Rule} from "../../../api"

export type Props = {
  data: Rule;
};

export const RuleEntryWidget = ({data}:Props) => {
  const rule = data;
  return (
    <tr
      className="h-[50px] bg-[#1e293b] border-t-2 hover:bg-[#2d3748] border-[#ccc]"
    >
      <th className="text-xl text-[#fff] font-bold bg-[#FF4081]">
        {rule.name}
      </th>
      <th className="text-xl text-[#e2e8f0] font-bold">{rule.type}</th>
      <th className="text-xl text-[#e2e8f0] font-bold">{rule.scope}</th>
      <th className="text-xl text-[#e2e8f0] font-bold">{rule.regex}</th>
      <th className="text-xl text-[#e2e8f0] font-bold">
        <button
          type="button"
          className="bg-[#2d3748] px-4 py-2 rounded hover:bg-[#252c3a] transition-colors text-white font-bold"
        >
          Delete
        </button>

      </th>
    </tr>
  );
};

