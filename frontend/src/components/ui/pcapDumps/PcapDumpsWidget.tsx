import { useEffect, useState } from "react";
import { pcapsData } from "@/fixtures/pcapsData";
import { Button } from "../shadcn/buttonForPcapDumps";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";

type Pcap = {
  id: number;
  name: string;
};

const PcapDumpsWidget = () => {
  const [pcaps, setPcaps] = useState<Pcap[]>([]);
  const [selectedItemId, setId] = useState<number>(-1);

  useEffect(() => {
    setPcaps(pcapsData);
  }, []);

  function deletePcap(idToRemove: number) {
    if (selectedItemId != -1) {
      setPcaps((state) => state.filter((item) => item.id !== idToRemove));
    }
  }

  // function analyzePcap(idToRemove: number) {}

  const onSelectedItem = (value: string) => {
    setId(parseInt(value));
  };

  return (
    <div className="flex mt-[10px] ml-[22px]">
      <Select onValueChange={onSelectedItem}>
        <SelectTrigger className="w-[204px] h-[40px] bg-[#F1F5F9]">
          <SelectValue placeholder="Select a PCAP" />
        </SelectTrigger>
        <SelectContent>
          {pcaps.map((pcap) => (
            <SelectItem value={pcap.id.toString()}>{pcap.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        className="ml-[22px]"
      >
        Analyze
      </Button>
      <Button
        onClick={(event) => {
          event.preventDefault();
          deletePcap(selectedItemId);
        }}
        variant="destructive"
        className="ml-[13px]"
      >
        Delete
      </Button>
    </div>
  );
};

export { PcapDumpsWidget };
