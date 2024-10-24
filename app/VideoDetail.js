import React, { useState, useCallback, useEffect } from 'react';
import { Button, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import YoutubePlayer from "react-native-youtube-iframe";
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../app/AppContext'; 

const VideoDetail = () => {
  const { id, videoTitle, views, author } = useLocalSearchParams(); 
  const router = useRouter(); 
  const [videoId, setVideoId] = useState(id); 
  const [playing, setPlaying] = useState(true);
  const [isThumbsDown, setIsThumbsDown] = useState(false);
  const [isThumbsUp, setIsThumbsUp] = useState(false);
  const { datastore, setDatastore, searchQuery } = useAppContext(); 

  const formatViews = (views) => {
    if (views >= 1_000_000) {
        return `${(views / 1_000_000).toFixed(1)}M`; 
    } else if (views >= 1_000) {
        return `${(views / 1_000).toFixed(1)}K`;
    } else {
        return views.toString(); 
    }
  };

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("Video has finished playing!");
    }
  }, []);

  useEffect(() => {
    setVideoId(id);
  }, [id]);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  const handleThumbsDownPress = () => {
    setIsThumbsUp(false);
    setIsThumbsDown((prev) => !prev); 
  };

  const handleThumbsUpPress = () => {
    setIsThumbsDown(false);
    setIsThumbsUp((prev) => !prev); 

    const words = searchQuery.split(' ');
    words.forEach(word => {
      if (datastore[word]) {
        datastore[word].count += 1; 

        if (!(id in datastore[word].videos)) { 
          datastore[word].videos[id] = 1; 
        } else {

          datastore[word].videos[id] += 1;
        }
      } else {
        datastore[word]={videos:{}, count:0}
        datastore[word].count += 1; 

        if (!(id in datastore[word].videos)) { 
          datastore[word].videos[id] = 1; 
        } else {

          datastore[word].videos[id] += 1;
        }
      }
    });

    console.log(datastore);
    setDatastore({ ...datastore }); 
  };

  return (
    <View className="flex-1 bg-white">
      <TouchableOpacity onPress={() => router.back()} className="mt-10">
        <Ionicons name={"arrow-back"} size={35} color="black" className="p-5" />
      </TouchableOpacity>

      <View className="pt-10 flex-1 items-center">
        <YoutubePlayer
          height={200}
          width={350}
          play={playing}
          videoId={id}
          onChangeState={onStateChange}
        />
        <Text className="text-lg font-semibold mt-2">{videoTitle}</Text>
        <Text className="text-sm text-gray-600">{author}</Text>
        <Text className="text-sm text-gray-600">{formatViews(views)} views</Text> 

        <View className="border border-gray-300 rounded-3xl mt-4 p-4 w-96 items-center">
          <Text className="text-lg font-semibold">Would you recommend this video?</Text>
          <View className="flex-row">
            <TouchableOpacity className="p-2 rounded-full mx-2" onPress={handleThumbsUpPress}>
              <Ionicons
                name={isThumbsUp ? "thumbs-up-sharp" : "thumbs-up-outline"}
                size={35}
                color="black"
                className="p-5"
              />      
            </TouchableOpacity>
            <TouchableOpacity className="p-2 rounded-full mx-2" onPress={handleThumbsDownPress}>
              <Ionicons
                name={isThumbsDown ? "thumbs-down-sharp" : "thumbs-down-outline"}
                size={35}
                color="black"
                className="p-5"
              />     
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default VideoDetail;