import { useNavigate } from "react-router-dom";
import BlobImage from "../../ui/Image/BlobImage";
import type { PostWithMediaBlob } from "../../../interfaces/userInterfaces";

type PostsGridPorps = {
    posts: PostWithMediaBlob[];
}

const PostsGrid = ({ posts }: PostsGridPorps) => {
    const navigate = useNavigate();

    return (
        <div className="posts-grid">
            {posts.map((post) => {
                if (!post.mediaBlob) return null;

                return (
                    <div
                        key={post.id}
                        className="post-item"
                        onClick={() => navigate(`/post/${post.id}`)}>
                        <BlobImage
                            blob={post.mediaBlob}
                            alt={`post-${post.id}`}
                            className="post-image"
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default PostsGrid;