
'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface TimeAgoProps {
  date: string;
}

export function TimeAgo({ date }: TimeAgoProps) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    // Форматируем дату только после того, как компонент смонтировался на клиенте
    setTimeAgo(formatDistanceToNow(new Date(date), { addSuffix: true }));
  }, [date]);

  // На сервере и во время первой отрисовки на клиенте ничего не рендерим
  if (!timeAgo) {
    return null;
  }

  return <span className="text-sm text-gray-500">@{timeAgo}</span>;
}
