import React from 'react';
import { Link } from 'react-router-dom';

function BlogPost({ post }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <Link to={`/post/${post.slug}`}>
        <h2>{post.title}</h2>
      </Link>
      <p>By {post.author.username}</p>
      <p>{post.content.substring(0, 150)}...</p>
    </div>
  );
}

export default BlogPost;
