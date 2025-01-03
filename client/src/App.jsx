import HomePage from "./routes/homePage/homePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ListPage from "./routes/listPage/listPage";
import  { Layout,RequireAuth } from "./routes/layout/layout";
import SinglePage from "./routes/singlePage/SinglePage";
import ProfilePage from "./routes/profilePage/profilePage";

import Login from "./routes/login/login";
import Register from "./routes/register/Register";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";
import NewPostPage from "./routes/newPostPage/newPostPage";
import { listPageLoader, profilePageLoader, singlePageLoader } from "./lib/loaders";
import UpdatePostPage from "./routes/updatePost/updatePost";
import ForgotPassword from "./routes/login/ForgotPassword";
import ResetPassword from "./routes/login/ResetPassword";
import AdminPage from "./routes/admin/adminPage";
import EditUserPage from "./routes/admin/EditUserPage";
import AdminEditPost from "./routes/admin/adminEditPost";
//import UserStatusAdmin from "./routes/admin/userStatusAdmin";
import SingleUser from "./routes/quanly/quanly";
import DailyFull from "./routes/daily/daily";
import AdminUserPage from "./routes/admin/adminPageUser";
import AdminPostPage from "./routes/admin/adminPagePost";
import AdminProfilePage from "./routes/admin/adminPageProfile";
import Rules from "./routes/rule/Rule";
import AdminPageDashBoard from "./routes/admin/adminPageDashBoard";
//import UserStatusAdmin from "./routes/admin/userStatusadmin";





function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },

        {
          path: "/list",
          element: <ListPage />,
          loader: listPageLoader
        },
        
        {
          path: "/rule",
          element: <Rules />,
        },
        
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "/reset-password",
          element: <ResetPassword />,
        },
        {
          path: "/manage",
          element: <DailyFull />,
        },
      ],
    },
    
    {
      path: "/",
      element: <RequireAuth />,
      children:[
        {
          path: "/:id",
          element: <SinglePage />,
          loader: singlePageLoader,
        },
        {
          path: "/profile",
          element: <ProfilePage />,
          loader: profilePageLoader,
        },
        {
          path: "/user/:id",
          element: < SingleUser />,
          
        },
        {
          path: "/profile/update",
          element: <ProfileUpdatePage />,
        },
        {
          path: "/add",
          element: <NewPostPage />,
        },
        
        {
          path: "/profile/edit/:id", 
          element: <UpdatePostPage />,
        },
        {
          path: "/profile/admin", 
          element: <AdminPage />,
        },
        {
          path: "/profile/admin/update/:id", 
          element: <EditUserPage />,
        },
        {
          path: "/profile/admin/post/edit/:id", 
          element: <AdminEditPost />,
        },
        
        {
          path: "/profile/admin/user", 
          element: <AdminUserPage />,
        },
        {
          path: "/profile/admin/post", 
          element: <AdminPostPage />,
        },
        {
          path: "/profile/admin/profile", 
          element: <AdminProfilePage />,
        },
        {
          path: "/profile/admin/dashboard", 
          element: <AdminPageDashBoard />,
        },
      ]
    },
    
  ]);

  return <RouterProvider router={router} />;
}

export default App;
