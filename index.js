import messaging from '@react-native-firebase/messaging';
import {backgroundEvents} from './src/services/notification/notifeeServices';
import notifee, {AndroidImportance, AndroidStyle} from '@notifee/react-native';
import 'react-native-get-random-values';
import {AppRegistry, Text, TextInput} from 'react-native';
import {enableScreens} from 'react-native-screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {name as appName} from './app.json';
import App from './App';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import {onDisplayNotification} from './src/services/notification/notifeeServices';

dayjs.extend(utc);
dayjs.extend(localizedFormat);

/**
 * Enable React Native Screen
 * Performance Gain & Less Memory Usage
 * In React Navigation
 */
enableScreens();

// Register background FCM message handler
// messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//   console.log('FCM Message handled in the background!', remoteMessage);
// });

// async function onMessageReceived(message) {
//   console.log('🚀 ~ onMessageReceived ~ message:', message);
//   // Display message via notifee

//   // Request permissions (required for iOS)
//   // const permission = await notifee.requestPermission();
//   // console.log('🚀 ~ onMessageReceived ~ permission:', permission);

//   // Create a channel (required for Android)
//   const channelId = await notifee.createChannel({
//     id: message?.messageId || message?.data?.channel_id,
//     name: message?.data?.body || message?.data?.channel_name,
//     importance: AndroidImportance.HIGH,
//   });

//   // Prepare Android options
//   const androidOptions = {
//     channelId,
//     importance: AndroidImportance.HIGH, // Set the notification importance to HIGH
//     pressAction: {
//       id: 'default', // Action when pressed
//     },
//     // fullScreenAction: {
//     //   id: 'default',
//     // },
//     // asForegroundService: true,
//     // // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
//     // // pressAction is needed if you want the notification to open the app when pressed
//     // pressAction: {
//     //   id: 'default',
//     // },
//   };

//   // Check if imageUrl is present to use BigPictureStyle
//   const imageUrl = message?.notification?.android?.imageUrl;
//   if (imageUrl) {
//     androidOptions.style = {
//       type: AndroidStyle.BIGPICTURE,
//       picture: imageUrl,
//     };
//   }

//   // Display a notification
//   await notifee.displayNotification({
//     title: message?.notification?.title,
//     body: message?.notification?.body,
//     android: androidOptions,
//     ios: {
//       badgeCount: 1,
//       sound: 'default',
//       foregroundPresentationOptions: {
//         badge: true,
//         sound: true,
//       },
//       // attachments: [
//       //   {
//       //     url: 'https://i0.wp.com/picjumbo.com/wp-content/uploads/beautiful-nature-mountain-scenery-with-flowers-free-photo.jpg?w=2210&quality=70',
//       //   },
//       // ],
//     },
//   });

//   // Increment the count by 1
//   await notifee.incrementBadgeCount();

//   // Get the current date and time in UTC
//   const currentDateTime = dayjs().utc();

//   // Calculate the date with 6 hours added
//   const receivedDate = currentDateTime.add(6, 'hour').format('YYYY-MM-DD');

//   // Calculate the time with 6 hours added and remove the seconds
//   const receivedTime = currentDateTime.add(6, 'hour').format('hh:mm A');

//   // Insert date and time as new properties in the message
//   const messageWithDateTime = {
//     ...message,
//     receivedDate,
//     receivedTime,
//   };

//   try {
//     // Retrieve the existing message list from AsyncStorage
//     const messagesString = await AsyncStorage.getItem('messageList');
//     let messageList = messagesString ? JSON.parse(messagesString) : [];

//     // Add the new message to the list
//     messageList.push(messageWithDateTime);

//     // Store the updated message list back to AsyncStorage
//     await AsyncStorage.setItem('messageList', JSON.stringify(messageList));

//     // Retrieve the existing new message list from AsyncStorage
//     const newMessagesString = await AsyncStorage.getItem('newMessage');
//     let newMessageList = newMessagesString ? JSON.parse(newMessagesString) : [];

//     // Add the new message to the new message list
//     newMessageList.push(messageWithDateTime);

//     // Store the updated new message list back to AsyncStorage
//     await AsyncStorage.setItem('newMessage', JSON.stringify(newMessageList));

//     // console.log('Message stored locally:', messageWithDateTime);
//   } catch (error) {
//     console.error('Error storing message locally:', error);
//   }

// messaging().onMessage(onMessageReceived);
// messaging().setBackgroundMessageHandler(onMessageReceived);

// // ======== notifee background events =======
// backgroundEvents();

AppRegistry.registerComponent(appName, () => App);

if (Text.defaultProps == null) {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
}

if (TextInput.defaultProps == null) {
  TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
}
