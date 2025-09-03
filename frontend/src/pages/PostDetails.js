import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function PostDetails() {
  const { slug } = useParams();
  const { user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/posts')
      .then(res => {
        const found = res.data.find(p => p.slug === slug);
        setPost(found);
        if (found) fetchComments(found._id);
      })
      .catch(err => setMsg('Failed to load post.'));
  }, [slug]);

  const fetchComments = (postId) => {
    axios.get(`http://localhost:5000/api/comments/${postId}`)
      .then(res => setComments(res.data))
      .catch(() => setMsg('Failed to load comments.'));
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMsg('Please log in to comment.');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/comments/${post._id}`, { content: commentText }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setCommentText('');
      setMsg('Comment posted!');
      fetchComments(post._id);
    } catch {
      setMsg('Failed to post comment.');
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>By {post.author.username}</p>
      <p>{post.content}</p>

      <h3>Comments</h3>
      {comments.length > 0 ? comments.map(c => (
        <div key={c._id}>
          <p><b>{c.author.username}</b>: {c.content}</p>
        </div>
      )) : <p>No comments yet.</p>}

      {user ? (
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="Add a comment"
            required
          />
          <button type="submit">Post Comment</button>
        </form>
      ) : (
        <p>Please log in to add comments.</p>
      )}

      {msg && <p>{msg}</p>}
    </div>
  );
}

export default PostDetails;
