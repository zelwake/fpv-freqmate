import { Card } from '@/components/ui/Card';
import { spacing } from '@/constants/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { DeviceType, type Device } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DeviceCardProps {
  device: Device;
  onPress?: () => void;
  onDelete?: () => void;
}

export const DeviceCard = ({ device, onPress, onDelete }: DeviceCardProps) => {
  const { colors } = useTheme();

  const typeLabel = device.type;
  const typeColor = device.type === DeviceType.VTX ? '#FF6B6B' : '#4ECDC4';

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
              <Text style={styles.typeBadgeText}>{typeLabel}</Text>
            </View>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {device.name}
            </Text>
          </View>
          {onDelete && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>

        {onPress && (
          <View style={styles.footer}>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </View>
        )}
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
    alignItems: 'flex-start',
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
  deleteButton: {
    padding: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
  },
});
