import React, { useState } from 'react';

/**
 * Mock implementation of gaming-ui-a11y-toolkit
 * TODO: Replace with actual package when available
 */

export interface GameMenuItem {
  id: string;
  label: string;
  icon: string;
  onSelect: () => void;
}

export interface GameMenuProps {
  title?: string;
  items: GameMenuItem[];
  enableHapticFeedback?: boolean;
}

export const GameMenu: React.FC<GameMenuProps> = ({ title, items }) => {
  return (
    <div>
      {title && <h2>{title}</h2>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={item.onSelect}
            style={{
              padding: '15px 20px',
              fontSize: '1.1em',
              cursor: 'pointer',
              border: '2px solid #00FFFF',
              borderRadius: '8px',
              background: 'rgba(30, 30, 30, 0.8)',
              color: '#E0E0E0',
              transition: 'all 0.2s',
            }}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export interface GameButtonProps {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  children: React.ReactNode;
}

export const GameButton: React.FC<GameButtonProps> = ({ variant = 'primary', onClick, children }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px',
        backgroundColor: variant === 'primary' ? '#1E90FF' : '#FF6347',
        color: '#E0E0E0',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}
    >
      {children}
    </button>
  );
};

export const useGamepadNavigation = ({ itemCount: _itemCount }: { itemCount: number }) => {
  const [isGamepadConnected] = useState(false);
  return { isGamepadConnected };
};
