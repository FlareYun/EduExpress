import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useAppContext } from '../app/AppContext';

const CreatePost = () => {
  const router = useRouter();
  const { posts, setPosts } = useAppContext(); 
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = () => {
    const newPost = {
      id: (posts.length + 1).toString(),
      title,
      content,
      image,
      createdAt: new Date().toISOString(), 
    };
    setPosts([...posts, newPost]); 
    router.push('/Forum'); 
  };

  return (
    <View className="flex-1 p-4 pt-20 bg-white">
      <TextInput
        className="border-b border-gray-400 p-3 mb-4 rounded-lg"
        placeholder="Post Title"
        placeholderTextColor="grey"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        className="border border-gray-300 p-3 mb-4 rounded-lg"
        placeholder="Write your post..."
        placeholderTextColor="grey"
        value={content}
        onChangeText={setContent}
        multiline
        style={{ height: 150 }}
      />

      {image && <Image source={{ uri: image }} className="w-full h-40 mb-4" />}

      <TouchableOpacity
        className="flex-row items-center justify-center p-3 bg-gray-200 rounded-lg mb-4"
        onPress={handleImageUpload}
      >
        <Ionicons name="image-outline" size={24} className="mr-2" />
        <Text>Upload Image</Text>
      </TouchableOpacity>

      <Button title="Post" onPress={handlePost} />
    </View>
  );
};

export default CreatePost;