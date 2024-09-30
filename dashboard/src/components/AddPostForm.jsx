import React, { useState } from 'react';
import '../styles/addPostForm.css'; // Add your CSS for the modal here

const AddPostForm = ({ isOpen, onClose, onSubmit }) => {
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
  
    // Combine the scheduled date and time
    if (scheduledDate && scheduledTime) {
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      const unixTimestamp = Math.floor(scheduledDateTime.getTime() / 1000); // Convert to Unix timestamp in seconds
  
      // Ensure the scheduled time is at least 10 minutes in the future
      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      const minimumAllowedTime = now + 10 * 60; // 10 minutes from now
  
      if (unixTimestamp > minimumAllowedTime) {
        formData.set('scheduled_publish_time', unixTimestamp);
        formData.set('published', 'false'); // Force post to be unpublished for scheduling
      } else {
        alert('Scheduled publish time must be at least 10 minutes in the future.');
        return; // Prevent submission
      }
    }
  
    onSubmit(formData);
  }; 

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Add New Post</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Message:
            <textarea name="message" required />
          </label>
          <label>
            Link (optional):
            <input type="text" name="link" />
          </label>
          <label>
            Published:
            <select name="published" required>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </label>
          <label>
            Scheduled Publish Date:
            <input 
              type="date" 
              value={scheduledDate} 
              onChange={(e) => setScheduledDate(e.target.value)} 
              placeholder="YYYY-MM-DD"
            />
          </label>
          <label>
            Scheduled Publish Time:
            <input 
              type="time" 
              value={scheduledTime} 
              onChange={(e) => setScheduledTime(e.target.value)} 
              placeholder="HH:MM"
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddPostForm;
