// app/video/[id].js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, useRouter } from 'expo-router';

const VideoDetail = () => {
  const { id, videoTitle } = useLocalSearchParams(); // Get params from URL
  const router = useRouter(); // For navigation

  return (
    <View className="flex-1 items-center justify-center p-5 bg-white">
      <WebView
        source={{ uri: `https://www.youtube.com/embed/${id}` }}
        style={{ width: '100%', height: 300 }}
      />
      <Text className="text-lg font-semibold mt-2">{videoTitle}</Text>

      <View className="bg-gray-200 rounded-lg mt-4 p-4 w-full items-center">
        <Text className="text-lg font-semibold">Would you recommend this video?</Text>
        <View className="flex-row mt-2">
          <TouchableOpacity className="bg-green-500 p-2 rounded-full mx-2">
            <Text className="text-white">👍</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-red-500 p-2 rounded-full mx-2">
            <Text className="text-white">👎</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={() => router.back()} className="mt-4">
        <Text className="text-blue-500">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VideoDetail;
