import { useEffect} from "react";

type contextMenuProps = {
  top: number;
  left: number;
};

export const ContextMenu = ({ top, left }: contextMenuProps) => {
  useEffect(() => {
    console.log(top);
    console.log(left);
  });

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        console.log("download");
      }}
      className="w-[256px] h-[42px] absolute bg-[#F1F5F9] text-base text-[#334155] font-semibold cursor-default fade-in-80 select-none items-center rounded-sm pl-10 pr-2 pt-[7px] outline-none focus:bg-accent focus:text-accent-foreground"
      style={{ top: `${top}px`, left: `${left}px` }}
    >
      Download as PCAP
    </div>
  );
};
