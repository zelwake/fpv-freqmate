import { databaseName } from '@/constants/database';
import { drizzle } from 'drizzle-orm/expo-sqlite';
// import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { SQLiteProvider } from 'expo-sqlite';
import { Suspense } from 'react';
import { ActivityIndicator } from 'react-native';
// import { ActivityIndicator, View, Text } from 'react-native';
// import migrations from './drizzle/migrations';

const expo = SQLite.openDatabaseSync(databaseName, { enableChangeListener: true });
const db = drizzle(expo);

const queryClient = new QueryClient();

const RootLayout = () => {
  // TODO uncomment when migrations are done
  // const { success, error } = useMigrations(db, migrations);

  // if (error) {
  //   return (
  //     <View>
  //       <Text>Migration error: {error.message}</Text>
  //     </View>
  //   );
  // }

  // if (!success) {
  //   return (
  //     <View>
  //       <Text>Migration is in progress...</Text>
  //     </View>
  //   );
  // }

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
