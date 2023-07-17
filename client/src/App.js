import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./app.css";
import Layout from "./components/Layout/Layout";
import Home, { loader as homeLoader } from "./pages/Home/Home";
import Post, { loader as postLoader } from "./pages/Post/Post";
import Write from "./pages/Write/Write";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import AuthProvider from "./context/AuthProvider";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import UserDelete from "./pages/UserDelete/UserDelete";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home />, loader: homeLoader },
      {
        path: "/posts/:id",
        element: <Post />,
        loader: postLoader,
      },
      {
        path: "/write",
        element: (
          <RequireAuth>
            <Write />
          </RequireAuth>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/join",
    element: <Register />,
  },
  {
    path: "/withdraw",
    element: (
      <RequireAuth>
        <UserDelete />
      </RequireAuth>
    ),
  },
]);
function App() {
  return (
    <div className="app">
      <AuthProvider>
        <RouterProvider className="app" router={router} />
      </AuthProvider>
    </div>
  );
}

export default App;
