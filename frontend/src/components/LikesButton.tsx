import React from "react";
import { useLikes } from "../hooks/useLikes";

interface LikesButtonProps {
  postId: string;
}

const LikesButton: React.FC<LikesButtonProps> = ({ postId }) => {
  const { data, isLoading, error } = useLikes(postId);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <p>Likes: {data?.likes}</p>
      <button disabled>👍 Like</button>
    </div>
  );
};

export default LikesButton;
