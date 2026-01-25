import { DeviceCard } from '@/components/DeviceCard';
import { Button } from '@/components/ui/Button';
import { spacing } from '@/constants/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { useDeleteDevice, useDevices } from '@/hooks/useDevices';
import { DeviceType, type Device } from '@/types';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';

const DevicesScreen = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const { data: devices = [], isLoading } = useDevices();
  const deleteDevice = useDeleteDevice();

  const handleAddDevice = () => {
    router.push('/(tabs)/devices/add');
  };

  const handleEditDevice = (deviceId: number) => {
    router.push(`/(tabs)/devices/${deviceId}`);
  };

  const handleDeleteDevice = (device: Device) => {
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

  const vtxDevices = devices.filter((d: Device) => d.type === DeviceType.VTX);
  const vrxDevices = devices.filter((d: Device) => d.type === DeviceType.VRX);

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <Button onPress={handleAddDevice} style={styles.addButton}>
              Add New Device
            </Button>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              VTX Devices ({vtxDevices.length})
            </Text>
          </>
        }
        data={vtxDevices}
        keyExtractor={(item: Device) => `vtx-${item.id}`}
        renderItem={({ item }) => (
          <DeviceCard
            device={item}
            onPress={() => handleEditDevice(item.id)}
            onDelete={() => handleDeleteDevice(item)}
          />
        )}
        ListEmptyComponent={
          <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No VTX devices yet
            </Text>
          </View>
        }
        ListFooterComponent={
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              VRX Devices ({vrxDevices.length})
            </Text>
            {vrxDevices.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No VRX devices yet
                </Text>
              </View>
            ) : (
              vrxDevices.map((device: Device) => (
                <DeviceCard
                  key={`vrx-${device.id}`}
                  device={device}
                  onPress={() => handleEditDevice(device.id)}
                  onDelete={() => handleDeleteDevice(device)}
                />
              ))
            )}
          </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: spacing.lg,
  },
  addButton: {
    marginBottom: spacing.xl,
  },
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

export default DevicesScreen;
