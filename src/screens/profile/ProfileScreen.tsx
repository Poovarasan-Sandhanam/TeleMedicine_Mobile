import React, { useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchProfile, updateProfile } from '../../redux/slices/profileSlice';
import { fetchDoctorTypes } from '../../redux/slices/doctorTypeSlice';
import { LOGOUT } from '../../redux/store';
import { clearSession } from '../../session/session';
import { logout } from '../../redux/slices/authSlice';
import { resetTo } from '../../navigation/navigationRef';
import { TAB_BAR_CLEARANCE } from '../../navigation/FloatingTabBar';
import {
  GenderEnum, MedicalConditionsEnum, BloodGroupEnum, OngoingTreatmentEnum, ConsultEnum, WeightEnum,
} from '../../utilis/enums';
import { useTheme, space, radius, shortSpecialty } from '../../theme';
import {
  AppText, Avatar, Button, Card, EmptyState, HeroHeader, IconButton, PressScale, Reveal, Segmented, SelectField, TextField,
} from '../../ui';
import { ActivityIndicator } from 'react-native';

interface ProfileImage { uri: string; type: string; name: string }

interface FormDataType {
  name: string; age: string; gender: string; email: string; contactNumber: string; address: string;
  bloodGroup: string; weight: string; height: string; ongoingTreatment: string; healthIssues: string;
  specialized: string; experience: string; consultationTiming: string; licenseNumber: string;
  profileImage: ProfileImage | null;
}

const EMPTY: FormDataType = {
  name: '', age: '', gender: '', email: '', contactNumber: '', address: '', bloodGroup: '', weight: '', height: '',
  ongoingTreatment: '', healthIssues: '', specialized: '', experience: '', consultationTiming: '', licenseNumber: '',
  profileImage: null,
};

const InfoRow: React.FC<{ icon: string; label: string; value?: string; last?: boolean }> = ({ icon, label, value, last }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.infoRow, !last && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <View style={[styles.infoIcon, { backgroundColor: colors.primarySoft }]}>
        <Icon name={icon} size={17} color={colors.primary} />
      </View>
      <View style={styles.flex}>
        <AppText variant="caption" color="textMuted">{label}</AppText>
        <AppText variant="bodyStrong" color={value ? 'text' : 'textSubtle'}>{value || 'Not set'}</AppText>
      </View>
    </View>
  );
};

