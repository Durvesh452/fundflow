<<<<<<< HEAD
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
=======
import { useState, useCallback, useEffect } from 'react';
import { CONFIG } from '../config';
import {
  StellarWalletsKit,
  Networks,
} from '@creit.tech/stellar-wallets-kit';
import { FreighterModule } from '@creit.tech/stellar-wallets-kit/modules/freighter';
import { AlbedoModule } from '@creit.tech/stellar-wallets-kit/modules/albedo';
import { xBullModule } from '@creit.tech/stellar-wallets-kit/modules/xbull';
>>>>>>> ba4b92ba0863a7789e2cf3c0a370979c31c80168

export const useWallet = () => {
  const [publicKey, setPublicKey] = useState(null);
  const [walletName, setWalletName] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);
<<<<<<< HEAD
=======
  const [kit, setKit] = useState(null);

  useEffect(() => {
    const walletsKit = new StellarWalletsKit({
      network: Networks.TESTNET,
      selectedWalletId: 'freighter',
      modules: [
        new FreighterModule(),
        new AlbedoModule(),
        new xBullModule(),
      ],
    });
    setKit(walletsKit);
    // Expose sign transaction to global scope for DonateForm
    window.__fundflow_sign = async (xdr, opts) => {
      const { signedXDR } = await walletsKit.sign({
        xdr,
        publicKey: walletsKit.getPublicKey(),
      });
      return signedXDR;
    };
  }, []);
>>>>>>> ba4b92ba0863a7789e2cf3c0a370979c31c80168

  const openModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    if (!connecting) setModalOpen(false);
  }, [connecting]);

  const connectWallet = useCallback(async (wallet) => {
<<<<<<< HEAD
=======
    if (!kit) return;
>>>>>>> ba4b92ba0863a7789e2cf3c0a370979c31c80168
    setConnecting(true);
    setSelectedWallet(wallet.id);
    setError(null);

    try {
<<<<<<< HEAD
      // Ensure modules are initialized
      await StellarWalletsKit.refreshSupportedWallets();
      
      // Set the selected wallet
      StellarWalletsKit.setWallet(wallet.id);
      
      // Request address directly from the module (this triggers the extension)
      const { address } = await StellarWalletsKit.selectedModule.getAddress();
      
=======
      kit.setWallet(wallet.id);
      await kit.connect();
      const address = await kit.getPublicKey();
>>>>>>> ba4b92ba0863a7789e2cf3c0a370979c31c80168
      setPublicKey(address);
      setWalletName(wallet.name);
      setModalOpen(false);
    } catch (err) {
<<<<<<< HEAD
      if (err?.code === -1) {
        // User closed the modal
        setError(null);
      } else {
        setError('Failed to connect: ' + (err?.message || err));
      }
=======
      console.error(err);
      setError('Failed to connect: ' + (err?.message || err));
>>>>>>> ba4b92ba0863a7789e2cf3c0a370979c31c80168
    } finally {
      setConnecting(false);
      setSelectedWallet(null);
    }
<<<<<<< HEAD
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
=======
  }, [kit]);

  const disconnect = useCallback(async () => {
    if (kit) await kit.disconnect();
    setPublicKey(null);
    setWalletName(null);
  }, [kit]);

  const signTransaction = useCallback(async (xdr, opts) => {
    if (!kit) throw new Error('Wallet not connected');
    const { signedXDR } = await kit.sign({ xdr });
    return signedXDR;
  }, [kit]);
>>>>>>> ba4b92ba0863a7789e2cf3c0a370979c31c80168

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
