import React from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FF6B35',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Scan QR Code',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="menu/[tableId]"
          options={{
            title: 'Menu',
          }}
        />
        <Stack.Screen
          name="cart"
          options={{
            title: 'Cart',
          }}
        />
        <Stack.Screen
          name="order/[orderId]"
          options={{
            title: 'Order Status',
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
