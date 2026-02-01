import { databaseName } from '@/constants/database';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { seedOfficialBands } from '@/db/seed';
import migrations from '@/drizzle/migrations';
import { logger } from '@/utils/logger';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Stack } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { SQLiteProvider } from 'expo-sqlite';
import { Suspense, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

const expo = SQLite.openDatabaseSync(databaseName, { enableChangeListener: true });
const db = drizzle(expo);

const queryClient = new QueryClient();

logger.info('App has started');

const RootLayout = () => {
  const { success, error } = useMigrations(db, migrations);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);

  useEffect(() => {
    if (success && !isSeeding) {
      setIsSeeding(true);
      seedOfficialBands(db)
        .then((wasSeeded) => {
          if (wasSeeded) {
            logger.debug('[App] Database seeded successfully');
          }
          setIsSeeding(false);
        })
        .catch((err) => {
          logger.error('[App] Seed error:', err);
          setSeedError(err.message);
          setIsSeeding(false);
        });
    }
  }, [isSeeding, success]);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (seedError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Seed error: {seedError}</Text>
      </View>
    );
  }

  if (!success || isSeeding) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16 }}>
          {!success ? 'Running migrations...' : 'Initializing database...'}
        </Text>
      </View>
    );
  }

  return (
    <ThemeProvider>
      <Suspense fallback={<ActivityIndicator size={'large'} />}>
        <QueryClientProvider client={queryClient}>
          <SQLiteProvider databaseName={databaseName}>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </SQLiteProvider>
        </QueryClientProvider>
      </Suspense>
    </ThemeProvider>
  );
};

export default RootLayout;
