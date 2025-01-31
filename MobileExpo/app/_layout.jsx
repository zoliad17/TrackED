import { useFonts, Montserrat_500Medium, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text } from 'react-native';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const router = useRouter();

  // Load fonts
  const [loaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_600SemiBold,
  });

  // Check authentication status
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authStatus = await AsyncStorage.getItem('isAuthenticated');
      setIsAuthenticated(authStatus === 'true');
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    }
  };

  // Handle splash screen and initial navigation
  useEffect(() => {
    const handleInitialLoad = async () => {
      if (loaded && isAuthenticated !== null) {
        await SplashScreen.hideAsync();
        
        // Navigate based on authentication status
        if (!isAuthenticated) {
          router.replace('/login');
        }
      }
    };

    handleInitialLoad();
  }, [loaded, isAuthenticated]);

  // Show nothing while loading
  if (!loaded || isAuthenticated === null) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#ffffff' }
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="(tabs)" 
        options={{
          headerShown: true,
          gestureEnabled: false,
          headerTitle: 'TrackEd',
          headerTitleStyle: {
            fontFamily: 'Montserrat_600SemiBold',
            fontSize: 24,
            fontWeight: '800',
            color: '#1a365d',
          },
          headerStyle: {
            backgroundColor: '#ffffff',
            borderBottomWidth: 1,
            borderBottomColor: '#e2e8f0',
            elevation: 2,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          },
          headerTitleAlign: 'center',
          headerShadowVisible: true,
        }} 
      />
    </Stack>
  );
}