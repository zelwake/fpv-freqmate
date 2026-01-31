import { spacing } from '@/constants/Layout';
import { DeviceScreenContext } from '@/contexts/DeviceContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useDeleteDevice } from '@/hooks/useDevices';
import { DeviceType, DeviceWithBands } from '@/types/index';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FC, useContext } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { DeviceCard } from './DeviceCard';

interface DeviceListProps {
  data: DeviceWithBands[] | undefined;
  variant: DeviceType;
}

const DeviceList: FC<DeviceListProps> = ({ data, variant }) => {
  const router = useRouter();
  const deleteDevice = useDeleteDevice();
  const { colors } = useTheme();
  const { mode, setMode } = useContext(DeviceScreenContext);

  const handleEditDevice = (deviceId: number) => {
    router.push(`/(tabs)/devices/${deviceId}`);
  };

  const handleDeleteDevice = (device: DeviceWithBands) => {
    Alert.alert('Delete Device', `Are you sure you want to delete "${device.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteDevice.mutate(device.id);
        },
      },
    ]);
  };

  return (
    <View>
      <FlatList
        ListHeaderComponent={
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingRight: 6,
            }}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {variant} Devices ({data?.length})
            </Text>
            {data && data.length > 0 && (
              <Pressable onPress={() => setMode(mode === 'edit' ? 'delete' : 'edit')}>
                {mode === 'edit' && (
                  <Ionicons name="trash-outline" size={24} color={colors.error} />
                )}
                {mode === 'delete' && (
                  <Ionicons name="checkmark-circle-outline" size={24} color={colors.success} />
                )}
              </Pressable>
            )}
          </View>
        }
        data={data}
        renderItem={({ item }) => (
          <DeviceCard
            device={item}
            onEdit={() => handleEditDevice(item.id)}
            onDelete={() => handleDeleteDevice(item)}
          />
        )}
        keyExtractor={({ id }) => `${variant}-${id}`}
        ListEmptyComponent={
          <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No {variant} devices yet
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default DeviceList;

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  emptyCard: {
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 14,
  },
});
