'use client';

import { useEffect, useState, use } from 'react'; 
import { io } from 'socket.io-client';
import api from '@/lib/axios';

export default function OrderStatusPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params); 

  const [status, setStatus] = useState('Loading...');

  useEffect(() => {

    const fetchInitialStatus = async () => {
      try {
        const response = await api.get(`/orders/${orderId}`);
        setStatus(response.data.status);
      } catch (error) {
        console.error("Gagal mengambil status order:", error);
        setStatus("Error");
      }
    };

    fetchInitialStatus();
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
    
    socket.on('order-status-updated', (data) => {
      if (String(data.orderId) === String(orderId)) { 
        console.log("Status update received:", data.status);
        setStatus(data.status); 
      }
    });

    return () => { socket.disconnect(); };
  }, [orderId]); 

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'PAID': return 'text-blue-600 bg-blue-100';
      case 'COOKING': return 'text-orange-600 bg-orange-100';
      case 'SERVED': return 'text-purple-600 bg-purple-100';
      case 'COMPLETED': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-8 text-center min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-2">Nomor Antrian Anda</h1>
      <div className="text-6xl font-black my-6 text-gray-800">#{orderId}</div>
      
      <div className={`px-6 py-3 rounded-full text-xl font-bold transition-all ${getStatusColor(status)}`}>
        {status === 'Loading...' ? 'Memuat...' : status}
      </div>
      
      <p className="mt-8 text-gray-500 text-sm">
        Halaman ini akan update otomatis saat status berubah.
      </p>
    </div>
  );
}