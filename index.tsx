import { useState, useEffect } from 'react';
import { Text, View, Button, Alert, ScrollView } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('Waiting for token...');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? 'No token returned'))
      .catch(error => setErrorMsg(error.message || 'Unknown error'));
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Samwaad Push Token:</Text>
      
      <Text selectable={true} style={{ marginVertical: 20, textAlign: 'center', color: 'blue', backgroundColor: '#e6f4fe', padding: 10 }}>
        {expoPushToken}
      </Text>

      {/* This will show us EXACTLY why it fails if it crashes again */}
      {errorMsg ? <Text style={{ color: 'red', marginVertical: 10, textAlign: 'center' }}>Error: {errorMsg}</Text> : null}
      
      <Button 
        title="I HAVE COPIED THE TOKEN!" 
        onPress={() => Alert.alert("Great!", "Now let's test it on the Expo Push Tool.")} 
      />
    </ScrollView>
  );
}

async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    throw new Error('Must use physical device for Push Notifications');
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    throw new Error('Notification permission not granted!');
  }
  
  // HARDCODED PROJECT ID: This bypasses the Constants bug in APKs
  const projectId = '16ddbbb3-d75f-49de-af72-e945acb32b8b';
  
  const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });
  return tokenResponse.data;
}
