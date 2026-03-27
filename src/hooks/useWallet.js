import { useState, useCallback } from 'react';
import { StellarWalletsKit, Networks } from '@creit.tech/stellar-wallets-kit';
import { FreighterModule } from '@creit.tech/stellar-wallets-kit/modules/freighter';
import { AlbedoModule } from '@creit.tech/stellar-wallets-kit/modules/albedo';
import { xBullModule } from '@creit.tech/stellar-wallets-kit/modules/xbull';
import { CONFIG } from '../config';

// Initialize the kit (static API in v2)
StellarWalletsKit.init({
  network: Networks.TESTNET,
  modules: [
    new FreighterModule(),
    new AlbedoModule(),
    new xBullModule(),
  ],
});

export const useWallet = () => {
  const [publicKey, setPublicKey] = useState(null);
  const [walletName, setWalletName] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const openModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    if (!connecting) setModalOpen(false);
  }, [connecting]);

  const connectWallet = useCallback(async (wallet) => {
    setConnecting(true);
    setSelectedWallet(wallet.id);
    setError(null);

    try {
      // Ensure modules are initialized
      await StellarWalletsKit.refreshSupportedWallets();
      
      // Set the selected wallet
      StellarWalletsKit.setWallet(wallet.id);
      
      // Request address directly from the module (this triggers the extension)
      const { address } = await StellarWalletsKit.selectedModule.getAddress();
      
      setPublicKey(address);
      setWalletName(wallet.name);
      setModalOpen(false);
    } catch (err) {
      if (err?.code === -1) {
        // User closed the modal
        setError(null);
      } else {
        setError('Failed to connect: ' + (err?.message || err));
      }
    } finally {
      setConnecting(false);
      setSelectedWallet(null);
    }
  }, []);

  const disconnect = useCallback(async () => {
    await StellarWalletsKit.disconnect();
    setPublicKey(null);
    setWalletName(null);
  }, []);

  const signTransaction = useCallback(async (xdr, opts) => {
    try {
      const { signedTxXdr } = await StellarWalletsKit.signTransaction(xdr, {
        networkPassphrase: opts?.networkPassphrase ?? CONFIG.NETWORK_PASSPHRASE,
      });
      return signedTxXdr;
    } catch (err) {
      console.error('Signing error:', err);
      throw err;
    }
  }, []);

  return {
    publicKey,
    walletName,
    connecting,
    error,
    isConnected: !!publicKey,
    modalOpen,
    selectedWallet,
    openModal,
    closeModal,
    connectWallet,
    disconnect,
    signTransaction,
  };
};
