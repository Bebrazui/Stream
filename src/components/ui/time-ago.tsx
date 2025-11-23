'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface TimeAgoProps {
  date: string;
  className?: string;
}

export function TimeAgo({ date, className }: TimeAgoProps) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const dateObj = new Date(date);
    
    // Устанавливаем начальное значение
    setTimeAgo(formatDistanceToNow(dateObj, { addSuffix: true, locale: ru }));

    // Обновляем каждую минуту
    const interval = setInterval(() => {
      setTimeAgo(formatDistanceToNow(dateObj, { addSuffix: true, locale: ru }));
    }, 60000);

    return () => clearInterval(interval);
  }, [date]);

  // Чтобы избежать ошибок гидратации, на сервере и при первой отрисовке ничего не рендерим
  if (!timeAgo) {
    return null;
  }

  return <span className={className}>{timeAgo}</span>;
}
