import {React, useState, useEffect} from 'react';
import { View } from 'react-native';
import { Slot  } from 'expo-router';
import NavBar from '../components/NavBar'; 
import { AppProvider } from './AppContext'; 

import "../global.css";

const Layout = () => {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 2500); 
  }, []);

  return (
    <AppProvider>
          <View className="flex-1 bg-white">
      <Slot />
      {!loading && <NavBar /> }
    </View>
    </AppProvider>

  );
};

export default Layout;