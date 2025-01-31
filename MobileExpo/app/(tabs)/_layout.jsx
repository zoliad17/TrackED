import React from 'react'
import { Tabs } from 'expo-router'
import { TabBar } from '@/components/TabBar';


const TabLayout = () => {
  return (
    <Tabs tabBar={props => <TabBar {...props} />}>
        <Tabs.Screen name="schedule" options={{ tabBarLabel: 'Schedule', headerShown: false}}/>
        <Tabs.Screen name="index" options={{ tabBarLabel: 'Home', headerShown: false }} />
        <Tabs.Screen name="profile" options={{ tabBarLabel: 'Profile', headerShown: false }} />
    </Tabs>
  )
}

export default TabLayout