'use client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function OrderStatusPage({ params }: { params: { orderId: string } }) {
  const [status, setStatus] = useState('PENDING');

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
    socket.on('order-status-updated', (data) => {
      if (data.orderId === Number(params.orderId)) {
        setStatus(data.status); 
      }
    });

    return () => { socket.disconnect(); };
  }, [params.orderId]);

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold">Nomor Antrian Anda</h1>
      <div className="text-6xl font-black my-4 text-orange-600">#{params.orderId}</div>
      <div className="p-4 bg-gray-100 rounded-lg">
        Status: <span className="font-bold">{status}</span>
      </div>
    </div>
  );
}