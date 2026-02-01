import Logs from '@/components/Settings/Logs';
import { useTheme } from '@/contexts/ThemeContext';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const SettingsScreen = () => {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

      <Logs />

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Other Settings</Text>
        <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
          Coming soon: Theme preferences, favorites, history, and manual
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
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
});

export default SettingsScreen;
