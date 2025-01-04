import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Alert,
} from 'react-native';
import { bookAppointment } from '../../redux/actions/doctorActions';
import COLORS from '../../utilis/colors';

const AppointmentBookingScreen = ({ route, navigation }) => {
  console.log(route,"jj");
  
    const dispatch = useDispatch();
    const { doctorId } = route.params; // Ensure doctorId is passed from the previous screen.

    const [healthIssue, setHealthIssue] = useState('');
    const [checkupTiming, setCheckupTiming] = useState('');
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');

    const { appointment, error, loading } = useSelector((state) => state.appointment);

    const handleBooking = () => {
        if (!healthIssue || !checkupTiming || !notes || !date) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        const appointmentData = {
            healthIssue,
            checkupTiming,
            doctor: doctorId,
            notes,
            date,
        };

        dispatch(bookAppointment(appointmentData));
    };

    if (appointment && !loading) {
        Alert.alert(
            'Success',
            'Appointment booked successfully!',
            [{ text: 'OK', onPress: () => navigation.goBack() }],
            { cancelable: false }
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Book Appointment</Text>
            {error && <Text style={styles.error}>{error}</Text>}
            <TextInput
                style={styles.input}
                placeholder="Health Issue"
                value={healthIssue}
                onChangeText={setHealthIssue}
            />
            <TextInput
                style={styles.input}
                placeholder="Checkup Timing (e.g., 6-7)"
                value={checkupTiming}
                onChangeText={setCheckupTiming}
            />
            <TextInput
                style={styles.input}
                placeholder="Appointment Date (YYYY-MM-DD)"
                value={date}
                onChangeText={setDate}
            />
            <TextInput
                style={styles.input}
                placeholder="Notes"
                value={notes}
                onChangeText={setNotes}
                multiline
            />
            <TouchableOpacity
                style={styles.bookButton}
                onPress={handleBooking}
                disabled={loading}
            >
                <Text style={styles.bookButtonText}>
                    {loading ? 'Booking...' : 'Book Appointment'}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.white,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: COLORS.grey,
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 8,
        fontSize: 16,
    },
    bookButton: {
        backgroundColor: COLORS.primary,
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookButtonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    error: {
        color: 'red',
        marginBottom: 16,
        textAlign: 'center',
    },
});

export default AppointmentBookingScreen;
