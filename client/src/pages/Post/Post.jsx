import { Link, useLoaderData, useNavigate } from "react-router-dom";
import "./post.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { deletePost, getPost, getPosts } from "../../api/posts";

export async function loader({ params }) {
  const post = await getPost(params.id);
  const category = post.category;
  let relatedPosts = await getPosts(category, 9);
  relatedPosts = relatedPosts.filter((relatedpost) => String(relatedpost.id) !== String(post.id)).slice(0, 8);
  return { post, relatedPosts };
}

const Post = () => {
  const { post, relatedPosts } = useLoaderData();
  const { user, getMyAxiosInstance } = useContext(AuthContext);
  const navigate = useNavigate();
  const deleteHandler = async (event) => {
    event.preventDefault();
    try {
      await deletePost(post.id, getMyAxiosInstance());
      navigate("/");
      return;
    } catch (err) {
      console.error(err);
      return;
    }
  };

  return (
    <section className="post">
      <article className="post__target">
        <h1 className="post__target__title">{post.title}</h1>
        <div className="post__target__author">
          <p className="post__target__author-name">myname</p>
          {user?.username === post.author && (
            <div className="post__target__btns">
              <button className="post__target__btn post__target__btn_edit" onClick={() => navigate("/write", { state: post })}>
                <BiEdit />
              </button>
              <button className="post__target__btn post__target__btn_delete" onClick={deleteHandler}>
                <AiFillDelete />
              </button>
            </div>
          )}
        </div>
        <div className="post__target__img">
          <img src={post.imageURL} alt={post.imageURL} />
        </div>
        <p className="post__target__content" dangerouslySetInnerHTML={{ __html: post.rowContent }}></p>
      </article>
      <aside className="post__related-posts">
        {relatedPosts.map((post) => (
          <Link to={`/posts/${post.id}`}>
            <div className="post__related-post">
              <div className="post__related-post__img">
                <img src={post.imageURL} alt={post.imageURL} />
              </div>
              <h3 className="post__related-post__title">{post.title}</h3>
            </div>
          </Link>
        ))}
      </aside>
    </section>
  );
};

export default Post;
