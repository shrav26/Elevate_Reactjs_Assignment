// File: src/app/providers.tsx

'use client';

import { ApolloProvider } from '@apollo/client';
import { client } from '../lib/apollo-client';

export function Providers({ children }: { children: React.ReactNode }) {
  // Pass the client instance directly, without calling it as a function
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
