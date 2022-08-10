import Head from "next/head";
import Navbar from "../components/Navbar";
import Feed from "../components/Feed";
import Sidebar from "../components/Sidebar";
import {
  getProviders,
  getSession,
  SessionProviderProps,
  useSession,
} from "next-auth/react";
import Login from "../components/Login";
import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";
import Modal from "../components/Modal";

const Home = ({ providers }) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  if (!session) {
    return <Login providers={providers} />;
  }
  return (
    <div className="">
      <Head>
        <title>Reddit / Dive into anything.</title>
        <link
          rel="icon"
          href="https://www.iconpacks.net/icons/2/free-reddit-logo-icon-2436-thumb.png"
        />
      </Head>
      {/* Navbar */}
      <Navbar />
      <main className="flex md:max-w-[80%] max-w-[90%] space-x-3 h-max m-auto mt-24">
        {/* Main-feed */}
        <Feed />
        {/* Sidebar */}
        <Sidebar />
        {isOpen && <Modal />}
      </main>
    </div>
  );
};

export async function getServerSideProps(context) {
  // const trendingResults = await fetch("https://jsonkeeper.com/b/NKEV").then(
  //   (res) => res.json()
  // );
  // const followResults = await fetch("https://jsonkeeper.com/b/WWMJ").then(
  //   (res) => res.json()
  // );
  const providers = await getProviders();
  const session = await getSession(context);

  return {
    props: {
      providers,
      session,
    },
  };
}

export default Home;
