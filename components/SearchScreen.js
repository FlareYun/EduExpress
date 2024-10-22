import {React, useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text, Image, Linking } from 'react-native';
import axios from 'axios';
import { API_KEY } from '../config/API';
import { useRouter } from 'expo-router';


const SearchScreen = () => {
    const [query, setQuery] = useState('');
    const [videos, setVideos] = useState([]);
    const [nextPageToken, setNextPageToken] = useState('');
    const [loading, setLoading] = useState(false); 
    const textInputRef = useRef(null); 
    const router = useRouter();


    const formatViews = (views) => {
        if (views >= 1_000_000) {
            return `${(views / 1_000_000).toFixed(1)}M`; 
        } else if (views >= 1_000) {
            return `${(views / 1_000).toFixed(1)}K`;
        } else {
            return views.toString(); 
        }
    };

    const fetchVideoStatistics = async (videoId) => {
      try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
          params: {
            part: 'statistics,snippet',
            id: videoId,
            key: API_KEY,
          },
        });
        return response.data.items[0]; 
      } catch (error) {
        console.error('Error fetching video statistics:', error);
        return null; 
      }
    };
  
    const handleSearch = async () => {
      if (!query) return;
  
      if (loading) return; 
  
      setLoading(true); 

      try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            part: 'snippet',
            q: query,
            type: 'video',
            key: API_KEY,
            maxResults: 10, 
            pageToken: nextPageToken || '', 
          },
        });
  
        const newVideos = response.data.items;
  
        const uniqueVideos = newVideos.filter(newVideo => 
          !videos.some(video => video.id.videoId === newVideo.id.videoId)
        );
  
        const videosWithStats = await Promise.all(uniqueVideos.map(async (video) => {
          const stats = await fetchVideoStatistics(video.id.videoId);
          return {
            ...video,
            statistics: stats ? stats.statistics : {},
            snippet: stats ? stats.snippet : video.snippet, 
          };
        }));
  
        setVideos(prevVideos => [...prevVideos, ...videosWithStats]);
  
        if (response.data.nextPageToken) {
          setNextPageToken(response.data.nextPageToken);
        } else {
          setNextPageToken('');
        }
      } catch (error) {
        console.error('Error fetching data from YouTube API:', error);
      } finally {
        setLoading(false); 
      }

    };
  


    const onSearchButtonPress = () => {
        setVideos([]); 
        setNextPageToken(''); 
        
        handleSearch();
    
        textInputRef.current.blur();
      };

      const handleVideoSelect = (video) => {
        router.push({
          pathname: `/VideoDetail/`,
          params: { id:video.id.videoId, videoTitle: video.snippet.title }, // Optional: Pass additional data
        });
      };
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleVideoSelect(item)} 
      className="flex-row items-center mb-4"
    >
      <Image source={{ uri: item.snippet.thumbnails.default.url }} className="w-32 h-24 rounded-lg" />
      <View className="ml-3"> 
        <Text className="text-lg font-semibold">{item.snippet.title}</Text>
        <Text className="text-sm text-gray-600">{item.snippet.channelTitle}</Text>
        <Text className="text-sm text-gray-600">{formatViews(item.statistics.viewCount)} views</Text> 
      </View>
          </TouchableOpacity>
  );

  return (
    <View className="flex-1 p-20 bg-white">
        <Text className="text-3xl text-center font-extrabold p-5">Video Finder</Text>
      <TextInput
        ref={textInputRef} // Assign ref to TextInput
        className="border border-gray-300 rounded-lg p-2 mb-2"
        placeholder="Search for videos..."
        value={query}
        onChangeText={setQuery}
      />
      <View className="flex items-center mb-4">      
        <TouchableOpacity
        onPress={onSearchButtonPress}
        className="bg-green-400 rounded-lg p-1 w-56 mb-2 flex-row justify-center items-center"
      >        
      <Text className="text-2xl text-center font-extrabold ">Search</Text>
</TouchableOpacity></View>


            <FlatList   
        data={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.videoId}
        className="mt-4"
        onEndReached={handleSearch} 
        onEndReachedThreshold={0.5} 
      />
    </View>
  );
};

export default SearchScreen;
