import React, {useEffect, useState} from "react";
import axios from 'axios';

interface LikeButtonProps {
    postId: number | undefined;
}

const LikeButton: React.FC<LikeButtonProps> = ({postId}) => {
    const [likes, setLikes] = useState<number>(0);
    const [isLiked, setIsLiked] = useState<boolean>(false);

    useEffect(() => {
        fetchLikes();
        const liked = localStorage.getItem(`liked_${postId}`);
        setIsLiked(!!liked);
    }, [postId]);

    const fetchLikes = async () => {
        try {
            const response = await axios.get<{ likes: number }>(`/api/likes/${postId}`);
            setLikes(response.data.likes);
        } catch (error) {
            console.error('Error fetching likes: error');
        }
    };

    const handleLike = async (): Promise<void> => {
        if (isLiked) {
            try {
                await axios.post(`/api/likes/${postId}/unlike`);
                setLikes(likes - 1);
                setIsLiked(false);
                localStorage.removeItem(`liked_${postId}`);
            } catch (error) {
                console.error('Error unliking post:', error);
            }
        } else {
            try {
                await axios.post(`/api/likes/${postId}/like`);
                setLikes(likes + 1);
                setIsLiked(true);
                localStorage.setItem(`liked_${postId}`, 'true');
            } catch (error) {
                console.error('Error liking post:', error);
            }
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