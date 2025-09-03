import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/posts')
      .then(res => setPosts(res.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <div key={post._id}>
          <Link to={`/post/${post.slug}`}><h2>{post.title}</h2></Link>
          <p>By {post.author.username}</p>
        </div>
      ))}
    </div>
  );
}

export default Home;
