import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppContext } from '../app/AppContext';

const PostDetail = () => {
  const router = useRouter();
  const { posts } = useAppContext();
  const { id } = useLocalSearchParams();
  const post = posts.find((p) => p.id === id);
  const textInputRef = useRef(null); 

  console.log(post);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  const handleAddComment = () => {

    textInputRef.current.blur();


    if (commentText.trim()) {
      const newComment = {
        id: (comments.length + 1).toString(),
        text: commentText,
        marked: false,
      };
      setComments([...comments, newComment]);
      setCommentText('');
    }
  };

  const handleMarkSolution = (commentId) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? { ...comment, marked: true }
          : comment
      )
    );
  };

  return (
    <View className="flex-1 p-4 mt-20 bg-white">
      {}
      <Text className="text-2xl font-bold">{post.title}</Text>
      <Text className="text-gray-400 mt-2 ">
        {new Date(post.createdAt).toLocaleString()}
      </Text>
      <View className="border-b border-gray-300 my-4" />

      <Text className="text-gray-600 mt-2">{post.content}</Text>

      {post.image && <Image source={{ uri: post.image }} className="w-full h-40 mb-4" />}

      <Text className="text-xl font-bold mt-7">Comments</Text>
      <View className="border-b border-gray-300 my-2" />

      <TextInput
        className="border border-gray-300 p-3 mb-4 rounded-lg"
        ref={textInputRef}
        placeholder="Write a comment..."
        placeholderTextColor="grey"
        value={commentText}
        onChangeText={setCommentText}
        multiline
        style={{ height: 100 }}
      />

      <TouchableOpacity
        className="bg-blue-500 rounded-lg p-3 mb-4"
        onPress={handleAddComment}
      >
        <Text className="text-white text-center">Post Comment</Text>
      </TouchableOpacity>

      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <View className={`p-2 border-b  border-gray-300 flex-row items-center justify-between ${item.marked ? 'bg-green-200' : ''} `}>
            <Text className={`text-gray-600 p-1`}>
              {item.text}
            </Text>
            {!item.marked && (
              <TouchableOpacity
                className="bg-lightgreen rounded-lg p-1 ml-2"
                onPress={() => handleMarkSolution(item.id)}
              >
                <Text className="text-darkgreen">Mark Solution</Text>
              </TouchableOpacity>
            )}
            {item.marked && (
              <View className="flex-row items-center">
                <Text className="text-darkgreen">Marked</Text>
                <Ionicons name="checkmark" size={20} color="darkgreen" style={{ marginLeft: 4 }} />
              </View>
            )}
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default PostDetail;