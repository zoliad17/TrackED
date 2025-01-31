import { Pressable, Text } from "react-native";
import React, { useEffect } from "react";
import { icon } from "@/constants/icon";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, interpolate } from "react-native-reanimated";  
import { tw } from "react-native-tailwindcss";

const TabBarButton = ({ onPress, onLongPress, isFocused, routeName, label }) => {
    
    const scale = useSharedValue(1); // Shared value for the icon scale

    useEffect(() => {
        // Scale up when focused, scale back down when unfocused
        scale.value = withSpring(isFocused ? 1.5 : 1, { duration: 350 });
    }, [isFocused]); // Dependency on `isFocused`

    // Animated style for the icon (scaling it up/down based on focus)
    const animatedIconsStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [1, 1.5], [1, 1.5]); // Interpolate scale from 1 to 1.5
        const top = interpolate(scale.value, [0, 1], [0, 8]); // Text moves up when the icon is focused
        return { 
            transform: [{ 
                scale: scaleValue 
            }],
            top
        }; 
    });

    // Animated style for the text (fade in/out based on focus)
    const animatedTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scale.value, [1, 1.5], [1, 0]); // Text fades out when the icon is focused
        return { opacity }; // Apply opacity change
    });

    // Base style for the text, with color depending on the focus state
    const baseTextStyle = {
        color: isFocused ? "#800000" : "#222",
        fontSize: 13,
    };

    return (
        <Pressable
            onPress={onPress}  
            onLongPress={onLongPress}  
            style={[
                tw.flex1,
                tw.justifyCenter,
                tw.itemsCenter,
                {
                    gap: 5,
                },
            ]}
        >
            <Animated.View style={animatedIconsStyle}>
                {React.cloneElement(icon[routeName], {
                    color: isFocused ? "#FFF" : "#222", // Icon color based on focus
                })}
            </Animated.View>
            <Animated.Text 
                style={[baseTextStyle, animatedTextStyle]} // Merge static and animated styles for text
            >
                {label}
            </Animated.Text>
        </Pressable>
    );
};

export default TabBarButton;
