import React from 'react';
import { View } from 'react-native';
import { Slot  } from 'expo-router';
import NavBar from '../components/NavBar'; // Import your bottom tab navigator

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
