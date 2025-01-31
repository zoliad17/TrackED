import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  Dimensions,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { tw } from "react-native-tailwindcss";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const Login = () => {
  const [studentEmail, setStudentEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      if (!studentEmail || !password) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      if (studentEmail === "student@example.com" && password === "student123") {
        await AsyncStorage.multiSet([
          ["isAuthenticated", "true"],
          ["userRole", "student"],
        ]);
        router.replace("/(tabs)");
      } else {
        Alert.alert("Error", "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Failed to login. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      style={[tw.flex1]}
    >
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#800000", "#A52A2A", "#D2691E"]}
        style={[tw.flex1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[tw.flex1, tw.justifyCenter, tw.p6]}>
          {/* Logo/Header Section */}
          <View style={[tw.itemsCenter, tw.mB8]}>
            <View
              style={[tw.w24, tw.h24, tw.itemsCenter, tw.justifyCenter, tw.mB4]}
            >
              <Image
                source={require("../assets/images/icon-mobile.png")}
                style={{ width: 170, height: 170 }}
              />
            </View>
            <Text
              style={[
                tw.text3xl,
                tw.fontBold,
                tw.textWhite,
                tw.mT2,
                { fontFamily: "SpaceMono" },
              ]}
            >
              TrackEd
            </Text>
            <Text
              style={[
                tw.textBase,
                tw.textWhite,
                tw.textCenter,
                tw.mT1,
                { opacity: 0.8 },
              ]}
            >
              Tracking Education Seamlessly
            </Text>
          </View>

          {/* Login Form */}
          <View
            style={[
              tw.p8,
              tw.roundedLg,
              { backgroundColor: "rgba(255, 255, 255, 0.95)" },
              tw.shadowLg,
            ]}
          >
            <View style={[tw.spaceY4]}>
              <View>
                <Text
                  style={[tw.textSm, tw.fontMedium, tw.textGray700, tw.mB2]}
                >
                   Email
                </Text>
                <TextInput
                  style={[
                    tw.w100p,
                    tw.p4,
                    tw.roundedLg,
                    tw.borderWidth,
                    {
                      borderColor: "#800000",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    },
                  ]}
                  placeholder="Enter your Email"
                  value={studentEmail}
                  onChangeText={setStudentEmail}
                  autoCapitalize="none"
                  placeholderTextColor="#666"
                />
              </View>

              <View>
                <Text
                  style={[tw.textSm, tw.fontMedium, tw.textGray700, tw.mB2]}
                >
                  Password
                </Text>
                <View style={[tw.relative]}>
                  <TextInput
                    style={[
                      tw.w100p,
                      tw.p4,
                      tw.roundedLg,
                      tw.borderWidth,
                      {
                        borderColor: "#800000",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                      },
                    ]}
                    placeholder="Enter your Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#666"
                  />
                  <TouchableOpacity
                    style={[tw.absolute, tw.right0, tw.top0, tw.p4]}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={[tw.textGray600]}>
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={[tw.itemsEnd]}>
                <Text style={[tw.textSm, { color: "#800000" }]}>
                  Forgot password?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  tw.w100p,
                  tw.p4,
                  tw.roundedLg,
                  tw.itemsCenter,
                  tw.mT4,
                  { backgroundColor: "#800000" },
                  tw.shadowMd,
                ]}
                onPress={handleLogin}
              >
                <Text style={[tw.textBase, tw.fontBold, tw.textWhite]}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={[tw.mT8, tw.itemsCenter]}>
            <Text style={[tw.textSm, tw.textWhite, { opacity: 0.8 }]}>
              Having trouble signing in?
            </Text>
            <TouchableOpacity style={[tw.mT2]}>
              <Text style={[tw.textSm, tw.fontMedium, tw.textWhite]}>
                Contact Support
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default Login;
