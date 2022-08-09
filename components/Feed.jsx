import React from "react";
import PostInput from "../components/PostInput";
import Options from "../components/Options";
import Posts from "../components/Posts";

const Feed = () => {
  return (
    <div className="lg:min-w-[70%] w-[100%] relative">
      <PostInput />
      <Options />
      <Posts />
    </div>
  );
};

export default Feed;
