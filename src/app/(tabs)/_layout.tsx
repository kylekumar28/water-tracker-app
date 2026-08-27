import IonIcons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      {/* <ThemeProvider value={AppTheme}> */}
      <StatusBar style='light' />

      <Tabs
        screenOptions={{
          headerShown: false,

          sceneStyle: {
            backgroundColor: '#000',
          },

          tabBarStyle: {
            backgroundColor: '#000',
            borderTopColor: '#1C1F26',
            height: 68,
            paddingTop: 6,
            paddingBottom: 8,
          },

          tabBarActiveTintColor: '#3670F7',
          tabBarInactiveTintColor: '#8B93A7',

          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            title: 'Today',
            tabBarIcon: ({ color }) => (
              <IonIcons name='water' size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name='weight'
          options={{
            title: 'Weight',
            tabBarIcon: ({ color }) => (
              <IonIcons name='scale-outline' size={23} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name='history'
          options={{
            title: 'History',
            tabBarIcon: ({ color }) => (
              <IonIcons name='bar-chart' size={23} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name='stats'
          options={{
            title: 'Stats',
            tabBarIcon: ({ color }) => (
              <IonIcons name='stats-chart' size={23} color={color} />
            ),
          }}
        />
      </Tabs>
      {/* </ThemeProvider> */}
    </>
  );
}
