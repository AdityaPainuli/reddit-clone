import React, { useState, useEffect, Fragment, useRef } from "react";
import { useSession } from "next-auth/react";
import Moment from "react-moment";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import {
  onSnapshot,
  doc,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";

const CommentInput = ({ postId }) => {
  const { data: session } = useSession();
  const [commentInput, setCommentInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null);
  const [comment, setComment] = useState("");

  const sendComment = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const docRef = await addDoc(collection(db, "posts", postId, "comments"), {
      comment: comment,
      username: session.user.name,
      tag: session.user.tag,
      userImg: session.user.image,
      timestamp: serverTimestamp(),
    });
    const ImageRef = ref(storage, `comments/${docRef.id}/image`);
    if (selectedFile) {
      await uploadString(ImageRef, selectedFile, "data_url").then(async () => {
        {
          const downloadUrl = await getDownloadURL(ImageRef);
          await updateDoc(doc(db, "posts", postId, "comments", docRef.id), {
            image: downloadUrl,
          });
        }
      });
    }
    setLoading(false);
    setSelectedFile(null);
    setComment("");
  };
  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };
  return (
    <div className="w-full p-2 rounded-md shadow-md mt-2 bg-white">
      <div>
        <p className="font-semibold cursor-pointer">
          Comment as{" "}
          <span className="text-red-500 hover:underline">{comment?.tag}</span>
        </p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What are your Thoughts?"
          rows="2"
          className="bg-transparent p-2 capitalize w-[96%] m-auto flex items-center border mt-2 border-gray-500 rounded-md outline-none"
        />
        {selectedFile && (
          <div className="relative ">
            <div
              className={`absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer ${
                loading && "opacity-60"
              }`}
              onClick={() => setSelectedFile(null)}
            >
              <XIcon className="text-white h-5" />
            </div>
            <img
              src={selectedFile}
              alt=""
              className={`${loading && "opacity-60"} object-fit w-[250px]`}
            />
          </div>
        )}
        <div className="w-full flex  items-center justify-between pr-6">
          <div>
            <div className="ml-4">
              <PhotographIcon
                className="icon !text-gray-600 !rounded-sm !border-none"
                onClick={() => filePickerRef.current.click()}
              />
              <input
                type="file"
                ref={filePickerRef}
                hidden
                onChange={addImageToPost}
              />
            </div>
          </div>
          <button
            className="bg-red-500 w-[100px]  cursor-pointer hover:bg-red-400 p-2 rounded-md text-white mt-2"
            onClick={sendComment}
            disabled={!comment.trim()}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentInput;
