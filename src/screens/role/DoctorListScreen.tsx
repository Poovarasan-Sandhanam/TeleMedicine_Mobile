import React, { useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchCompletedDoctors } from '../../redux/slices/profileSlice';
import { useTheme, space, radius, specialtyHue, specialtyIcon, shortSpecialty, withAlpha } from '../../theme';
import { AppText, Avatar, Card, EmptyState, IconButton, Reveal, Screen, Skeleton } from '../../ui';

const DoctorRow: React.FC<{ doctor: any; index: number; onPress: () => void }> = ({ doctor, index, onPress }) => {
  const { colors } = useTheme();
  const hue = specialtyHue(doctor.specialization);
  const name = doctor.fullName ?? doctor.name;
  return (
    <Reveal index={index}>
      <Card onPress={onPress} style={styles.card} accessibilityLabel={`${name}, ${doctor.specialization}. Book appointment`}>
        <View style={styles.row}>
          <Avatar name={name} uri={doctor.profileImage} size={60} ring />
          <View style={styles.info}>
            <AppText variant="h3" numberOfLines={1}>{name}</AppText>
            <View style={[styles.spec, { backgroundColor: withAlpha(hue, 0.12) }]}>
              <MCI name={specialtyIcon(doctor.specialization)} size={13} color={hue} />
              <AppText variant="caption" rawColor={hue} style={styles.specText} numberOfLines={1}>
                {shortSpecialty(doctor.specialization)}
              </AppText>
            </View>
          </View>
          <View style={[styles.go, { backgroundColor: colors.primary }]}>
            <Icon name="arrow-forward" size={18} color={colors.onPrimary} />
          </View>
        </View>
        <View style={[styles.meta, { borderTopColor: colors.border }]}>
          <View style={styles.metaItem}>
            <Icon name="ribbon-outline" size={15} color={colors.textMuted} />
            <AppText variant="caption" color="textMuted" style={styles.metaText}>{doctor.experience ?? 0} yrs exp.</AppText>
          </View>
          <View style={styles.metaItem}>
            <Icon name="time-outline" size={15} color={colors.textMuted} />
            <AppText variant="caption" color="textMuted" style={styles.metaText} numberOfLines={1}>
              {(doctor.consultationTiming ?? '').replace(/\s*\(.*\)$/, '')}
            </AppText>
          </View>
        </View>
        {doctor.address ? (
          <View style={styles.metaItem}>
            <Icon name="location-outline" size={15} color={colors.textMuted} />
            <AppText variant="caption" color="textMuted" style={styles.metaText} numberOfLines={1}>{doctor.address}</AppText>
          </View>
        ) : null}
      </Card>
    </Reveal>
  );
};

export default function DoctorsScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { colors } = useTheme();
  const { completedDoctors, loading, error } = useAppSelector(s => s.profile);
  const { category } = route.params || {};

  const load = useCallback(() => {
    dispatch(fetchCompletedDoctors() as any);
  }, [dispatch]);
  useFocusEffect(load);

  // Only the chosen specialty. When nothing matched, this used to fall back to
  // every doctor, listing other specialists under this heading.
  const doctors = useMemo(
    () => (category
      ? completedDoctors.filter((d: any) => d.specialization?.toLowerCase() === String(category).toLowerCase())
      : completedDoctors),
    [completedDoctors, category],
  );

  const hue = category ? specialtyHue(category) : colors.primary;
  const title = category ? shortSpecialty(category) : 'All doctors';

  return (
    <Screen>
      <View style={styles.header}>
        <IconButton icon="chevron-back" label="Back" onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <AppText variant="h2" numberOfLines={1}>{title}</AppText>
          <AppText variant="caption" color="textMuted">
            {loading && doctors.length === 0 ? 'Loading...' : `${doctors.length} ${doctors.length === 1 ? 'doctor' : 'doctors'} available`}
          </AppText>
        </View>
        {category ? (
          <View style={[styles.headerIcon, { backgroundColor: withAlpha(hue, 0.14) }]}>
            <MCI name={specialtyIcon(category)} size={24} color={hue} />
          </View>
        ) : null}
      </View>

      {loading && doctors.length === 0 ? (
        <View style={styles.list}>
          {[0, 1, 2].map(i => <Skeleton key={i} height={150} style={styles.skeleton} />)}
        </View>
      ) : error && doctors.length === 0 ? (
        <EmptyState icon="cloud-offline-outline" tone="error" title="Couldn't load doctors" message={error} actionLabel="Try again" onAction={load} />
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={item => item._id ?? item.userId}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={false} onRefresh={load} tintColor={colors.primary} />}
          renderItem={({ item, index }) => (
            <DoctorRow doctor={item} index={index} onPress={() => navigation.navigate('AppointmentBooking', { doctor: item })} />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="medkit-outline"
              title={category ? `No ${title.toLowerCase()} doctors yet` : 'No doctors yet'}
              message="Check back soon - new doctors join regularly."
              actionLabel={category ? 'See all doctors' : undefined}
              onAction={category ? () => navigation.setParams({ category: undefined }) : undefined}
            />
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.lg, paddingTop: space.xs, paddingBottom: space.md },
  headerText: { flex: 1, marginLeft: space.sm },
  headerIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: space.lg, paddingBottom: space.xxxl, gap: space.sm },
  skeleton: { borderRadius: radius.lg },
  card: {},
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, marginLeft: space.sm },
  spec: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill, marginTop: 4 },
  specText: { marginLeft: 4 },
  go: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  meta: { flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth, marginTop: space.md, paddingTop: space.sm, gap: space.lg, marginBottom: 6 },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaText: { marginLeft: 5, flexShrink: 1 },
});
