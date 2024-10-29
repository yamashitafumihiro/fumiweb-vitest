import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Box, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { useLikes } from "../hooks/useLikes";

interface LikesButtonProps {
  postId: string;
}

const LikesButton: React.FC<LikesButtonProps> = ({ postId }) => {
  const { data, isLoading, error } = useLikes(postId);
  const queryClient = useQueryClient();
  const [hasLiked, setHasLiked] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    const storedLikeStatus = localStorage.getItem(`hasLiked_${postId}`);
    if (storedLikeStatus === "true") {
        setHasLiked(true);
    }
  }, [postId]);

  const mutation = useMutation({
    mutationFn: async () => {
        const action = hasLiked ? "dec" : "inc";
        const url = `/?post_id=${postId}&action=${action}`;
        return await axiosInstance.post(url);
    },
    onMutate: () => {
        setIsMutating(true);
    },
    onSuccess: () => {
        setIsMutating(false);
        const newHasLiked = !hasLiked;
        setHasLiked(newHasLiked);
        localStorage.setItem(`hasLiked_${postId}`, newHasLiked.toString());
        queryClient.invalidateQueries({
            queryKey: ["likes", postId],
        });
    },
    onError: () => {
        setIsMutating(false);
        alert("いいねの送信に失敗しました。");
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const likeCount = data?.likes ?? 0;

  return (
    <Box alignItems="center">
      <Button
        variant="contained"
        onClick={() => mutation.mutate()}
        disabled={isMutating}
        sx={{ width: 100, height: 64, justifyContent: 'center', alignItems: 'center' }}
      >
        {isMutating ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          <Box display="flex" alignItems="center" gap={1}>
            <span
              role="img"
              aria-label={hasLiked ? "liked" : "not liked"}
              style={{ fontSize: "24px", filter: hasLiked ? "none" : "grayscale(100%)" }}
            >
              👍
            </span>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {likeCount}
            </Typography>
          </Box>
        )}
      </Button>
    </Box>
  );
};

export default LikesButton;
