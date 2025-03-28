
import React from 'react';
import { useParams } from 'react-router-dom';

export default function BuildDetail() {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Build Details</h1>
      <p className="text-lg">Viewing build ID: {id}</p>
    </div>
  );
}
