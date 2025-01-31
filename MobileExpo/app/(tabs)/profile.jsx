import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { tw } from 'react-native-tailwindcss';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const Profile = () => {
  const router = useRouter();

  const studentData = {
    name: "John Doe",
    studentId: "2021-00123",
    program: "Bachelor of Science in Information Technology",
    yearLevel: "3rd Year",
    section: "IT-3A",
    email: "john.doe@student.edu",
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['isAuthenticated', 'userRole']);
              router.replace('/login');
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const InfoRow = ({ label, value }) => (
    <View style={[tw.mB2]}>
      <Text style={[tw.textSm, tw.textGray600]}>{label}</Text>
      <Text style={[tw.textBase, tw.fontMedium]}>{value}</Text>
    </View>
  );

  return (
    <View style={[tw.flex1, tw.bgGray100]}>
      <LinearGradient
        colors={['#800000', '#A52A2A', '#D2691E']}
        style={[tw.flex1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[tw.flex1, tw.justifyBetween]}>
          {/* Profile Information */}
          <View style={[tw.p6, tw.bgWhite, tw.mT4, tw.mX4, tw.roundedLg, tw.shadowMd]}>
            <Text style={[tw.textLg, tw.fontBold, tw.mB4]}>Student Information</Text>
            
            <InfoRow label="Name" value={studentData.name} />
            <InfoRow label="Student ID" value={studentData.studentId} />
            <InfoRow label="Program" value={studentData.program} />
            <InfoRow label="Year Level" value={studentData.yearLevel} />
            <InfoRow label="Section" value={studentData.section} />
            <InfoRow label="Email" value={studentData.email} />
          </View>

          {/* Logout Button Container */}
          <View style={[tw.p4, {marginBottom: 380 }]}>
            <TouchableOpacity
              style={[
                tw.p4,
                tw.roundedLg,
                tw.wFull,
                tw.itemsCenter,
                {
                  backgroundColor: '#800000',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5
                }
              ]}
              onPress={handleLogout}
            >
              <Text style={[tw.textBase, tw.fontBold, tw.textWhite]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default Profile;