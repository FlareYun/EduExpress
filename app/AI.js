import 'react-native-polyfill-globals/auto';

import { View, TextInput, TouchableOpacity, Text, FlatList, KeyboardAvoidingView, Platform, Animated, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import {React, useState, useEffect} from 'react';
import * as ImagePicker from 'expo-image-picker'; 
import AnimatedGradientBox from '../components/AnimatedText';

async function AIAnswer(message, imageUrl) {
  const url = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-11B-Vision-Instruct/v1/chat/completions";
  const apiKey = "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";
  imageUrl="https://cdn.discordapp.com/attachments/651181429119778834/1298929176165879848/maxresdefault.png?ex=671b5990&is=671a0810&hm=fac76ce8ecd8ddf8c40ea3531c71150ed637e5bb48771fa91843d9296b7d098f&"

  const data =  [{"type": "image_url", "image_url": {"url": imageUrl}}, { type: "text", text: message }] ;

  if (imageUrl){
      data.push({"type": "image_url", "image_url": {"url": imageUrl}});
  }

  const response = await fetch(url, {
      reactNative: { textStreaming: true },
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: data }],
      max_tokens: 500,
      stream: false,
    }),
  });

  console.log("Fetch Response:", response);

  if (!response.body) {
    console.error("Response body is null or undefined.");
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let done = false;
  let result = "";

  while (!done) {
    const { value, done: isDone } = await reader.read();
    done = isDone;

    if (value) {
      const chunk = decoder.decode(value, { stream: true });

      console.log(chunk);

      result += JSON.parse(chunk)["choices"][0]["message"]["content"];
    }
  }

  return result;
}

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showIntro, setShowIntro] = useState(true); 
  const [animationValue] = useState(new Animated.Value(0)); 
  const [selectedImage, setSelectedImage] = useState(null); 

  useEffect(() => {

    const startAnimation = () => {
      animationValue.setValue(0);
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }).start(() => startAnimation()); 
    };
    startAnimation();
  }, [animationValue]);

  const interpolateColors = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'], 
      ['#9400d3', '#4b0082', '#0000ff', '#00ff00', '#ffff00', '#ff7f00', '#ff0000'], 
    ],
  });

  const handleSend = async () => {
    if (inputText.trim()) {

      if (showIntro) setShowIntro(false);

      const newUserMessage = { id: Math.random().toString(), text: inputText, type: 'user' };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);

      const aiResponse = await AIAnswer(inputText);
      const newAIMessage = { id: Math.random().toString(), text: aiResponse, type: 'ai' };
      setMessages((prevMessages) => [...prevMessages, newAIMessage]);

      setInputText('');
      setSelectedImage(null);
    }
  };

  const pickImage = async () => {

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri); 
    }
  };

  const removeImage = () => {
    setSelectedImage(null); 
  };
  return (
    <KeyboardAvoidingView
      className="flex-1 p-4 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={15} 
    >

      {showIntro && (
        <View className="border-2 border-gray-500   p-20 rounded-lg mt-20 flex-1 " style={{ borderStyle: 'dotted' }}>

          <AnimatedGradientBox />

          <Text className="text-center text-1.5xl font-bold">
            Ask the AI for help with your homework or any general questions you have!
          </Text>
          <Text className="text-center pt-20">Powered by Llama</Text>
        </View>
      )}

<FlatList
        data={messages}
        renderItem={({ item }) => (
          <View className={`mb-2 ${item.type === 'user' ? 'items-end' : 'items-start'}`}>
            <Text
              className={`p-2 rounded-lg ${item.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
            >
              {item.text}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        className="mt-20"
        contentContainerStyle={{ paddingBottom: 100 }} 
      />

      {}
      {selectedImage && (
        <View className="relative mb-2">
          <Image
            source={{ uri: selectedImage }}
            className="w-32 h-32 rounded-lg"
          />
          <TouchableOpacity
            className="absolute top-4 right-80 p-1 bg-white rounded-full border border-gray-300"
            onPress={removeImage}
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}

      <View className="flex-row items-center mt-4 mb-3">
        <TouchableOpacity
          className="bg-white border border-gray-300 rounded-full p-3 mr-2"
          onPress={pickImage}
        >
          <Ionicons name="image" size={24} color="black" />
        </TouchableOpacity>

        <TextInput
          className="flex-1 border border-gray-300 rounded-lg p-2"
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity
          className="bg-blue-500 rounded-full p-3 ml-2"
          onPress={handleSend}
        >
          <Ionicons name="paper-plane" size={24} color="white" />
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  );
};
export default Chat;