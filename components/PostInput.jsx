import React, { useRef, useState } from "react";
import { LinkIcon, PhotographIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { XIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

const PostInput = () => {
  const { data: session } = useSession();
  const filePickerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setloading] = useState(false);

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  const addPost = async (e) => {
    e.preventDefault();
    if (loading) return;
    setloading(true);
    const docRef = await addDoc(collection(db, "posts"), {
      id: session.user.uid,
      username: session.user.name,
      userImg: session.user.image,
      tag: session.user.tag,
      text: input,
      timestamp: serverTimestamp(),
    }).catch((error) => console.log(error.message));
    const imageRef = ref(storage, `posts/${docRef.id}/image`);
    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url")
        .then(async () => {
          const downloadUrl = await getDownloadURL(imageRef);
          await updateDoc(doc(db, "posts", docRef.id), {
            image: downloadUrl,
          });
        })
        .catch((error) => console.log(error.message));
    }
    setloading(false);
    setInput("");
    setSelectedFile(null);
  };

  return (
    <div className="h-max">
      <div
        className={`flex p-2  items-center space-x-2 bg-white rounded-sm shadow-xl ${
          loading && "opacity-60"
        }`}
      >
        <div className="border border-gray-600 cursor-pointer hover:bg-gray-100 rounded-full  overflow-hidden flex  h-[35px] w-[35px]">
          <Image
            src={`https://avatars.dicebear.com/api/open-peeps/${session.user?.name}.svg`}
            height={35}
            width={35}
            className=""
          />
        </div>
        <form className="flex-1 flex" onSubmit={(e) => addPost(e)}>
          <div className="bg-gray-100 flex-1  outline-none  border hover:border-blue-400 rounded-sm">
            <input
              className="w-[100%] bg-transparent p-2 outline-none border-1 focus:border-blue-500"
              placeholder="Create Post"
              value={input}
              onSubmit={(e) => addPost(e)}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          {!loading && (
            <div className="flex items-center space-x-2">
              <div>
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
              <LinkIcon className="icon !text-gray-600 !rounded-sm !border-none" />
            </div>
          )}
        </form>
      </div>
      {selectedFile && (
        <div className="relative">
          <div
            className={`absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer ${
              loading && "opacity-60"
            }`}
            onClick={() => setSelectedFile(null)}
          >
            <XIcon className="text-white h-5" />
          </div>
          <img src={selectedFile} alt="" className={loading && "opacity-60"} />
        </div>
      )}
    </div>
  );
};

export default PostInput;
