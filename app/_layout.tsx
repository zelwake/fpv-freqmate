import { databaseName } from '@/constants/database';
import { seedOfficialBands } from '@/db/seed';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { SQLiteProvider } from 'expo-sqlite';
import { Suspense, useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import migrations from '@/drizzle/migrations';

const expo = SQLite.openDatabaseSync(databaseName, { enableChangeListener: true });
const db = drizzle(expo);

const queryClient = new QueryClient();

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
            console.log('[App] Database seeded successfully');
          }
          setIsSeeding(false);
        })
        .catch((err) => {
          console.error('[App] Seed error:', err);
          setSeedError(err.message);
          setIsSeeding(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

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
    <Suspense fallback={<ActivityIndicator size={'large'} />}>
      <QueryClientProvider client={queryClient}>
        <SQLiteProvider databaseName={databaseName}>
          <Stack />
        </SQLiteProvider>
      </QueryClientProvider>
    </Suspense>
  );
};

export default RootLayout;
