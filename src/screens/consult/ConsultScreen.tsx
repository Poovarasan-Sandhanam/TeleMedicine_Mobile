// import React, { useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   PermissionsAndroid,
//   Platform,
//   Alert,
// } from 'react-native';
// import { RTCView, mediaDevices, RTCPeerConnection } from 'react-native-webrtc';

// const EnhancedCallScreen = () => {
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isVideoEnabled, setIsVideoEnabled] = useState(true);
//   const [isCalling, setIsCalling] = useState(false);

//   const peerConnection = useRef(null);

//   const startCall = async () => {
//     setIsCalling(true);
  
//     try {
//       // Request permissions for Android
//       if (Platform.OS === 'android') {
//         const cameraPermission = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA
//         );
//         const audioPermission = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
//         );
  
//         if (
//           cameraPermission !== PermissionsAndroid.RESULTS.GRANTED ||
//           audioPermission !== PermissionsAndroid.RESULTS.GRANTED
//         ) {
//           Alert.alert('Permissions Denied', 'Camera and audio permissions are required to start the call.');
//           setIsCalling(false);
//           return;
//         }
//       }
  
//       // Get local media stream
//       const stream = await mediaDevices.getUserMedia({
//         audio: true,
//         video: true,
//       });
  
//       setLocalStream(stream);
  
//       const configuration = {
//         iceServers: [
//           {
//             urls: 'stun:stun.l.google.com:19302',
//           },
//         ],
//       };
  
//       const pc = new RTCPeerConnection(configuration);
  
//       // Add tracks to the peer connection
//       stream.getTracks().forEach((track) => pc.addTrack(track, stream));
  
//       pc.ontrack = (event) => {
//         console.log('Remote track received:', event.streams[0]);
//         setRemoteStream(event.streams[0]);
//       };
  
//       peerConnection.current = pc;
  
//       // Create and set offer
//       const offer = await pc.createOffer();
//       await pc.setLocalDescription(offer);
  
//       console.log('Offer created:', offer);
  
//       // TODO: Exchange the offer with signaling server
//       // On receiving remote offer, set it:
//       // pc.setRemoteDescription(new RTCSessionDescription(remoteOffer));
//     } catch (error) {
//       console.error('Failed to start the call:', error);
//       Alert.alert('Error', 'Failed to start the call. Please check permissions and try again.');
//       setIsCalling(false);
//     }
//   };
  

//   const toggleAudio = () => {
//     if (localStream) {
//       const audioTracks = localStream.getAudioTracks();
//       audioTracks.forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//       setIsMuted(!isMuted);
//     } else {
//       Alert.alert('Error', 'No local stream found.');
//     }
//   };

//   const toggleVideo = () => {
//     if (localStream) {
//       const videoTracks = localStream.getVideoTracks();
//       videoTracks.forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//       setIsVideoEnabled(!isVideoEnabled);
//     } else {
//       Alert.alert('Error', 'No local stream found.');
//     }
//   };

//   const endCall = () => {
//     if (peerConnection.current) {
//       peerConnection.current.close();
//     }
//     if (localStream) {
//       localStream.getTracks().forEach((track) => track.stop());
//     }
//     setLocalStream(null);
//     setRemoteStream(null);
//     setIsCalling(false);
//     setIsMuted(false);
//     setIsVideoEnabled(true);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.videoContainer}>
//         {localStream ? (
//           <RTCView
//             streamURL={localStream.toURL()}
//             style={styles.localVideo}
//             mirror
//           />
//         ) : (
//           <View style={styles.placeholder}>
//             <Text style={styles.placeholderText}>Local Video</Text>
//           </View>
//         )}

//         {remoteStream ? (
//           <RTCView
//             streamURL={remoteStream.toURL()}
//             style={styles.remoteVideo}
//           />
//         ) : (
//           <View style={styles.placeholder}>
//             <Text style={styles.placeholderText}>Remote Video</Text>
//           </View>
//         )}
//       </View>

//       <View style={styles.controls}>
//         <TouchableOpacity
//           style={isMuted ? styles.buttonDisabled : styles.button}
//           onPress={toggleAudio}
//         >
//           <Text style={styles.buttonText}>
//             {isMuted ? 'Unmute' : 'Mute'}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={isVideoEnabled ? styles.button : styles.buttonDisabled}
//           onPress={toggleVideo}
//         >
//           <Text style={styles.buttonText}>
//             {isVideoEnabled ? 'Stop Video' : 'Start Video'}
//           </Text>
//         </TouchableOpacity>

//         {isCalling ? (
//           <TouchableOpacity style={styles.buttonEnd} onPress={endCall}>
//             <Text style={styles.buttonText}>End Call</Text>
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity style={styles.buttonStart} onPress={startCall}>
//             <Text style={styles.buttonText}>Start Call</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   videoContainer: {
//     flex: 1,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//   },
//   localVideo: {
//     width: '40%',
//     height: '40%',
//     backgroundColor: '#ccc',
//     borderRadius: 8,
//   },
//   remoteVideo: {
//     width: '80%',
//     height: '80%',
//     backgroundColor: '#444',
//     borderRadius: 8,
//   },
//   placeholder: {
//     width: '40%',
//     height: '40%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#333',
//     borderRadius: 8,
//   },
//   placeholderText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   controls: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     padding: 20,
//   },
//   button: {
//     backgroundColor: '#4CAF50',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     minWidth: 100,
//   },
//   buttonDisabled: {
//     backgroundColor: '#aaa',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     minWidth: 100,
//   },
//   buttonEnd: {
//     backgroundColor: '#F44336',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     minWidth: 100,
//   },
//   buttonStart: {
//     backgroundColor: '#4CAF50',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     minWidth: 100,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });

// export default EnhancedCallScreen;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, React Native!</Text>
      <Text style={styles.subtitle}>This is a simple text snippet.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: 'gray' },
});

export default App;
