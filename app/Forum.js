import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppContext } from '../app/AppContext';

const Forum = () => {
  const router = useRouter();
  const { posts } = useAppContext(); 
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPost = ({ item }) => (
<TouchableOpacity onPress={() => router.push(`/PostDetail?id=${item.id}`)}>
  <View className="p-4 border-b border-gray-300 flex-row items-center">
    <View style={{ flex: 1 }}> 
      <Text className="text-xl font-bold">{item.title}</Text>
      <Text className="text-gray-600">{item.content}</Text>
    </View>
    <View style={{ width: 100 }}> 
      <Text className="text-gray-400 text-right">
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </View>
  </View>
</TouchableOpacity>

  );

  return (
    <View className="flex-1 bg-white">
      <TextInput
        className="border-b border-gray-400 p-3 pt-20 m-4 rounded-lg"
        placeholder="Search posts..."
        placeholderTextColor="grey"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        className="flex-1"
      />

      <TouchableOpacity
        className="absolute bottom-5 right-5 bg-blue-500 p-4 rounded-full shadow-lg"
        onPress={() => router.push('/CreatePost')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default Forum;