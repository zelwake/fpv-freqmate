import { useDevices } from '@/hooks/useDevices';
import { DeviceType } from '@/types/index';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from './ui/Dropdown';

interface DeviceSelectorProps {
  type: DeviceType;
  value: number | null;
  onChange: (deviceId: number | null) => void;
}

export function DeviceSelector({ type, value, onChange }: DeviceSelectorProps) {
  const { data: devices, isLoading } = useDevices(type);

  const items =
    devices?.map((device) => ({
      label: device.name,
      value: device.id,
    })) || [];

  const handleChange = (newValue: string | number) => {
    if (newValue === '') {
      onChange(null);
    } else {
      onChange(Number(newValue));
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading {type} devices...</Text>
      </View>
    );
  }

  if (!devices || devices.length === 0) {
    return (
      <View style={styles.container}>
        <Dropdown
          label={`${type} Device`}
          value=""
          onValueChange={() => {}}
          items={[]}
          placeholder={`No ${type} devices - add one first`}
          enabled={false}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Dropdown
        label={`${type} Device`}
        value={value ?? ''}
        onValueChange={handleChange}
        items={items}
        placeholder={`Select ${type} device`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
