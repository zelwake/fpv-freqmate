import { BandLabelEditor } from '@/components/BandLabelEditor';
import { BandSelector } from '@/components/BandSelector';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Input } from '@/components/ui/Input';
import { spacing } from '@/constants/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { useDevice, useUpdateDevice } from '@/hooks/useDevices';
import type { DeviceType } from '@/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const EditDeviceScreen = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const deviceId = parseInt(id, 10);

  const { data: device, isLoading: isLoadingDevice } = useDevice(deviceId);
  const updateDevice = useUpdateDevice();

  const [name, setName] = useState('');
  const [type, setType] = useState<DeviceType>('VTX');
  const [selectedBandIds, setSelectedBandIds] = useState<number[]>([]);
  const [bandLabels, setBandLabels] = useState<Record<number, string>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    bands?: string;
  }>({});

  useEffect(() => {
    if (device && !isInitialized) {
      setName(device.name);
      setType(device.type);
      setSelectedBandIds(device.bands.map((b) => b.bandId));
      // Initialize band labels from existing device
      const labels: Record<number, string> = {};
      device.bands.forEach((b) => {
        labels[b.bandId] = b.bandLabel;
      });
      setBandLabels(labels);
      setIsInitialized(true);
    }
  }, [device, isInitialized]);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Device name is required';
    }

    if (selectedBandIds.length === 0) {
      newErrors.bands = 'Please select at least one band';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    updateDevice.mutate(
      {
        deviceId,
        input: {
          name: name.trim(),
          type,
          bandIds: selectedBandIds,
          bandLabels,
        },
      },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Device updated successfully');
          router.back();
        },
        onError: (error) => {
          Alert.alert('Error', error.message || 'Failed to update device');
        },
      }
    );
  };

  if (isLoadingDevice || !device) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        {!device && !isLoadingDevice && (
          <Text style={[styles.errorText, { color: colors.error }]}>Device not found</Text>
        )}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Device Name *"
          placeholder="e.g., TBS Unify Pro32"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (errors.name) setErrors({ ...errors, name: undefined });
          }}
          error={errors.name}
        />

        <Dropdown
          label="Device Type *"
          value={type}
          onChange={(value) => setType(value as DeviceType)}
          options={[
            { label: 'VTX (Transmitter)', value: 'VTX' },
            { label: 'VRX (Receiver)', value: 'VRX' },
          ]}
        />

        <BandSelector
          label="Supported Bands *"
          selectedBandIds={selectedBandIds}
          onChange={(ids) => {
            setSelectedBandIds(ids);
            if (errors.bands) setErrors({ ...errors, bands: undefined });
          }}
          error={errors.bands}
        />

        {selectedBandIds.length > 0 && (
          <BandLabelEditor
            label="Band Labels (optional)"
            selectedBandIds={selectedBandIds}
            bandLabels={bandLabels}
            onChange={setBandLabels}
          />
        )}

        <View style={styles.buttonContainer}>
          <Button onPress={() => router.back()} variant="secondary" style={styles.button}>
            Cancel
          </Button>
          <Button onPress={handleSave} disabled={updateDevice.isPending} style={styles.button}>
            {updateDevice.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  content: {
    padding: spacing.lg,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  button: {
    flex: 1,
  },
  errorText: {
    marginTop: spacing.md,
    fontSize: 14,
  },
});

export default EditDeviceScreen;
