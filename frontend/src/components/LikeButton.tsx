import React, {useEffect, useState} from "react";

interface LikeButtonProps {
    postId: number | undefined;
}

const mockApi = {
    get: async (postId: number): Promise<{ likes: number }> => {
        const likes = localStorage.getItem(`likes_${postId}`);
        return {likes: likes ? parseInt(likes, 10) : 0};
    },
    post: async (postId: number, action: 'like' | 'unlike'): Promise<{ likes: number }> => {
        const currentLikes = await mockApi.get(postId);
        const newLikes = action === 'like' ? currentLikes.likes + 1 : Math.max(currentLikes.likes - 1, 0);
        localStorage.setItem(`likes_${postId}`, newLikes.toString());
        return {likes: newLikes};
    }
};

const LikeButton: React.FC<LikeButtonProps> = ({postId}) => {
    const [likes, setLikes] = useState<number>(0);
    const [isLiked, setIsLiked] = useState<boolean>(false);

    useEffect(() => {
        fetchLikes();
        const liked = localStorage.getItem(`liked_${postId}`);
        setIsLiked(!!liked);
    }, [postId]);

    const fetchLikes = async () => {
        if (postId === undefined) return;
        try {
            const response = await mockApi.get(postId);
            setLikes(response.likes);
        } catch (error) {
            console.error('Error fetching likes: error');
        }
    };

    const handleLike = async (): Promise<void> => {
        if (postId === undefined) return;

        try {
            if (isLiked) {
                const response = await mockApi.post(postId, 'unlike');
                setLikes(response.likes);
                setIsLiked(false);
                localStorage.removeItem(`liked_${postId}`);
            } else {
                const response = await mockApi.post(postId, 'like');
                setLikes(response.likes);
                setIsLiked(true);
                localStorage.setItem(`liked_${postId}`, 'true');
            }
        } catch (error) {
            console.error('Error updating like status:', error);
        }
    };

    return (
        <div>
            <button onClick={handleLike}>
                {isLiked ? 'Unlike' : 'Like'} ({likes})
            </button>
        </div>
    );
};

export default LikeButton;