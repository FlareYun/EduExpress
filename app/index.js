import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const LoadingScreen = () => {
  const slideAnim = useRef(new Animated.Value(-100)).current; 
  const router = useRouter();

  useEffect(() => {

    Animated.timing(slideAnim, {
      toValue: 0, 
      duration: 1000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => router.push("/AI"), 1000);
    });
  }, [slideAnim]);

  return (
    <View style={styles.container}>
      {}
      <View style={styles.mask}>
        <Animated.View style={[styles.logoContainer, { transform: [{ translateY: slideAnim }] }]}>
        <Image 
          source={require('../assets/images/EduExpress.png')} 
          style={styles.logo}
        />
        </Animated.View>

      </View>

      <Text className="text-center gray p-90">EduExpress</Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', 
  },
  mask: {
    height: 100, 
    width: '100%', 
    overflow: 'hidden', 
    justifyContent: 'flex-end', 
  },
  logoContainer: {

    alignItems: 'center',
  },
  logo: {
    width: '120%',
    height: '120%',
    resizeMode: 'contain',
  },
});

export default LoadingScreen;