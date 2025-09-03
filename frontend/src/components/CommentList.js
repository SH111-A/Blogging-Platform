import React from 'react';

function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return <p>No comments yet.</p>;
  }

  return (
    <div>
      {comments.map(comment => (
        <div key={comment._id} style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
          <p><b>{comment.author.username}</b>: {comment.content}</p>
        </div>
      ))}
    </div>
  );
}

export default CommentList;
