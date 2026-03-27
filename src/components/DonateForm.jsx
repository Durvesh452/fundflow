import React, { useState } from 'react';
import { Send, Loader2, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { submitDonation } from '../utils/stellar';
import { CONFIG } from '../config';

const TX_STATUS = { IDLE: 'idle', PENDING: 'pending', SUCCESS: 'success', ERROR: 'error' };

const ERROR_MESSAGES = {
  USER_REJECTED: {
    title: 'Transaction Rejected',
    body: 'You declined the transaction in your wallet.',
    icon: <XCircle size={18} />,
  },
  INSUFFICIENT_BALANCE: {
    title: 'Insufficient Balance',
    body: 'Your wallet does not have enough XLM for this transaction plus fees.',
    icon: <AlertTriangle size={18} />,
  },
  TRANSACTION_FAILED: {
    title: 'Transaction Failed',
    body: 'The transaction was submitted but failed on-chain. Please try again.',
    icon: <XCircle size={18} />,
  },
  CONTRACT_NOT_DEPLOYED: {
    title: 'Contract Not Deployed',
    body: 'The smart contract has not been deployed yet. Please follow the README to deploy it first.',
    icon: <AlertTriangle size={18} />,
  },
  WALLET_NOT_FOUND: {
    title: 'Wallet Not Found',
    body: 'No compatible Stellar wallet extension was detected. Please install Freighter and try again.',
    icon: <AlertTriangle size={18} />,
  },
};

const getErrorInfo = (err) => {
  const msg = err?.message ?? String(err) ?? '';
  
  if (msg.includes('User declined') || msg.includes('User rejected') || msg.includes('USER_REJECTED')) {
    return ERROR_MESSAGES.USER_REJECTED;
  }
  if (msg.includes('Insufficient') || msg.includes('INSUFFICIENT_BALANCE') || msg.includes('insufficient')) {
    return ERROR_MESSAGES.INSUFFICIENT_BALANCE;
  }
  if (msg.includes('Failed') || msg.includes('TRANSACTION_FAILED') || msg.includes('tx_failed')) {
    return ERROR_MESSAGES.TRANSACTION_FAILED;
  }
  if (msg.includes('CONTRACT_NOT_DEPLOYED') || msg.includes('not found') || msg.includes('status: 404')) {
    return ERROR_MESSAGES.CONTRACT_NOT_DEPLOYED;
  }
  if (msg.includes('WALLET_NOT_FOUND') || msg.includes('Please install')) {
    return ERROR_MESSAGES.WALLET_NOT_FOUND;
  }

  return { title: 'Error', body: msg || 'An unexpected error occurred.', icon: <XCircle size={18} /> };
};

const DonateForm = ({ publicKey, isConnected, onConnect, onDonated }) => {
  const [amount, setAmount] = useState('');
  const [txStatus, setTxStatus] = useState(TX_STATUS.IDLE);
  const [txHash, setTxHash] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  const handleDonate = async () => {
    if (!isConnected) { onConnect(); return; }
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed < CONFIG.MIN_DONATION) return;

    setTxStatus(TX_STATUS.PENDING);
    setErrorInfo(null);
    setTxHash(null);

    try {
      // Import wallet sign from kit (passed as window global by hook setup)
      const { signTransaction } = await import('../hooks/useWallet').then(m => {
        // We need the kit's signTransaction — use event-based approach
        return { signTransaction: window.__fundflow_sign };
      });

      const hash = await submitDonation(publicKey, amount, signTransaction);
      setTxHash(hash);
      setTxStatus(TX_STATUS.SUCCESS);
      setAmount('');
      onDonated?.(hash);
    } catch (err) {
      console.error(err);
      setErrorInfo(getErrorInfo(err));
      setTxStatus(TX_STATUS.ERROR);
    }
  };

  const isLoading = txStatus === TX_STATUS.PENDING;

  return (
    <div className="card">
      <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Send size={18} color="var(--color-accent)" />
        Make a Donation
      </h3>

      {/* Amount Input */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Amount (XLM)
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="number"
            className="input-field"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Min. ${CONFIG.MIN_DONATION} XLM`}
            min={CONFIG.MIN_DONATION}
            step="any"
            disabled={isLoading}
          />
          <span style={{
            position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
            fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)',
          }}>XLM</span>
        </div>
      </div>

      {/* Quick Amount Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {[10, 50, 100, 500].map((v) => (
          <button
            key={v}
            onClick={() => setAmount(String(v))}
            disabled={isLoading}
            style={{
              background: amount === String(v) ? 'rgba(99, 102, 241, 0.2)' : 'var(--color-bg-secondary)',
              border: `1px solid ${amount === String(v) ? 'rgba(99, 102, 241, 0.5)' : 'var(--color-border)'}`,
              borderRadius: '0.5rem',
              padding: '0.375rem 0.75rem',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: amount === String(v) ? '#a5b4fc' : 'var(--color-text-secondary)',
              transition: 'all 0.2s ease',
            }}
          >
            {v} XLM
          </button>
        ))}
      </div>

      {/* Submit Button */}
      <button
        className="btn-primary"
        onClick={handleDonate}
        disabled={isLoading || (isConnected && (!amount || parseFloat(amount) < CONFIG.MIN_DONATION))}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1rem' }}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            Submitting...
          </>
        ) : isConnected ? (
          <>
            <Send size={18} />
            Donate {amount ? `${amount} XLM` : 'XLM'}
          </>
        ) : (
          'Connect Wallet to Donate'
        )}
      </button>

      {/* Transaction Status */}
      {txStatus === TX_STATUS.PENDING && (
        <div style={{
          marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.875rem', borderRadius: '0.75rem',
          background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)',
          color: 'var(--color-warning)',
        }}>
          <Clock size={16} style={{ flexShrink: 0 }} />
          <div>
            <p style={{ margin: '0 0 0.125rem', fontSize: '0.875rem', fontWeight: 600 }}>⏳ Transaction Pending</p>
            <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8 }}>Waiting for wallet signature and blockchain confirmation...</p>
          </div>
        </div>
      )}

      {txStatus === TX_STATUS.SUCCESS && (
        <div className="alert-success" style={{ marginTop: '1rem' }}>
          <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
          <div>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.875rem', fontWeight: 600 }}>✅ Transaction Confirmed!</p>
            {txHash && (
              <a href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank" rel="noreferrer"
                style={{ fontSize: '0.75rem', color: '#6ee7b7', wordBreak: 'break-all' }}>
                {txHash.slice(0, 16)}...{txHash.slice(-8)} ↗
              </a>
            )}
          </div>
        </div>
      )}

      {txStatus === TX_STATUS.ERROR && errorInfo && (
        <div className="alert-error" style={{ marginTop: '1rem' }}>
          <span style={{ flexShrink: 0, marginTop: '1px' }}>{errorInfo.icon}</span>
          <div>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.875rem', fontWeight: 600 }}>❌ {errorInfo.title}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.85 }}>{errorInfo.body}</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default DonateForm;
