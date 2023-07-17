import "./home.css";
import { Link, useLoaderData } from "react-router-dom";
import { getPosts } from "../../api/posts";

export async function loader({ request }) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  try {
    const posts = await getPosts(category, 5);
    return posts;
  } catch (err) {
    console.log(err);
    return [];
  }
}

const Home = () => {
  const posts = useLoaderData();
  return (
    <section className="home">
      <div className="home__posts">
        {posts.map((post) => (
          <Link key={post.id} className="home__post-link" to={`/posts/${post.id}`}>
            <article className="home__post">
              <div className="home__post__thumbnail">
                <img src={post.imageURL} alt={post.imageURL} />
              </div>
              <div className="home__post__text">
                <h1 className="home__post__title">{post.title}</h1>
                <p className="home__post__content">{post.sanitizedContent}</p>
                <div className="home__post__meta">
                  <div className="home__post__author">{post.author}</div>
                  <p className="home__post__timestamp">{post.createdAt}</p>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Home;
