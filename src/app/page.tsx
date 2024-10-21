'use client';

import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import Link from 'next/link';
import { client } from '../lib/apollo-client';
import { Rocket } from 'lucide-react';

const GET_LAUNCHES = gql`
  query GetLaunches($offset: Int!, $limit: Int!, $sort: String!, $order: String!) {
    launches(offset: $offset, limit: $limit, sort: $sort, order: $order) {
      id
      mission_name
      launch_date_local
      launch_success
    }
  }
`;

type Launch = {
  id: string;
  mission_name: string;
  launch_date_local: string;
  launch_success: boolean | null;
};

export default function Home() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [offset, setOffset] = useState(0);
  const [sort, setSort] = useState<'mission_name' | 'launch_date_local'>('launch_date_local');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [hasMore, setHasMore] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Background images array - replace with your actual image paths
  const backgroundImages = [
    "https://images.unsplash.com/photo-1517976384346-3136801d605d?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",  // Replace with your image paths
    "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1516849677043-ef67c9557e16?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D",
    "https://images.pexels.com/photos/586054/pexels-photo-586054.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/60126/pexels-photo-60126.jpeg?auto=compress&cs=tinysrgb&w=600"
  ];

  // Query for launches
  const { loading, error, data } = useQuery(GET_LAUNCHES, {
    variables: { offset, limit: 10, sort, order },
    client,
    onError: (error) => {
      console.error('Error fetching launches:', error);
    }
  });

  // Handle launches data
  useEffect(() => {
    if (data && data.launches) {
      setLaunches((prev) => [...prev, ...data.launches]);
      setHasMore(data.launches.length === 10);
    }
  }, [data]);

  // Slideshow effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const loadMore = () => {
    setOffset((prev) => prev + 10);
  };

  const handleSort = (newSort: 'mission_name' | 'launch_date_local') => {
    setSort(newSort);
    setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setLaunches([]); // Reset launches to load new sorted data
    setOffset(0);
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p>An error occurred while fetching the launches. Please try again later.</p>
        <p>Error details: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Slideshow */}
      <div className="fixed inset-0 -z-10">
        {backgroundImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={img}
              alt={`Background ${index + 1}`}
              className="object-cover w-full h-full"
            />
            {/* Dark overlay for better readability */}
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-50">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-white w-4' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Main Content */}
      <main className="relative min-h-screen">
        <div className="container mx-auto p-4">
          <h1 className="text-4xl font-bold mb-8 text-white text-center">
            SpaceX Launches
          </h1>
          
          {/* Sort Buttons */}
          <div className="mb-8 flex justify-center space-x-4">
            <button 
              onClick={() => handleSort('mission_name')} 
              className="group px-6 py-3 bg-purple-600/90 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 backdrop-blur-sm"
            >
              <Rocket className="w-5 h-5 group-hover:animate-[spin_2s_linear_infinite]" />
              <span>Sort by Mission Name</span>
            </button>
            <button 
              onClick={() => handleSort('launch_date_local')} 
              className="group px-6 py-3 bg-purple-600/90 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 backdrop-blur-sm"
            >
              <Rocket className="w-5 h-5 group-hover:animate-[spin_2s_linear_infinite]" />
              <span>Sort by Launch Date</span>
            </button>
          </div>

          {/* Launches List */}
          <div className="max-w-4xl mx-auto">
            <ul className="space-y-3">
              {launches.map((launch) => (
                <li 
                  key={launch.id} 
                  className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30 hover:bg-gray-800/50 transition-all duration-300"
                >
                  <Link 
                    href={`/launch/${launch.id}`} 
                    className="block"
                  >
                    <span className="text-purple-300 hover:text-purple-200  transition-colors duration-300 font-bold">
                      {launch.mission_name} - {new Date(launch.launch_date_local).toLocaleDateString()}
                      <span className={`ml-2 ${
                        launch.launch_success === null 
                          ? 'text-yellow-400' 
                          : launch.launch_success 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        {launch.launch_success === null ? ' (Upcoming)' : launch.launch_success ? ' (Success)' : ' (Failed)'}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button 
                  onClick={loadMore} 
                  disabled={loading}
                  className="group px-6 py-3 bg-purple-600/90 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2 backdrop-blur-sm"
                >
                  <Rocket className="w-5 h-5 group-hover:animate-bounce" />
                  <span>{loading ? 'Loading...' : 'Load More'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}