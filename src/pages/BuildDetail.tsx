
import React from 'react';
import { useParams } from 'react-router-dom';

export default function BuildDetail() {
  const { id } = useParams();
  
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">Build Details</h1>
      <p className="text-lg">Viewing details for build ID: {id}</p>
    </div>
  );
}
