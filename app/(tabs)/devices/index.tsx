import DeviceList from '@/components/Device/DeviceList';
import { Button } from '@/components/ui/Button';
import { spacing } from '@/constants/Layout';
import { DeviceScreenProvider } from '@/contexts/DeviceContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useDevices } from '@/hooks/useDevices';
import { DeviceType, type Device } from '@/types';
import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const DevicesScreen = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const { data: devices, isLoading } = useDevices();

  const handleAddDevice = () => {
    router.push('/(tabs)/devices/add');
  };

  const vtxDevices = devices?.filter((d: Device) => d.type === DeviceType.VTX);
  const vrxDevices = devices?.filter((d: Device) => d.type === DeviceType.VRX);

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} accessibilityHint="loading" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Button onPress={handleAddDevice} style={styles.addButton}>
        Add New Device
      </Button>

      <DeviceScreenProvider>
        <DeviceList data={vtxDevices} variant={DeviceType.VTX} />
        <DeviceList data={vrxDevices} variant={DeviceType.VRX} />
      </DeviceScreenProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButton: {
    marginBottom: spacing.xl,
  },
});

export default DevicesScreen;
