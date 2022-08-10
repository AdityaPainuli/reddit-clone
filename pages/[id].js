import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "@firebase/firestore";
import { getProviders, getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import { db } from "../firebase";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import Comment from "../components/Comment";
import CommentInput from "../components/CommentInput";
import Head from "next/head";

const PagePost = ({ providers }) => {
  const { data: session } = useSession();
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);
  const [isOpen, setIsOpen] = useState(modalState);
  const router = useRouter();
  const { id } = router.query;
  if (!session) return <Login providers={providers} />;
  useEffect(
    () =>
      onSnapshot(doc(db, "posts", id), (snapshot) => {
        setPost(snapshot.data());
      }),
    [db]
  );
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
  return (
    <div>
      <Head>
        <title>
          {post?.username} on Reddit : "{post?.text}"
        </title>
        <link
          rel="icon"
          href="https://www.iconpacks.net/icons/2/free-reddit-logo-icon-2436-thumb.png"
        />
      </Head>
      <Navbar />
      <main className=" md:max-w-[80%] max-w-[90%] space-x-3 h-max m-auto mt-24">
        <Post id={id} post={post} postPage />
        {comments.length > 0 && (
          <div className="pb-72">
            <CommentInput postId={id} />
            {comments.map((comment) => (
              <Comment
                key={comment.id}
                id={comment.id}
                commentData={comment.data()}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
export async function getServerSideProps(context) {
  const providers = await getProviders();
  const session = await getSession(context);
  return {
    props: {
      providers,
      session,
    },
  };
}
export default PagePost;
