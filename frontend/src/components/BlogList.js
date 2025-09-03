import React from 'react';
import { Link } from 'react-router-dom';

function BlogList({ posts }) {
  if (!posts || posts.length === 0) {
    return <p>No posts available.</p>;
  }

  return (
    <div>
      {posts.map(post => (
        <div key={post._id} style={{ marginBottom: '1.5rem' }}>
          <Link to={`/post/${post.slug}`}><h2>{post.title}</h2></Link>
          <p>By {post.author.username}</p>
        </div>
      ))}
    </div>
  );
}

export default BlogList;
