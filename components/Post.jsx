import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChatAltIcon,
  DotsVerticalIcon,
  GiftIcon,
  ShareIcon,
} from "@heroicons/react/outline";
import React from "react";
import Image from "next/image";
import { DotsHorizontalIcon } from "@heroicons/react/solid";
const Post = ({ id, post, postPage }) => {
  const time = new Date(post.timestamp * 1000);

  return (
    <div className="flex my-4 shadow-lg">
      <div className="bg-gray-100 p-2 rounded-l-md flex flex-col items-center">
        <ArrowUpIcon className="menu-items !h-7" />
        <span className="font-semibold  ">10</span>
        <ArrowDownIcon className="menu-items !h-7" />
      </div>
      <div className="flex flex-grow flex-col bg-white rounded-r-md p-2">
        <div className="flex items-center h-[20px]">
          <div className="border border-gray-600 rounded-full flex overflow-hidden h-[30px] w-[30px]">
            <Image
              src={`https://avatars.dicebear.com/api/open-peeps/${post.username}.svg`}
              height={30}
              width={30}
              className=""
            />
          </div>

          <p className="ml-2 text-md font-semibold">{post.tag}</p>
          <span className="text-gray-600 ml-2 text-sm mt-1">
            Posted on{" "}
            {new Date(post.timestamp?.seconds * 1000).toLocaleTimeString({
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="mt-2 mb-4">
          <p className="font-semibold text-lg pl-4">{post?.text}</p>
        </div>
        <Image
          src={post?.image}
          height={400}
          width={400}
          className="object-contain "
        />
        <div className="flex mb-2 mt-4 space-x-2">
          <div className="flex items-center hover:bg-gray-300 p-1 rounded-md cursor-pointer group">
            <ChatAltIcon className="menu-items !h-8 group-hover:text-blue-400 hover:bg-transparent " />
            <span>Comments</span>
          </div>
          <div className="flex items-center hover:bg-gray-300 p-1 rounded-md cursor-pointer group">
            <GiftIcon className="menu-items !h-8 group-hover:text-blue-400 hover:bg-transparent " />
            <span>Awards</span>
          </div>
          <div className="flex items-center hover:bg-gray-300 p-1 rounded-md cursor-pointer group">
            <ShareIcon className="menu-items !h-8 group-hover:text-blue-400 hover:bg-transparent " />
            <span>Share</span>
          </div>
          <div className="flex items-center hover:bg-gray-300 p-1 rounded-md cursor-pointer group">
            <DotsHorizontalIcon className="menu-items !h-8 group-hover:text-blue-400 hover:bg-transparent " />
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
