import { BsSquare, BsCircle } from "react-icons/bs";
import { zinc } from "tailwindcss/colors";

export default function NodeTable() {
  const nodes = [
    {
      id: 1,
      icon: BsSquare,
    },
    {
      id: 2,
      icon: BsCircle,
    },
  ];

  return (
    <div className="flex  w-52 h-44 rounded-xl h-full bg-black  opacity-[0.6] p-4">
      <ul className="flex flex-row h-[10px] gap-1 flex-wrap w-full ">
        {nodes.map((node) => (
          <li key={node.id} className="p-1 bg-zinc-950 rounded-lg">
            <button className="w-full h-full bg-red-400 cursor-pointer">
              <node.icon className="text-white text-[20px]" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
