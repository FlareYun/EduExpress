import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const NavBar = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('/AI'); 

  const tabs = [
    { name: 'Videos', icon: 'videocam', route: '/Videos' },
    { name: 'AI', icon: 'chatbubbles', route: '/AI' },
    { name: 'Forum', icon: 'people', route: '/Forum' },
    // { name: 'Profile', icon: 'person', route: '/Profile' },
  ];

  return (
    <View className="flex-row justify-around bg-white p-9 shadow-lg">
      {tabs.map((tab) => {

        const iconName = activeTab === tab.route ? tab.icon : `${tab.icon}-outline`;

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => {
              setActiveTab(tab.route);
              router.push(tab.route);
            }}
            className="flex items-center"
          >
            <Ionicons
              name={iconName} 
              size={35}
              color="black"
            />

          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default NavBar;
