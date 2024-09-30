import React from 'react';
import ContentHeader from './ContentHeader';
import '../styles/content.css';
import Card from './Card';
import PageEngagement from './PageEngagement';
import Profile from './Profile';
import LikesCommentsChart from './Chart';

const Content = () => {
  return (
    <div className='content-wrapper'>
      <div className='content'>
        <ContentHeader />
        <Card />
        <LikesCommentsChart />
      </div>
      <div className='profile-section'>
        <Profile />
      </div>
    </div>
  );
};

export default Content;
