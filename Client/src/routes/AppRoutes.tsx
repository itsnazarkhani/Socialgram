import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import NotFound from "../pages/error/NotFound";
import ExplorePage from "../pages/home/ExplorePage";
import HomePage from "../pages/home/HomePage";
import NewPostPage from "../pages/post/NewPostPage";
import PostPage from "../pages/post/PostPage";
import EditProfilePage from "../pages/user/EditProfilePage";
import ProfilePage from "../pages/user/ProfilePage";
import UserPage from "../pages/user/UserPage";
import { Suspense } from "react";
import MainLayout from "../layouts/MainLayout/MainLayout";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import ErrorLayout from "../layouts/ErrorLayout/ErrorLayout";
import ProtectedRoute from "../components/features/auth/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Suspense fallback={<p>درحال بارگذاری...</p>}>
      <Routes>
        <Route path="auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="explore"
            element={
              <ProtectedRoute>
                <ExplorePage />
              </ProtectedRoute>
            }
          />

          <Route path="profile">
            <Route
              index
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="edit"
              element={
                <ProtectedRoute>
                  <EditProfilePage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            path="/user/:id"
            element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route path="post">
            <Route
              path="new"
              element={
                <ProtectedRoute>
                  <NewPostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path=":id"
              element={
                <ProtectedRoute>
                  <PostPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>

        <Route element={<ErrorLayout />}>
          <Route path="/*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
