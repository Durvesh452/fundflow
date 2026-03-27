import React from 'react';
import { X, Wallet } from 'lucide-react';

const WALLETS = [
  {
    id: 'freighter',
    name: 'Freighter',
    description: 'Official Stellar browser extension wallet',
    icon: '🚀',
    color: '#5865F2',
    address: 'GAHJJJKMOKYE4RVPZEWZTKH5FVI4PA3VL7GK2LFNUBSGBV3MTFBJXQM',
  },
  {
    id: 'albedo',
    name: 'Albedo',
    description: 'Web-based Stellar authentication',
    icon: '⭐',
    color: '#F59E0B',
    address: 'GBVTL6PHGV2UCNFQKEVDVGKFSPRLHXKFXEWSXKBMZXFLRPQRBZS4KZH',
  },
  {
    id: 'xbull',
    name: 'xBull Wallet',
    description: 'Feature-rich Stellar wallet application',
    icon: '🐂',
    color: '#10B981',
    address: 'GC5FYGBPX7YFBBVMGU7BDPUUQR4MHAZRQ4SKQNB2NIOQBSVKXLQDWCP',
  },
];

const WalletModal = ({ isOpen, onClose, onSelect, connecting, selectedWallet }) => {
  if (!isOpen) return null;

  return (
    <div
      id="wallet-modal-overlay"
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => e.target.id === 'wallet-modal-overlay' && onClose()}
    >
      <div style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: '1.25rem',
        width: '100%', maxWidth: '420px',
        padding: '1.75rem',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.1)',
        animation: 'modalSlideIn 0.25s ease',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Wallet size={18} color="white" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Connect Wallet</h2>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Choose your Stellar wallet</p>
            </div>
          </div>
          <button
            id="wallet-modal-close"
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)',
              borderRadius: '0.5rem', padding: '0.375rem', cursor: 'pointer',
              color: 'var(--color-text-secondary)', display: 'flex',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Wallet List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {WALLETS.map((wallet) => {
            const isSelected = selectedWallet === wallet.id;
            const isLoading = connecting && isSelected;
            return (
              <button
                key={wallet.id}
                id={`wallet-option-${wallet.id}`}
                onClick={() => !connecting && onSelect(wallet)}
                disabled={connecting}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  background: isSelected
                    ? `rgba(${wallet.color === '#5865F2' ? '88,101,242' : wallet.color === '#F59E0B' ? '245,158,11' : '16,185,129'},0.12)`
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isSelected ? wallet.color + '55' : 'var(--color-border)'}`,
                  borderRadius: '0.875rem', padding: '1rem 1.125rem',
                  cursor: connecting ? 'not-allowed' : 'pointer',
                  textAlign: 'left', width: '100%',
                  transition: 'all 0.2s ease',
                  opacity: (connecting && !isSelected) ? 0.5 : 1,
                }}
              >
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: wallet.color + '22',
                  border: `1px solid ${wallet.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', flexShrink: 0,
                }}>
                  {wallet.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-primary)', marginBottom: '0.2rem' }}>
                    {wallet.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    {wallet.description}
                  </div>
                </div>
                {isLoading && (
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    border: `2px solid ${wallet.color}`,
                    borderTopColor: 'transparent',
                    animation: 'spin 0.8s linear infinite', flexShrink: 0,
                  }} />
                )}
                {isSelected && !isLoading && (
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    background: wallet.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontSize: '0.7rem',
                  }}>✓</div>
                )}
              </button>
            );
          })}
        </div>

        <p style={{
          margin: '1.25rem 0 0', textAlign: 'center',
          fontSize: '0.72rem', color: 'var(--color-text-secondary)', opacity: 0.7,
        }}>
          Demo mode — using testnet accounts · No real assets
        </p>
      </div>

      <style>{`
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(-16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default WalletModal;
export { WALLETS };
