import React, { useState, useContext } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

function CreatePost() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [msg, setMsg] = useState('');
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setErrors([]);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/posts`,
        { title, content },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setMsg('Post created successfully!');
      setTitle('');
      setContent('');
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setMsg('Failed to create post.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Post</h2>
      {msg && <p>{msg}</p>}
      {errors.map((error, idx) => (
        <p key={idx} style={{ color: 'red' }}>
          {error.msg}
        </p>
      ))}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        placeholder="Write your content here..."
      />
      <button type="submit">Create Post</button>
    </form>
  );
}

export default CreatePost;
