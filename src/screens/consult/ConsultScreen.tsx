import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';

interface ConsultScreenProps {
  navigation?: any;
  route?: {
    params?: {
      appointmentId?: string;
      doctorName?: string;
    };
  };
}

const ConsultScreen: React.FC<ConsultScreenProps> = ({ navigation, route }) => {
  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState<boolean>(true);

  const appointmentId = route?.params?.appointmentId;
  const doctorName = route?.params?.doctorName || 'Doctor';

  const handleStartCall = useCallback(() => {
    if (!appointmentId) {
      Alert.alert('Error', 'Appointment ID is missing');
      return;
    }

    setIsCallActive(true);
    Alert.alert(
      'Call Started',
      `Connecting to ${doctorName}...`,
      [
        {
          text: 'OK',
          onPress: () => {
            // TODO: Implement actual video call logic here
            console.log('Starting video call with:', doctorName);
          },
        },
      ]
    );
  }, [appointmentId, doctorName]);

  const handleEndCall = useCallback(() => {
    setIsCallActive(false);
    setIsMuted(false);
    setIsVideoEnabled(true);
    Alert.alert('Call Ended', 'The consultation has ended.');
  }, []);

  const handleToggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    // TODO: Implement actual mute logic
  }, []);

  const handleToggleVideo = useCallback(() => {
    setIsVideoEnabled(prev => !prev);
    // TODO: Implement actual video toggle logic
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.videoContainer}>
        {/* Local Video Placeholder */}
        <View style={styles.localVideoContainer}>
          <View style={styles.videoPlaceholder}>
            <Text style={styles.placeholderText}>Your Video</Text>
          </View>
        </View>

        {/* Remote Video Placeholder */}
        <View style={styles.remoteVideoContainer}>
          <View style={styles.videoPlaceholder}>
            <Text style={styles.placeholderText}>{doctorName}</Text>
            <Text style={styles.statusText}>
              {isCallActive ? 'Connected' : 'Waiting to connect...'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.controlButtonDisabled]}
          onPress={handleToggleMute}
          activeOpacity={0.8}
        >
          <Text style={styles.controlButtonText}>
            {isMuted ? 'Unmute' : 'Mute'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, !isVideoEnabled && styles.controlButtonDisabled]}
          onPress={handleToggleVideo}
          activeOpacity={0.8}
        >
          <Text style={styles.controlButtonText}>
            {isVideoEnabled ? 'Stop Video' : 'Start Video'}
          </Text>
        </TouchableOpacity>

        {isCallActive ? (
          <TouchableOpacity
            style={styles.endCallButton}
            onPress={handleEndCall}
            activeOpacity={0.8}
          >
            <Text style={styles.endCallButtonText}>End Call</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.startCallButton}
            onPress={handleStartCall}
            activeOpacity={0.8}
          >
            <Text style={styles.startCallButtonText}>Start Call</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  localVideoContainer: {
    width: '40%',
    height: '30%',
    alignSelf: 'flex-end',
  },
  remoteVideoContainer: {
    width: '100%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#555',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusText: {
    color: '#ccc',
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  controlButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    minWidth: 80,
  },
  controlButtonDisabled: {
    backgroundColor: '#666',
  },
  controlButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  startCallButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    minWidth: 100,
  },
  startCallButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  endCallButton: {
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    minWidth: 100,
  },
  endCallButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ConsultScreen;
