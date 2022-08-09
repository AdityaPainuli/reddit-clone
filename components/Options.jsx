import React from "react";
import {
  ChevronDoubleDownIcon,
  DotsHorizontalIcon,
  HashtagIcon,
  SunIcon,
} from "@heroicons/react/solid";

const Options = () => {
  return (
    <div className="md:flex hidden items-center bg-white my-2 p-2 rounded-sm shadow-lg mt-4">
      <div className="flex items-center flex-grow space-x-4">
        <div className="menu-items items-active">
          🚀 <span>Best</span>
        </div>
        <div className="menu-items">
          🔥 <span>Hot</span>
        </div>
        <div className="flex items-center menu-items">
          <HashtagIcon className="h-6 w-6" />
          <span>Trending</span>
        </div>
        <div className="flex items-center menu-items">
          <SunIcon className="h-6 w-6" />
          <span>New</span>
        </div>
        <div>
          <DotsHorizontalIcon className="icon !rounded-sm !border-none hover:text-blue-500" />
        </div>
      </div>
      <div>
        <ChevronDoubleDownIcon className="icon  !rounded-md !border-none" />
      </div>
    </div>
  );
};

export default Options;
