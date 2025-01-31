import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { tw } from 'react-native-tailwindcss';
import { useState, useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import React from 'react';
import TabBarButton from './TabBarButton';

export function TabBar({ state, descriptors, navigation }) {
  const { colors } = useTheme();
  const [dimensions, setDimensions] = useState({ height: 20, width: 100 });

  const buttonWidth = dimensions.width / state.routes.length;

  const onTabbarLayout = (e) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width
    });
  };

  const tabPositionX = useSharedValue(0);

  useEffect(() => {
    const initialIndex = state.index;
    tabPositionX.value = withSpring(buttonWidth * initialIndex, { damping: 50, stiffness: 50 });
  }, [buttonWidth, state.index, tabPositionX]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
      width: buttonWidth - 30,  // Slight margin for aesthetics
      height: dimensions.height - 15,
      borderRadius: 25,  // Match the button's rounded corners
      backgroundColor: '#800000',
      position: 'absolute',
      marginHorizontal: 15,
    };
  });

  return (
    <View
      onLayout={onTabbarLayout}
      style={[
        tw.absolute,
        tw.flexRow,
        tw.justifyBetween,
        tw.itemsCenter,
        tw.bgWhite,
        {
          bottom: 40,
          marginHorizontal: 80,
          paddingVertical: 15,
          borderRadius: 35,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowRadius: 10,
          shadowOpacity: 0.1
        }
      ]}
    >
      <Animated.View style={animatedStyle} />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          tabPositionX.value = withSpring(buttonWidth * index, { damping: 100, stiffness: 100 });

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? "#FFF" : "#222"}
            label={label}
          />
        );
      })}
    </View>
  );
}
