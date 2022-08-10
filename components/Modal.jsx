import { useSession } from "next-auth/react";
import React, { useState, useEffect, Fragment, useRef } from "react";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../atoms/modalAtom";
import { useRouter } from "next/router";
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
import { Dialog, Transition } from "@headlessui/react";
import Moment from "react-moment";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

const Modal = () => {
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const { data: session } = useSession();
  const [post, setPost] = useState();
  const [comment, setComment] = useState("");
  const filePickerRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(
    () =>
      onSnapshot(doc(db, "posts", postId), (snapshot) => {
        setPost(snapshot.data());
      }),
    [db]
  );

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
    setIsOpen(false);
    setComment("");
    router.push(`${postId}`);
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
    <div>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-10 z-50  flex items-center justify-center p-4 "
          onClose={setIsOpen}
        >
          <div className="flex min-h-full items-center justify-center h-max sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-[#5b7083] bg-opacity-40 transition-opacity" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-2xl text-left  shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
                {/* <div className="flex items-center px-1.5 py-2 border-b border-gray-700">
                  <div
                    className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
                    onClick={() => setIsOpen(false)}
                  >
                    <XIcon className="h-[22px] text-gray-600" />
                  </div>
                </div> */}
                <div className="flex px-4 pt-5 pb-2.5 sm:px-6">
                  <div className="w-full">
                    <div className="text-[#6e767d] flex gap-x-3 relative">
                      <span className="w-0.5 h-full z-[-1] absolute left-5 top-11 bg-gray-600" />
                      <img
                        src={`https://avatars.dicebear.com/api/open-peeps/${post?.username}.svg`}
                        alt=""
                        className="h-11 w-11 rounded-full"
                      />
                      <div>
                        <div className="inline-block group">
                          <h4 className="font-bold text-black inline-block text-[15px] sm:text-base">
                            {post?.username}
                          </h4>
                          <span className="ml-1.5 text-sm sm:text-[15px]">
                            @{post?.tag}{" "}
                          </span>
                        </div>{" "}
                        ·{" "}
                        <span className="hover:underline text-sm sm:text-[15px]">
                          <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
                        </span>
                        <p className="text-black mb-4 text-[15px] sm:text-base">
                          {post?.text}
                        </p>
                        <img
                          src={post?.image}
                          className="h-[250px] object-fit m-auto"
                        />
                      </div>
                    </div>

                    <div className="mt-7 flex space-x-3 w-full">
                      <img
                        src={`https://avatars.dicebear.com/api/open-peeps/${session.user?.name}.svg`}
                        alt=""
                        className="h-11 w-11 rounded-full"
                      />
                      <div className="flex-grow mt-2">
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="What are your thoughts?"
                          rows="2"
                          className="bg-transparent outline-none text-black text-lg placeholder-gray-500 tracking-wide w-full min-h-[80px]"
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
                              className={`${
                                loading && "opacity-60"
                              } object-fit w-[250px]`}
                            />
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-2.5 ">
                          <div className="flex items-center space-x-4">
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
                            <div className="icon rotate-90">
                              <ChartBarIcon className="icons hover:text-red-500" />
                            </div>

                            <div className="icon">
                              <EmojiHappyIcon className="icons hover:text-red-500" />
                            </div>

                            <div className="icon">
                              <CalendarIcon className="icons hover:text-red-500" />
                            </div>
                          </div>
                          <button
                            className="bg-red-500 text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
                            type="submit"
                            onClick={sendComment}
                            disabled={!comment.trim()}
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default Modal;
