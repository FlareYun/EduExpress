import React, { createContext, useContext, useState } from 'react';
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [datastore, setDatastore] = useState({});

  return (
    <AppContext.Provider value={{ videos, setVideos,  nextPageToken, setNextPageToken, posts, setPosts , datastore, setDatastore, searchQuery, setSearchQuery }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);