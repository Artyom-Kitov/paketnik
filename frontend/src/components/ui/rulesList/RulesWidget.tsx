import { RulesTableWidget } from "./RulesTableWidget";
import { NewRuleWidget } from "./NewRuleWidget";

export function RulesWidget() {
    return (
      <div className="w-full h-full flex flex-col">
        <RulesTableWidget/>
        <NewRuleWidget/>
      </div>
    );
  }
  