import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import Profile from './components/Profile';
import PageEngagement from './components/PageEngagement';
import Insights from './components/Insights';
import Conversations from './components/Conversations';
import FeedList from './components/FeedList';
import PostManage from './components/PostManage';
import Login from './components/Login';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Main App Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Content />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/page-engagement" element={<PageEngagement />} />
          <Route path="/insight" element={<Insights />} />
          <Route path="/messages" element={<Conversations />} />
          <Route path="/feed" element={<FeedList />} />
          <Route path="/post" element={<PostManage />} />
        </Route>
      </Routes>
    </Router>
  );
};

// Layout component to include Sidebar and Content
const Layout = () => {
  return (
    <div className='dashboard'>
      <Sidebar />
      <div className='dashboard--content'>
        <Outlet /> {/* Renders the matched child route */}
      </div>
    </div>
  );
};

export default App;
