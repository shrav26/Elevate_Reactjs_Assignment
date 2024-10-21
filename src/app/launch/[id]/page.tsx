'use client'

import { useQuery, gql, ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import Link from 'next/link';

// Create Apollo Client instance
const client = new ApolloClient({
  uri: 'https://spacex-production.up.railway.app/', // Correct GraphQL endpoint
  cache: new InMemoryCache(),
});

const GET_LAUNCH = gql`
  query GetLaunch($id: ID!) {
    launch(id: $id) {
      mission_name
      launch_date_local
      launch_success
      details
      links {
        article_link
        video_link
      }
    }
  }
`;

type LaunchPageProps = {
  params: {
    id: string;
  };
};

// Create the main launch detail component
function LaunchDetail({ params }: LaunchPageProps) {
  console.log('Launch ID:', params.id); // Log the ID here

  const { loading, error, data } = useQuery(GET_LAUNCH, {
    variables: { id: params.id },
  });

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: {error.message}</p>
          <Link href="/" className="mt-4 inline-block text-blue-500 hover:underline">
            Back to Launches
          </Link>
        </div>
      </div>
    );
  }

  const { launch } = data;

  return (
    <div
      className="w-screen h-screen bg-[url('https://cdn.cfr.org/sites/default/files/styles/immersive_image_3_2_desktop_2x/public/image/2021/09/SpaceExploration_BG.webp')] bg-cover bg-center"
    >
   
    <div className="bg-white bg-opacity-30 backdrop-blur-lg rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
      
        <h1 className="text-3xl font-bold mb-4 text-blue font-bold">{launch.mission_name}</h1>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-black-600">Launch Date:</span>
            <span className="font-medium">
              {new Date(launch.launch_date_local).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-black-600">Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              launch.launch_success === null
                ? 'bg-yellow-100 text-yellow-800'
                : launch.launch_success
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {launch.launch_success === null ? 'Upcoming' : launch.launch_success ? 'Success' : 'Failed'}
            </span>
          </div>

          {launch.details && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">Mission Details</h2>
              <p className="text-black-600 leading-relaxed">{launch.details}</p>
            </div>
          )}

          {(launch.links.article_link || launch.links.video_link) && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">Related Links</h2>
              <div className="flex space-x-4">
                {launch.links.article_link && (
                  <a
                    href={launch.links.article_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                    </svg>
                    Read Article
                  </a>
                )}
                {launch.links.video_link && (
                  <a
                    href={launch.links.video_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Watch Video
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-gray-200">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors font-bold"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Launches
            </Link>
          </div>
        </div>
      </div>
    </div>
    
  );
}

// Wrap the component with ApolloProvider
export default function LaunchPageWrapper({ params }: LaunchPageProps) {
  return (
    <ApolloProvider client={client}>
      <LaunchDetail params={params} />
    </ApolloProvider>
  );
}
