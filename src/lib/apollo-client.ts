import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

// Define the HTTP link for the GraphQL API endpoint
const httpLink = new HttpLink({
  uri: 'https://spacex-production.up.railway.app/', // Your GraphQL API endpoint
});

// Define error handling logic
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Create and export the Apollo Client instance
export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink, httpLink]), // Use both error handling and HTTP link
});
