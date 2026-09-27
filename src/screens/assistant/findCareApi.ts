import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import api from '../../utilis/api';

export interface CareSuggestion {
  doctor: {
    userId: string;
    fullName: string;
    specialization: string;
    experience?: number;
    gender?: string;
    languages?: string[];
    profileImage?: string;
  };
  date: string;
  slot: string;
}

export interface CareUnderstanding {
  summary: string;
  specialty: string;
  urgency: 'emergency' | 'urgent' | 'routine';
  day: string | null;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'any';
  doctorGender: string | null;
  language: string | null;
}

export type CareResult =
  | { type: 'emergency'; crisis: boolean; reasons: string[]; understanding: CareUnderstanding }
  | {
      type: 'suggestions';
      understanding: CareUnderstanding;
      suggestions: CareSuggestion[];
      relaxed: ('doctorGender' | 'language')[];
      widened: boolean;
      disclaimer: string;
    };

/** Sends the patient's words plus their local date and hour, so "today" and past times are theirs. */
export const findCare = async (message: string): Promise<CareResult> => {
  const token = await AsyncStorage.getItem('token');
  const res = await api.post(
    '/ai/find-care',
    { message, clientDate: moment().format('YYYY-MM-DD'), clientHour: new Date().getHours() },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data.data;
};
