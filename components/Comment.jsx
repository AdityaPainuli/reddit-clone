import Moment from "react-moment";
import Image from "next/image";

const Comment = ({ commentData }) => {
  return (
    <div className="mt-4 bg-white rounded-md shadow-md p-2">
      <div className="flex items-center">
        <div className="border border-gray-600 rounded-full flex overflow-hidden h-[30px] w-[30px]">
          <Image
            src={`https://avatars.dicebear.com/api/open-peeps/${commentData?.username}.svg`}
            height={30}
            width={30}
            className=""
          />
        </div>
        <div className="flex items-center space-x-2 ml-3 cursor-default">
          <p className="font-semibold">{commentData?.username}</p>
          <span className="hover:underline text-sm sm:text-[15px]">
            (<Moment fromNow>{commentData?.timestamp?.toDate()}</Moment>)
          </span>
        </div>
      </div>
      <div className="w-[95%] m-auto">
        <p className=" mt-2 text-[17px]">{commentData?.comment}</p>
        {commentData?.image && (
          <img
            src={commentData?.image}
            className="object-fit h-[400px] m-auto my-2"
          />
        )}
      </div>
    </div>
  );
};

export default Comment;
