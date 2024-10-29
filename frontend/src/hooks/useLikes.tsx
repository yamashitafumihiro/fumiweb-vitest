import axiosInstance from "../api/axiosInstance";
import { useQuery } from '@tanstack/react-query';

interface LikeData {
    post_id: string;
    likes: number;
}

const fetchLikes = async (postId: string): Promise<LikeData> => {
    const response = await axiosInstance.get<LikeData>("", {
      params: { post_id: postId },
    });
    return response.data;
};
  
export const useLikes = (postId: string) => {
    const { data, error, isLoading } = useQuery<LikeData, Error>({
      queryKey: ["likes", postId],
      queryFn: () => fetchLikes(postId),
      staleTime: 1000 * 60,
      refetchOnWindowFocus: true,
    });
  
    return {
      data,
      error,
      isLoading,
    };
};