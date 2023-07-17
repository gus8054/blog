import { useLocation, useNavigate } from "react-router-dom";
import "./write.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { addPost, updatePost } from "../../api/posts";

const Write = () => {
  const post = useLocation().state;
  const { getMyAxiosInstance } = useContext(AuthContext);
  const [inputs, setInputs] = useState(
    post?.id ? { imageURL: post.imageURL, title: post.title, sanitizedContent: post.sanitizedContent, rowContent: post.rowContent, category: post.category } : { imageURL: "", title: "", sanitizedContent: "", rowContent: "", category: "art" }
  );
  const [error, setError] = useState();
  const imgRef = useRef();
  const titleRef = useRef();
  const contentRef = useRef();
  const categoryRef = useRef();
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setInputs({ ...inputs, [e.currentTarget.name]: e.currentTarget.value });
  };
  const quillChangeHandler = (content, delta, source, editor) => {
    setInputs({ ...inputs, rowContent: content, sanitizedContent: editor.getText() });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // 데이터 검증
    if (!inputs.imageURL.trim()) return imgRef.current.focus();
    if (!inputs.title.trim()) return titleRef.current.focus();
    if (!inputs.sanitizedContent.trim()) return contentRef.current.focus();
    if (!inputs.category.trim()) return categoryRef.current.focus();

    try {
      let id = null;
      if (post?.id) {
        await updatePost(post.id, inputs, getMyAxiosInstance());
        id = post.id;
      } else {
        id = await addPost(inputs, getMyAxiosInstance());
      }
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response.data.message);
    }
  };
  return (
    <section className="write">
      <form className="write__form" method="post" onSubmit={submitHandler}>
        <div className="write__column write__column_left">
          <label className="write__label" htmlFor="image">
            이미지 URL
          </label>
          <input ref={imgRef} value={inputs.imageURL} onChange={changeHandler} className="write__input" type="url" name="imageURL" required />
          <label className="write__label" htmlFor="title">
            Title
          </label>
          <input ref={titleRef} value={inputs.title} onChange={changeHandler} className="write__input" type="text" name="title" required />
          <label className="write__label" htmlFor="content">
            Content
          </label>
          <ReactQuill id="write__content" ref={contentRef} theme="snow" value={inputs.rowContent} onChange={quillChangeHandler} />
        </div>
        <div className="write__column write__column_right">
          <fieldset ref={categoryRef} className="write__fieldset">
            <legend className="write__fieldset__legend">Category</legend>
            <ul className="write__fieldset__category-lists">
              <li className="write__fieldset__category-list">
                <input checked={inputs.category === "art"} onChange={changeHandler} className="write__fieldset__category-input" type="radio" id="art" name="category" value="art" required />
                <label className="write__fieldset__category-label" htmlFor="art">
                  Art
                </label>
              </li>
              <li className="write__fieldset__category-list">
                <input checked={inputs.category === "science"} onChange={changeHandler} className="write__fieldset__category-input" type="radio" id="science" name="category" value="science" />
                <label className="write__fieldset__category-label" htmlFor="science">
                  Science
                </label>
              </li>
              <li className="write__fieldset__category-list">
                <input checked={inputs.category === "technology"} onChange={changeHandler} className="write__fieldset__category-input" type="radio" id="technology" name="category" value="technology" />
                <label className="write__fieldset__category-label" htmlFor="technology">
                  Technology
                </label>
              </li>
              <li className="write__fieldset__category-list">
                <input checked={inputs.category === "food"} onChange={changeHandler} className="write__fieldset__category-input" type="radio" id="food" name="category" value="food" />
                <label className="write__fieldset__category-label" htmlFor="food">
                  Food
                </label>
              </li>
            </ul>
          </fieldset>
          <div className="write__btns">
            <button className="write__btn write__btn_reset" type="reset">
              초기화
            </button>
            <button className="write__btn write__btn_submit" type="submit">
              저장
            </button>
          </div>
        </div>
      </form>
      <p className="write__error">{error}</p>
    </section>
  );
};

export default Write;
