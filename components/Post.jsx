import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChatAltIcon,
  DotsVerticalIcon,
  GiftIcon,
  ShareIcon,
} from "@heroicons/react/outline";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { DotsHorizontalIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Moment from "react-moment";
import { db } from "../firebase";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../atoms/modalAtom";

const Post = ({ id, post, postPage }) => {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const router = useRouter();
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);

  // Finding how many peoples commented on the post.
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [db, id]
  );

  // Finding how many peoples liked the posts.
  useEffect(
    () =>
      onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
        setLikes(snapshot.docs)
      ),
    [db, id]
  );
  // finding how if the current logged user liked the post or not.
  useEffect(
    () =>
      setLiked(
        likes.findIndex((like) => like.id === session?.user?.uid) !== -1
      ),
    [likes]
  );

  const likeToPost = async () => {
    if (liked) {
      await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
        username: session.user.name,
      });
    }
  };

  return (
    <div className="w-full">
      <div
        className={`flex flex-col-reverse md:flex-row my-4 shadow-lg group ${
          postPage && "w-full"
        }`}
        onClick={() => router.push(`/${id}`)}
      >
        <div className="bg-gray-100 p-2 rounded-l-md flex group-hover:bg-gray-200 md:flex-col items-center">
          <ArrowUpIcon
            className={`menu-items !h-7 ${liked && "!text-blue-600"}`}
            onClick={(e) => {
              likeToPost();
            }}
          />
          <span className="font-semibold  ">{likes.length}</span>
          <ArrowDownIcon
            className={`menu-items !h-7 ${!liked && "!text-red-600 "}`}
            onClick={(e) => {
              likeToPost();
            }}
          />
        </div>
        <div className="flex flex-grow flex-col bg-white rounded-r-md p-2 group-hover:bg-gray-100">
          <div className="flex items-center h-[20px]">
            <div className="border border-gray-600 rounded-full flex overflow-hidden h-[30px] w-[30px]">
              <Image
                src={`https://avatars.dicebear.com/api/open-peeps/${post?.username}.svg`}
                height={30}
                width={30}
                className=""
              />
            </div>

            <p className="ml-2 text-md font-semibold">{post?.tag}</p>
            <span className="text-gray-600 ml-2 text-sm mt-1">
              Posted on <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
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
            {!postPage && (
              <div
                className="flex items-center hover:bg-gray-300 p-1 rounded-md cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  setPostId(id);
                  setIsOpen(true);
                }}
              >
                <ChatAltIcon className="menu-items !h-8 group-hover:text-blue-400 hover:bg-transparent " />
                <span>Comments</span>
              </div>
            )}
            <div className="items-center hidden md:flex hover:bg-gray-300 p-1 rounded-md cursor-pointer group">
              <GiftIcon className="menu-items  !h-8 group-hover:text-blue-400 hover:bg-transparent " />
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
      {/* {postPage && (
        <form>
          <input
            type="text"
            className="bg-gray-100 mt-4 shadow-sm w-full rounded-md outline-none p-2 "
            placeholder="Post your comment"
          />
        </form>
      )} */}
    </div>
  );
};

export default Post;
