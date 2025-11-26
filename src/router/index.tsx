import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';

import P_home from '../pages/p-home';
import P_file_upload from '../pages/p-file_upload';
import P_reader from '../pages/p-reader';
import P_settings from '../pages/p-settings';
import P_history from '../pages/p-history';
import P_help from '../pages/p-help';
import P_profile from '../pages/p-profile';
import NotFoundPage from './NotFoundPage';
import ErrorPage from './ErrorPage';

function Listener() {
  const location = useLocation();
  useEffect(() => {
    const pageId = 'P-' + location.pathname.replace('/', '').toUpperCase();
    console.log('当前pageId:', pageId, ', pathname:', location.pathname, ', search:', location.search);
    if (typeof window === 'object' && window.parent && window.parent.postMessage) {
      window.parent.postMessage({
        type: 'chux-path-change',
        pageId: pageId,
        pathname: location.pathname,
        search: location.search,
      }, '*');
    }
  }, [location]);

  return <Outlet />;
}

// 使用 createBrowserRouter 创建路由实例
const router = createBrowserRouter([
  {
    path: '/',
    element: <Listener />,
    children: [
      {
    path: '/',
    element: <Navigate to='/home' replace={true} />,
  },
      {
    path: '/home',
    element: (
      <ErrorBoundary>
        <P_home />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/file-upload',
    element: (
      <ErrorBoundary>
        <P_file_upload />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/reader',
    element: (
      <ErrorBoundary>
        <P_reader />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/settings',
    element: (
      <ErrorBoundary>
        <P_settings />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/history',
    element: (
      <ErrorBoundary>
        <P_history />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/help',
    element: (
      <ErrorBoundary>
        <P_help />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/profile',
    element: (
      <ErrorBoundary>
        <P_profile />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '*',
    element: <NotFoundPage />,
  },
    ]
  }
]);

export default router;