import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Login from './login';
import HomePage from './homePage';
import Chat from './chat'
import CreateUser from './createUser';
import './styles.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/createUser',
    element: <CreateUser />
  },
  {
    path: '/homePage/:username',
    element: <HomePage />
  },
  {
    path: '/chat/:user/:chatID',
    element: <Chat />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router = {router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals