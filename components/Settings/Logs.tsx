import { useTheme } from '@/contexts/ThemeContext';
import { clearLogs, getLogSize, logger, shareLogs } from '@/utils/logger';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Logs = () => {
  const { colors } = useTheme();
  const [logSize, setLogSize] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const internalId = setInterval(() => loadLogSize(), 60_000);

    return () => {
      clearInterval(internalId);
    };
  }, []);

  const loadLogSize = async () => {
    const size = await getLogSize();
    setLogSize(size);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const handleShareLogs = async () => {
    try {
      setIsLoading(true);
      await shareLogs();
    } catch (error) {
      const errorMessage = 'Failed to share logs. Please try again.';
      Alert.alert('Error', errorMessage);
      logger.error(errorMessage, { error });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearLogs = () => {
    Alert.alert('Clear Logs', 'Are you sure you want to delete all logs?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          try {
            setIsLoading(true);
            await clearLogs();
            await loadLogSize();
            Alert.alert('Success', 'All logs have been cleared');
          } catch (error) {
            const errorMessage = 'Failed to clear logs';
            Alert.alert('Error', errorMessage);
            logger.error(errorMessage, { error });
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  const handleGenerateTestLogs = () => {
    logger.debug('This is a debug message', { test: true, timestamp: Date.now() });
    logger.info('This is an info message', { userId: 123, action: 'test' });
    logger.warn('This is a warning message', { warningType: 'test' });
    logger.error('This is an error message', { error: 'Test error', stack: 'fake stack' });

    setTimeout(() => {
      loadLogSize();
      Alert.alert('Success', '4 test logs generated');
    }, 500);
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Application Logs</Text>
      <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
        Logs help diagnose issues. You can share them with support if something goes wrong.
      </Text>

      <View style={styles.logInfo}>
        <Text style={[styles.logInfoText, { color: colors.textSecondary }]}>
          Current size: {formatBytes(logSize)}
        </Text>
        <Text style={[styles.logInfoText, { color: colors.textSecondary }]}>
          Max size: 3 MB (auto-rotated)
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleShareLogs}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Share Logs</Text>
        )}
      </TouchableOpacity>

      {__DEV__ && (
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton, { borderColor: colors.primary }]}
          onPress={handleGenerateTestLogs}
          disabled={isLoading}
        >
          <Text style={[styles.buttonText, { color: colors.primary }]}>Generate Test Logs</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button, styles.dangerButton, { borderColor: colors.error }]}
        onPress={handleClearLogs}
        disabled={isLoading}
      >
        <Text style={[styles.buttonText, { color: colors.error }]}>Clear All Logs</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  logInfo: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  logInfoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  dangerButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Logs;
