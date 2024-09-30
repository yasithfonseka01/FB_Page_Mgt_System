import React from 'react';
import { NavLink } from 'react-router-dom';
import { BiBookAlt, BiHome, BiMessage, BiSolidReport, BiStats, BiTask, BiHelpCircle, BiHardHat } from 'react-icons/bi';
import "../styles/sidebar.css";

const Sidebar = () => {
  return (
    <div className='menu'>
      <div className='logo'>
        <BiBookAlt className='logo-icon' />
        <h2>FB-MANAGER</h2>
      </div>

      <div className='menu--list'>
        <NavLink to='/dashboard' className='item' activeClassName='active'>
          <BiHome className='icon' />
          Dashboard
        </NavLink>

        <NavLink to='/post' className='item' activeClassName='active'>
          <BiTask className='icon' />
          Post Manage
        </NavLink>

        <NavLink to='/page-engagement' className='item' activeClassName='active'>
          <BiSolidReport className='icon' />
          Post Engagement
        </NavLink>

        <NavLink to='/feed' className='item' activeClassName='active'>
          <BiStats className='icon' />
          Feed
        </NavLink>

        <NavLink to='/insight' className='item' activeClassName='active'>
          <BiMessage className='icon' />
          Insight
        </NavLink>

        <NavLink to='/messages' className='item' activeClassName='active'>
          <BiHelpCircle className='icon' />
          Message
        </NavLink>

        <NavLink to='http://localhost:5173/' className='item' activeClassName='active' target='_blank'>
          <BiHardHat className='icon' />
          Website
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
