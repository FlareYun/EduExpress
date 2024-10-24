import { React, useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_KEY } from '../config/API';
import { useRouter } from 'expo-router';
import { useAppContext } from '../app/AppContext'; 

const SearchScreen = () => {
    const [query, setQuery] = useState('');
    const { videos, setVideos, searchQuery, setSearchQuery, datastore, setDatastore } = useAppContext(); 
    const [nextPageToken, setNextPageToken] = useState('');
    const [loading, setLoading] = useState(false); 
    const [searchByDatastore, setSearchByDatastore] = useState(false); 
    const textInputRef = useRef(null); 
    const router = useRouter();

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

        setSearchQuery(query);

        try {
            if (!searchByDatastore) {
                const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                    params: {
                        part: 'snippet',
                        q: query,
                        type: 'video',
                        key: API_KEY,
                        maxResults: 5, 
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
              } else {
                await searchInDatastore(query);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false); 
        }
    };
    const formatViews = (views) => {
      if (views >= 1_000_000) {
          return `${(views / 1_000_000).toFixed(1)}M`; 
      } else if (views >= 1_000) {
          return `${(views / 1_000).toFixed(1)}K`;
      } else {
          return views.toString(); 
      }
    };
    const updateDatastoreWithWords = (query) => {
        const words = query.split(' ');
        words.forEach(word => {
            if (datastore[word]) {
                datastore[word].count += 1; 
            } else {
                datastore[word] = { count: 1, videos: [] }; 
            }
            datastore[word].videos.push(query); 
        });
        setDatastore({ ...datastore }); 
    };
    const searchInDatastore = async (query) => {
      const words = query.split(' ');
      const lowestCountWords = Object.entries(datastore)
          .filter(([word]) => words.includes(word)) 
          .sort((a, b) => a[1].count - b[1].count) 
          .slice(0, 3); 

      const videoSet = new Set();
      const overlappingVideos = [];

      const videoLists = lowestCountWords.map(([word]) => datastore[word].videos);

      const videoCountMap = {};
      console.log('videoLists')

      console.log(videoLists)

      videoLists.forEach((videos) => {
        for (const [videoId, thumbsUpCount] of Object.entries(videos)) {
          if (!videoCountMap[videoId]) {
            videoCountMap[videoId] = 0; 
          }
          videoCountMap[videoId] += thumbsUpCount; 
        }
      });
      console.log('videoCountMap')

      console.log(videoCountMap)

      for (const videoId in videoCountMap) {
          if (videoCountMap[videoId] > 1) { 
              overlappingVideos.push(videoId);
          }
      }

      const otherVideos = [];

      console.log(lowestCountWords)

      var needed = 10-overlappingVideos.length;

      console.log(datastore)

      lowestCountWords.forEach(([word]) => {
        console.log(word)
        for (const [videoId, thumbsUpCount] of Object.entries(datastore[word].videos)) {
          if (needed<=0){
            break
          }
          if (!videoSet.has(videoId) && !overlappingVideos.some(ov => ov === videoId)) {
            otherVideos.push(videoId);
            videoSet.add(videoId); 
            needed-=1
        }
        }
      });

      console.log(overlappingVideos, otherVideos)

      const finalVideos = [...overlappingVideos, ...otherVideos.slice(0, needed)]; 

      console.log('abcdef')
      console.log(videos);
      console.log(finalVideos)

      const uniqueVideos = finalVideos.filter(newVideo => 
        !videos.some(video => video.id.videoId === newVideo)
      );

      console.log(uniqueVideos);

    const videosWithStats = await Promise.all(uniqueVideos.map(async (video) => {
      const stats = await fetchVideoStatistics(video);
      return {
          id: {videoId: video},
          statistics: stats ? stats.statistics : {},
          snippet: stats ? stats.snippet : video.snippet, 
      };
    }));

    console.log(videosWithStats);

    setVideos(prevVideos => [...prevVideos, ...videosWithStats]);

  };

    const onSearchButtonPress = () => {
      setVideos([]);
        handleSearch();
        textInputRef.current.blur();
    };

    const toggleMode = () => {
      setVideos([]);
      setSearchByDatastore(prev => !prev)
    }

    return (
        <View className="flex-1 p-20 bg-white">
            <Text className="text-3xl text-center font-extrabold p-5">Video Finder</Text>
            <View className="flex-row items-center mb-4">
                <TextInput
                    ref={textInputRef}
                    className="border border-gray-300 rounded-lg p-2 flex-1"
                    placeholder="Search for videos..."
                    value={query}
                    onChangeText={setQuery}
                />
                <TouchableOpacity
                    onPress={onSearchButtonPress}
                    className="bg-green-400 rounded-lg p-3 ml-2 flex justify-center items-center"
                >
                    <Ionicons name="search" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                onPress={toggleMode}
                className="bg-gray-300 rounded-lg p-2 mb-4"
            >
                <Text className="text-center">{searchByDatastore ? 'Find By: EduExpress Votes' : 'Find By: Youtube Search'}</Text>
            </TouchableOpacity>

            <FlatList   
                data={videos}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => router.push({
                          pathname: `/VideoDetail/`,
                          params: { id: item.id.videoId, videoTitle: item.snippet.title, views: item.statistics.viewCount, author: item.snippet.channelTitle }, 
                      })}
                        className="flex-row items-center mb-4"
                    >
                        <Image source={{ uri: item.snippet.thumbnails.default.url }} className="w-32 h-24 rounded-lg" />
                        <View className="ml-3"> 
                            <Text className="text-lg font-semibold">{item.snippet.title}</Text>
                            <Text className="text-sm text-gray-600">{item.snippet.channelTitle}</Text>
                            <Text className="text-sm text-gray-600">{formatViews(item.statistics.viewCount)} views</Text> 
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.videoId}
                className="mt-4"
                onEndReached={handleSearch} 
                onEndReachedThreshold={0.5} 
            />
        </View>
    );
};

export default SearchScreen;