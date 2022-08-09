import React from "react";
import { HomeIcon } from "@heroicons/react/solid";
import {
  SearchIcon,
  ChatIcon,
  ChevronDownIcon,
  PlusSmIcon,
  SpeakerphoneIcon,
  TrendingUpIcon,
  VideoCameraIcon,
  BellIcon,
  ChartSquareBarIcon,
} from "@heroicons/react/outline";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <div className="bg-[#fff] z-40 flex justify-between p-2 items-center min-w-full fixed top-0">
      <img
        src="https://upload.wikimedia.org/wikipedia/en/thumb/5/58/Reddit_logo_new.svg/2560px-Reddit_logo_new.svg.png"
        className="object-contain h-10 ml-2 cursor-pointer"
      />
      <div className="w-[400px] justify-between hidden md:flex items-center space-x-4 ml-10  cursor-pointer">
        <div className="flex flex-grow-[2]  justify-between">
          <div className="flex space-x-2">
            <HomeIcon className="h-6 w-6 text-black" />
            <p className="font-semibold ml-1">Home</p>
          </div>
          <ChevronDownIcon className="h-6 w-6" />
        </div>
        <div className="flex flex-grow-[1] items-center hover:border-blue-500 hover:border-[1px] space-x-1.5 border-0 border-gray-700 py-1 px-2 rounded-md bg-gray-200">
          <SearchIcon className="h-5 w-5 text-gray-600" />
          <input
            type="text"
            placeholder="Search Reddit"
            className="bg-transparent text-sm font-light outline-none"
          />
        </div>
      </div>
      {/* Icons of right side */}
      <div className=" h-max ml-5 space-x-4 hidden lg:flex">
        <TrendingUpIcon className="icon" />
        <ChartSquareBarIcon className="icon" />
        <VideoCameraIcon className="icon" />
        <div className="h-[30px] w-[0.2px] bg-gray-600" />
        <ChatIcon className="icon" />
        <BellIcon className="icon" />
        <PlusSmIcon className="icon" />
        <SpeakerphoneIcon className="icon" />
      </div>
      <div
        className="flex ml-4 space-x-1  cursor-pointer group"
        onClick={() => signOut()}
      >
        <div className="border border-gray-600 rounded-full flex overflow-hidden h-[30px] w-[30px]">
          <Image
            src={`https://avatars.dicebear.com/api/open-peeps/${session.user?.name}.svg`}
            height={30}
            width={30}
            className=""
          />
        </div>

        <div className="hidden sm:flex justify-center flex-col ">
          <h4 className="text-[16px] font-medium">{session.user.tag}</h4>
          <span className="text-[12px] group-hover:text-green-600 group-hover:underline  text-gray-700">
            1 karma
          </span>
        </div>
        <ChevronDownIcon className="icon !border-0 !h-6 !w-6 ml-4" />
      </div>
    </div>
  );
};

export default Navbar;
