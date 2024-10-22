import React from 'react';
import { View } from 'react-native';
import { Slot  } from 'expo-router';
import NavBar from '../components/NavBar'; 

import "../global.css";

const Layout = () => {
  return (
    <View className="flex-1 bg-white">
      <Slot />
      <NavBar />
    </View>
  );
};

export default Layout;
