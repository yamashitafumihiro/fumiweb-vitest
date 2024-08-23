import React, {useEffect, useState} from "react";
import axios from 'axios';

interface LikeButtonProps {
    postId: number | undefined;
}

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

const LikeButton: React.FC<LikeButtonProps> = ({postId}) => {
    const [likes, setLikes] = useState<number>(0);
    const [isLiked, setIsLiked] = useState<boolean>(false);

    useEffect(() => {
        if (postId !== undefined) {
            fetchLikes();
            const liked = localStorage.getItem(`liked_${postId}`);
            setIsLiked(!!liked);
        }
    }, [postId]);

    const fetchLikes = async () => {
        if (postId === undefined) return;
        try {
            console.log('Fetching likes for postId:', postId);
            const response = await axios.get(`${API_ENDPOINT}/likes/${postId}`);
            console.log('Received response:', response);
            if (response.data && typeof response.data === 'object') {
                if ('body' in response.data) {
                    // API Gatewayがレスポンスをラップしている場合
                    const bodyData = JSON.parse(response.data.body);
                    if (typeof bodyData.likes === 'number') {
                        setLikes(bodyData.likes);
                    } else {
                        console.error('Unexpected likes value:', bodyData.likes);
                    }
                } else if (typeof response.data.likes === 'number') {
                    // Lambda関数が直接likesを返している場合
                    setLikes(response.data.likes);
                } else {
                    console.error('Unexpected response structure:', response.data);
                }
            } else {
                console.error('Unexpected response type:', typeof response.data);
            }
        } catch (error) {
            console.error('Error fetching likes:', error);
        }
    };

    const handleLike = async (): Promise<void> => {
        if (postId === undefined) return;

        try {
            const action = isLiked ? 'unlike' : 'like';
            const response = await axios.post(`${API_ENDPOINT}/likes/${postId}`, {action});
            console.log('Like/Unlike response:', response);
            if (response.data && typeof response.data.likes === 'number') {
                setLikes(response.data.likes);
                setIsLiked(!isLiked);
                if (isLiked) {
                    localStorage.removeItem(`liked_${postId}`);
                } else {
                    localStorage.setItem(`liked_${postId}`, 'true');
                }
            } else {
                console.error('Unexpected response structure:', response.data);
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