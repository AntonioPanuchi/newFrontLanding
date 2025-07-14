import React from 'react';
import Button from './Button';

type ServerFiltersProps = {
  filter: 'all' | 'online' | 'offline';
  setFilter: (f: 'all' | 'online' | 'offline') => void;
};

const ServerFilters: React.FC<ServerFiltersProps> = ({ filter, setFilter }) => {
  return (
    <div className="flex items-center space-x-4">
      <Button variant={filter === 'all' ? 'primary' : 'secondary'} onClick={() => setFilter('all')}>Все серверы</Button>
      <Button variant={filter === 'online' ? 'primary' : 'secondary'} onClick={() => setFilter('online')}>Онлайн</Button>
      <Button variant={filter === 'offline' ? 'primary' : 'secondary'} onClick={() => setFilter('offline')}>Оффлайн</Button>
    </div>
  );
};

export default ServerFilters; 