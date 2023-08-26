import axios from "axios";

const changeNaming = (before) => {
  return before.map((post) => ({
    id: post.id,
    title: post.title,
    sanitizedContent: post.sanitized_content,
    rowContent: post.row_content,
    imageURL: post.image_url,
    category: post.category,
    createdAt: new Intl.DateTimeFormat("ko-KR").format(
      new Date(Date.parse(post.created_at))
    ),
    author: post.author,
  }));
};
export const getPosts = async (category, count) => {
  try {
    const baseURL = "/api/posts";
    let requestURL = baseURL;
    const params = new URLSearchParams();

    if (
      category &&
      ["art", "science", "technology", "food"].includes(category)
    ) {
      params.append("category", category);
    }
    if (count) {
      params.append("count", count);
    }
    if (params.toString()) {
      requestURL += `?${params.toString()}`;
    }
    const result = await axios.get(requestURL);
    return changeNaming(result.data);
  } catch (err) {
    throw err;
  }
};
export const getPost = async (id) => {
  try {
    const result = await axios.get(`/api/posts/${id}`);
    return changeNaming(result.data)[0];
  } catch (err) {
    throw err;
  }
};
export const addPost = async (data, axiosInstance) => {
  try {
    const result = await axiosInstance.post("/api/posts", data);
    return result.data.id;
  } catch (err) {
    throw err;
  }
};
export const deletePost = async (id, axiosInstance) => {
  try {
    await axiosInstance.delete(`/api/posts/${id}`);
  } catch (err) {
    throw err;
  }
};
export const updatePost = async (id, data, axiosInstance) => {
  try {
    console.log(data);
    await axiosInstance.patch(`/api/posts/${id}`, data);
  } catch (err) {
    throw err;
  }
};