const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { colors, schemePreference, setSchemePreference } = useTheme();
  const { profile, loading: profileLoading, error: profileError } = useAppSelector(state => state.profile);
  const { doctorTypes, loading: doctorTypesLoading } = useAppSelector(state => state.doctorTypes);
  const [formData, setFormData] = useState<FormDataType>(EMPTY);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile() as any);
    dispatch(fetchDoctorTypes() as any);
  }, [dispatch]);

  const fromProfile = useMemo((): FormDataType => (profile ? {
    name: profile.name || '',
    age: profile.age?.toString() || '',
    email: profile.email || '',
    contactNumber: profile.contactNumber || '',
    address: profile.address || '',
    gender: profile.gender || '',
    bloodGroup: profile.bloodGroup || '',
    weight: profile.weight || '',
    height: profile.height?.toString() || '',
    ongoingTreatment: profile.ongoingTreatment || '',
    healthIssues: profile.healthIssues || '',
    specialized: profile.specialized || '',
    experience: profile.experience?.toString() || '',
    consultationTiming: profile.consultationTiming || '',
    licenseNumber: profile.licenseNumber || '',
    profileImage: profile.profileImage ? { uri: profile.profileImage, type: 'image/jpeg', name: 'profile.jpg' } : null,
  } : EMPTY), [profile]);

  useEffect(() => { setFormData(fromProfile); }, [fromProfile]);

  const set = (key: keyof FormDataType) => (value: string) => setFormData(prev => ({ ...prev, [key]: value }));

  // The picker submits `id`; tile ids are not valid specialties, so offer the
  // exact specialty name each tile carries.
  const specialtyOptions = doctorTypes.map(t => ({ id: t.specialization ?? t.title, title: t.title }));

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (res: ImagePickerResponse) => {
      const img = res.assets?.[0];
      if (img?.uri) {
        setFormData(prev => ({ ...prev, profileImage: { uri: img.uri!, type: img.type || 'image/jpeg', name: img.fileName || 'profile.jpg' } }));
      }
    });
  };

  const isDoctor = !!profile?.isDoctor;

  const validate = () => {
    const f = formData;
    const required: [string, string][] = isDoctor
      ? [['name', 'Name'], ['age', 'Age'], ['gender', 'Gender'], ['contactNumber', 'Phone'], ['address', 'Clinic address'],
         ['specialized', 'Specialty'], ['experience', 'Experience'], ['consultationTiming', 'Consultation hours']]
      : [['name', 'Name'], ['age', 'Age'], ['gender', 'Gender'], ['contactNumber', 'Phone'], ['address', 'Address'],
         ['bloodGroup', 'Blood group'], ['weight', 'Weight'], ['height', 'Height']];
    const missing = required.filter(([k]) => !String((f as any)[k] ?? '').trim()).map(([, l]) => l);
    if (missing.length) {
      Toast.show({ type: 'error', text1: 'A few details are missing', text2: missing.join(', ') });
      return false;
    }
    const ageNum = Number(f.age);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      Toast.show({ type: 'error', text1: 'Check your age', text2: 'Enter a number between 1 and 120.' });
      return false;
    }
    if (f.contactNumber.replace(/\D/g, '').length < 10) {
      Toast.show({ type: 'error', text1: 'Check your phone number', text2: 'It needs at least 10 digits.' });
      return false;
    }
    return true;
  };

  const save = async () => {
    if (!validate()) {
      return;
    }
    const data = new FormData();
    // Only upload a newly picked photo. The current photo's web address was
    // re-sent as a "file" on every save.
    const img = formData.profileImage;
    if (img && !/^https?:/i.test(img.uri)) {
      data.append('profileImage', { uri: img.uri, type: img.type, name: img.name } as any);
    }
    Object.entries(formData).forEach(([key, value]) => {
      // email is not editable server-side; specialized is sent as `specialization`.
      if (key === 'profileImage' || key === 'email') {
        return;
      }
      data.append(key === 'specialized' ? 'specialization' : key, String(value ?? ''));
    });
    setSaving(true);
    const res = await dispatch(updateProfile(data) as any);
    setSaving(false);
    if (!res.error) {
      Toast.show({ type: 'success', text1: 'Profile saved' });
      setEditMode(false);
      dispatch(fetchProfile() as any);
    } else {
      Toast.show({ type: 'error', text1: 'Could not save', text2: res.payload || 'Please try again.' });
    }
  };

  const signOut = () =>
    Alert.alert('Sign out?', 'You will need to sign in again to see your bookings.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          // Order matters: logout() must run while the token is still in storage,
          // because the request interceptor reads it from there. Clearing first
          // would send an unauthenticated request and leave the token valid on the
          // server for the rest of its 48 hours.
          await dispatch(logout());
          await clearSession();
          dispatch({ type: LOGOUT });
          resetTo('Login');
        },
      },
    ]);

  if (profileLoading || doctorTypesLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <AppText variant="body" color="textMuted" style={styles.loadingText}>Loading profile...</AppText>
      </View>
    );
  }

  // With no profile loaded, an editable empty form would let a failed fetch be saved
  // over the real profile. Offer a retry instead.
  if (!profile) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <EmptyState
          icon="cloud-offline-outline"
          tone="error"
          title="No profile data available"
          message={profileError || undefined}
          actionLabel="Retry"
          onAction={() => dispatch(fetchProfile() as any)}
        />
      </View>
    );
  }

  const roleLabel = isDoctor
    ? `Doctor${profile.specialized ? ` · ${shortSpecialty(profile.specialized)}` : ''}`
    : 'Patient';

  return (
    <View style={[styles.flex, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <HeroHeader minHeight={250}>
            <View style={styles.heroTop}>
              <AppText variant="h2" rawColor="#FFFFFF">Profile</AppText>
              <IconButton
                glass
                icon={editMode ? 'close' : 'create-outline'}
                label={editMode ? 'Cancel editing' : 'Edit profile'}
                onPress={() => { setFormData(fromProfile); setEditMode(v => !v); }}
              />
            </View>
            <Reveal from="zoom" style={styles.identity}>
              <PressScale onPress={editMode ? pickImage : undefined} disabled={!editMode} accessibilityRole="button" accessibilityLabel="Change photo">
                <View style={styles.avatarRing}>
                  <Avatar name={formData.name || profile.name} uri={formData.profileImage?.uri} size={92} glass />
                </View>
                {editMode ? (
                  <View style={[styles.camera, { backgroundColor: colors.surface }]}>
                    <Icon name="camera" size={16} color={colors.primary} />
                  </View>
                ) : null}
              </PressScale>
              <AppText variant="h2" rawColor="#FFFFFF" style={styles.heroName} numberOfLines={1}>{profile.name || 'Your name'}</AppText>
              <AppText variant="body" rawColor="rgba(255,255,255,0.85)">{profile.email}</AppText>
              <View style={styles.rolePill}>
                <Icon name={isDoctor ? 'medkit' : 'person'} size={13} color="#FFFFFF" />
                <AppText variant="caption" rawColor="#FFFFFF" style={styles.roleText}>{roleLabel}</AppText>
              </View>
            </Reveal>
          </HeroHeader>

          <View style={styles.body}>
            {editMode ? (
              <Reveal>
                <Card style={styles.formCard}>
                  <AppText variant="h3" style={styles.cardTitle}>Personal details</AppText>
                  <TextField label="Full name" icon="person-outline" value={formData.name} onChangeText={set('name')} />
                  <TextField label="Phone" icon="call-outline" value={formData.contactNumber} onChangeText={set('contactNumber')} keyboardType="phone-pad" />
                  <View style={styles.pair}>
                    <View style={styles.flex}><TextField label="Age" icon="calendar-outline" value={formData.age} onChangeText={set('age')} keyboardType="number-pad" /></View>
                    <View style={styles.flex}><SelectField label="Gender" value={formData.gender} options={GenderEnum} onChange={set('gender')} /></View>
                  </View>
                  <TextField label={isDoctor ? 'Clinic address' : 'Address'} icon="location-outline" value={formData.address} onChangeText={set('address')} />

                  <AppText variant="h3" style={styles.cardTitle}>{isDoctor ? 'Practice' : 'Health'}</AppText>
                  {isDoctor ? (
                    <>
                      <SelectField label="Specialty" icon="medkit-outline" value={formData.specialized} options={specialtyOptions} onChange={set('specialized')} />
                      <TextField label="Experience (years)" icon="ribbon-outline" value={formData.experience} onChangeText={set('experience')} keyboardType="number-pad" />
                      <SelectField label="Consultation hours" icon="time-outline" value={formData.consultationTiming} options={ConsultEnum} onChange={set('consultationTiming')} />
                      <TextField label="Medical license number" icon="shield-checkmark-outline" value={formData.licenseNumber} onChangeText={set('licenseNumber')} autoCapitalize="characters" />
                      <AppText variant="caption" color="textMuted" style={styles.hint}>Patients can find you once your license number is added.</AppText>
                    </>
                  ) : (
                    <>
                      <View style={styles.pair}>
                        <View style={styles.flex}><SelectField label="Blood group" value={formData.bloodGroup} options={BloodGroupEnum} onChange={set('bloodGroup')} /></View>
                        <View style={styles.flex}><SelectField label="Weight" value={formData.weight} options={WeightEnum} onChange={set('weight')} /></View>
                      </View>
                      <TextField label="Height (cm)" icon="resize-outline" value={formData.height} onChangeText={set('height')} keyboardType="number-pad" />
                      <SelectField label="Ongoing treatment" icon="medkit-outline" value={formData.ongoingTreatment} options={OngoingTreatmentEnum} onChange={set('ongoingTreatment')} />
                      <SelectField label="Main health concern" icon="fitness-outline" value={formData.healthIssues} options={MedicalConditionsEnum} onChange={set('healthIssues')} />
                    </>
                  )}
                  <Button title="Save Changes" icon="checkmark" loading={saving} onPress={save} style={styles.save} />
                  <Button title="Cancel" variant="ghost" size="md" onPress={() => { setFormData(fromProfile); setEditMode(false); }} style={styles.cancel} />
                </Card>
              </Reveal>
            ) : (
              <>
                <Reveal index={0}>
                  <Card>
                    <AppText variant="h3" style={styles.cardTitle}>Personal details</AppText>
                    <InfoRow icon="call-outline" label="Phone" value={profile.contactNumber} />
                    <InfoRow icon="calendar-outline" label="Age" value={profile.age ? `${profile.age} years` : ''} />
                    <InfoRow icon="person-outline" label="Gender" value={profile.gender} />
                    <InfoRow icon="location-outline" label={isDoctor ? 'Clinic address' : 'Address'} value={profile.address} last />
                  </Card>
                </Reveal>
                <Reveal index={1}>
                  <Card>
                    <AppText variant="h3" style={styles.cardTitle}>{isDoctor ? 'Practice' : 'Health'}</AppText>
                    {isDoctor ? (
                      <>
                        <InfoRow icon="medkit-outline" label="Specialty" value={profile.specialized} />
                        <InfoRow icon="ribbon-outline" label="Experience" value={profile.experience ? `${profile.experience} years` : ''} />
                        <InfoRow icon="time-outline" label="Consultation hours" value={profile.consultationTiming} />
                        <InfoRow icon="shield-checkmark-outline" label="License number" value={profile.licenseNumber} last />
                      </>
                    ) : (
                      <>
                        <InfoRow icon="water-outline" label="Blood group" value={profile.bloodGroup} />
                        <InfoRow icon="barbell-outline" label="Weight" value={profile.weight} />
                        <InfoRow icon="resize-outline" label="Height" value={profile.height ? `${profile.height} cm` : ''} />
                        <InfoRow icon="medkit-outline" label="Ongoing treatment" value={profile.ongoingTreatment} />
                        <InfoRow icon="fitness-outline" label="Health concerns" value={profile.healthIssues} last />
                      </>
                    )}
                  </Card>
                </Reveal>
                <Reveal index={2}>
                  <Button title="Edit Profile" icon="create-outline" variant="soft" onPress={() => setEditMode(true)} />
                </Reveal>
              </>
            )}

            <Reveal index={3}>
              <Card>
                <AppText variant="h3" style={styles.cardTitle}>Appearance</AppText>
                <Segmented
                  value={schemePreference}
                  onChange={k => setSchemePreference(k as 'system' | 'light' | 'dark')}
                  options={[{ key: 'system', label: 'System' }, { key: 'light', label: 'Light' }, { key: 'dark', label: 'Dark' }]}
                />
              </Card>
            </Reveal>
            <Reveal index={4}>
              <Button title="Sign out" icon="log-out-outline" variant="danger" onPress={signOut} />
            </Reveal>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: space.sm },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  identity: { alignItems: 'center', marginTop: space.sm },
  avatarRing: { padding: 4, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.25)' },
  camera: { position: 'absolute', right: 2, bottom: 2, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  heroName: { marginTop: space.sm },
  rolePill: {
    flexDirection: 'row', alignItems: 'center', marginTop: space.sm, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  roleText: { marginLeft: 6 },
  body: { paddingHorizontal: space.lg, marginTop: -space.xl, gap: space.md },
  formCard: { paddingTop: space.lg },
  cardTitle: { marginBottom: space.sm },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: space.sm },
  infoIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: space.sm },
  pair: { flexDirection: 'row', gap: space.sm },
  hint: { marginTop: -space.xs, marginBottom: space.sm, marginLeft: 2 },
  save: { marginTop: space.sm },
  cancel: { marginTop: space.xs },
});

export default ProfileScreen;
