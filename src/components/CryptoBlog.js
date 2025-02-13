import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/CryptoBlog.css';

const CryptoBlog = () => {
  const { id } = useParams(); // Récupérer l'ID de la crypto depuis l'URL
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  // Charger les posts depuis localStorage
  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('blogs')) || {};
    setPosts(savedPosts[id] || []);
  }, [id]);

  // Ajouter un nouveau post
  const addPost = () => {
    if (!newPostTitle || !newPostContent) return;

    const newPost = {
      id: Date.now(),
      title: newPostTitle,
      content: newPostContent,
      date: new Date().toLocaleString(),
      likes: 0,
    };

    const updatedPosts = [...posts, newPost];
    const savedPosts = JSON.parse(localStorage.getItem('blogs')) || {};
    savedPosts[id] = updatedPosts;
    localStorage.setItem('blogs', JSON.stringify(savedPosts));

    setPosts(updatedPosts);
    setNewPostTitle('');
    setNewPostContent('');
  };

  // Supprimer un post
  const deletePost = (postId) => {
    const updatedPosts = posts.filter((post) => post.id !== postId);
    const savedPosts = JSON.parse(localStorage.getItem('blogs')) || {};
    savedPosts[id] = updatedPosts;
    localStorage.setItem('blogs', JSON.stringify(savedPosts));
    setPosts(updatedPosts);
  };

  // Ajouter un like
  const likePost = (postId) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    );
    const savedPosts = JSON.parse(localStorage.getItem('blogs')) || {};
    savedPosts[id] = updatedPosts;
    localStorage.setItem('blogs', JSON.stringify(savedPosts));
    setPosts(updatedPosts);
  };

  return (
    <div className="crypto-blog">
      <h1>Blog de la Crypto {id}</h1>
      <div className="add-post">
        <input
          type="text"
          placeholder="Titre du post"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
        />
        <textarea
          placeholder="Contenu du post"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
        />
        <button onClick={addPost}>Ajouter un Post</button>
      </div>
      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p>Date : {post.date}</p>
            <p>Likes : {post.likes}</p>
            <button onClick={() => likePost(post.id)}>Like</button>
            <button onClick={() => deletePost(post.id)}>Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoBlog;