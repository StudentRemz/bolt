import * as Notifications from 'expo-notifications';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export interface NotificationSettings {
  enabled: boolean;
  startTime?: string;
  endTime?: string;
  days: string[];
  timeSlots: string[];
}

export const registerForPushNotificationsAsync = async () => {
  if (Platform.OS === 'web') {
    // Web doesn't support push notifications in the same way
    return null;
  }

  let token;
  
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }
    
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    })).data;
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF5722',
    });
  }

  return token;
};

export const getUserNotificationSettings = async (userId: string): Promise<NotificationSettings | null> => {
  try {
    // In a real app, we would fetch from Firestore
    // For now, return sample settings
    return {
      enabled: true,
      startTime: '09:00',
      endTime: '21:00',
      days: ['monday', 'wednesday', 'friday'],
      timeSlots: ['morning', 'evening'],
    };
  } catch (error) {
    console.error('Error getting notification settings:', error);
    throw error;
  }
};

export const updateUserNotificationSettings = async (
  userId: string, 
  settings: NotificationSettings
): Promise<void> => {
  try {
    // In a real app, we would update Firestore
    // For now, log the settings
    console.log(`Updating notification settings for user ${userId}:`, settings);
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw error;
  }
};

export const schedulePushNotification = async (
  title: string,
  body: string,
  data: any = {},
  trigger: Notifications.NotificationTriggerInput = null
) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger,
  });
};