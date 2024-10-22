// app/components/BottomTabBar.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const NavBar = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('/'); // Set the default active tab

  const tabs = [
    { name: 'Videos', icon: 'videocam', route: '/Videos' },
    { name: 'AI', icon: 'chatbubbles', route: '/' },
    { name: 'Forum', icon: 'people', route: '/Forum' },
    { name: 'Profile', icon: 'person', route: '/Profile' },
  ];

  return (
    <View className="flex-row justify-around bg-white p-9 shadow-lg">
      {tabs.map((tab) => {
        // Append 'outline' if it's not the active tab
        const iconName = activeTab === tab.route ? tab.icon : `${tab.icon}-outline`;

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => {
              setActiveTab(tab.route); // Set the active tab state
              router.push(tab.route);
            }}
            className="flex items-center"
          >
            <Ionicons
              name={iconName} // Use the conditional icon name
              size={35}
              color="black"// Change color based on active state
            />
            {/* <Text className="text-white">
              {tab.name}
            </Text> */}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default NavBar;
