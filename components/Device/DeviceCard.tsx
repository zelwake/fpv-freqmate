import { Card } from '@/components/ui/Card';
import { spacing } from '@/constants/Layout';
import { DeviceScreenContext } from '@/contexts/DeviceContext';
import { useTheme } from '@/contexts/ThemeContext';
import { DeviceType, type Device } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DeviceCardProps {
  device: Device;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const DeviceCard = ({ device, onEdit, onDelete }: DeviceCardProps) => {
  const { colors } = useTheme();
  const { mode } = useContext(DeviceScreenContext);

  const typeLabel = device.type;
  const typeColor = device.type === DeviceType.VTX ? '#FF6B6B' : '#4ECDC4';

  return (
    <TouchableOpacity
      onPress={mode === 'edit' ? onEdit : onDelete}
      disabled={!onEdit}
      activeOpacity={0.7}
      accessibilityHint={mode === 'edit' ? 'editing' : 'deleting'}
    >
      <Card
        style={[
          styles.card,
          mode === 'delete' && { backgroundColor: colors.errorLight, borderColor: colors.error },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View
              style={[styles.typeBadge, { backgroundColor: typeColor }]}
              accessibilityLabel="device-card-badge"
            >
              <Text style={styles.typeBadgeText}>{typeLabel}</Text>
            </View>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {device.name}
            </Text>
          </View>
          {mode === 'edit'
            ? onEdit && (
                <View style={styles.footer}>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </View>
              )
            : null}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
