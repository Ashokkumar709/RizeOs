import React, { createContext, useContext, useState, useEffect } from 'react'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import toast from 'react-hot-toast'

const WalletContext = createContext()

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

// Admin wallet for receiving payments (replace with your actual wallet)
const ADMIN_WALLET = new PublicKey('11111111111111111111111111111112')

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null)
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [balance, setBalance] = useState(0)

  // Use devnet for testing
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed')

  useEffect(() => {
    checkIfWalletConnected()
  }, [])

  const checkIfWalletConnected = async () => {
    try {
      const { solana } = window
      if (solana && solana.isPhantom) {
        const response = await solana.connect({ onlyIfTrusted: true })
        setWallet(response.publicKey)
        setConnected(true)
        await getBalance(response.publicKey)
      }
    } catch (error) {
      console.log('Wallet not connected')
    }
  }

  const connectWallet = async () => {
    setConnecting(true)
    try {
      const { solana } = window
      
      if (!solana || !solana.isPhantom) {
        toast.error('Phantom wallet not found! Please install Phantom wallet.')
        window.open('https://phantom.app/', '_blank')
        return
      }

      const response = await solana.connect()
      setWallet(response.publicKey)
      setConnected(true)
      await getBalance(response.publicKey)
      toast.success('Wallet connected successfully!')
    } catch (error) {
      toast.error('Failed to connect wallet')
      console.error('Wallet connection error:', error)
    } finally {
      setConnecting(false)
    }
  }

  const disconnectWallet = async () => {
    try {
      const { solana } = window
      if (solana) {
        await solana.disconnect()
      }
      setWallet(null)
      setConnected(false)
      setBalance(0)
      toast.success('Wallet disconnected')
    } catch (error) {
      console.error('Disconnect error:', error)
    }
  }

  const getBalance = async (publicKey) => {
    try {
      const balance = await connection.getBalance(publicKey)
      setBalance(balance / LAMPORTS_PER_SOL)
    } catch (error) {
      console.error('Error getting balance:', error)
    }
  }

  const sendPayment = async (amount = 0.01) => {
    if (!wallet || !connected) {
      toast.error('Please connect your wallet first')
      return false
    }

    try {
      const { solana } = window
      const transaction = new (await import('@solana/web3.js')).Transaction()
      
      const transferInstruction = (await import('@solana/web3.js')).SystemProgram.transfer({
        fromPubkey: wallet,
        toPubkey: ADMIN_WALLET,
        lamports: amount * LAMPORTS_PER_SOL
      })

      transaction.add(transferInstruction)
      transaction.feePayer = wallet
      
      const { blockhash } = await connection.getRecentBlockhash()
      transaction.recentBlockhash = blockhash

      const signedTransaction = await solana.signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signedTransaction.serialize())
      
      await connection.confirmTransaction(signature)
      
      toast.success(`Payment of ${amount} SOL sent successfully!`)
      await getBalance(wallet)
      
      return { success: true, signature }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Payment failed. Please try again.')
      return { success: false, error: error.message }
    }
  }

  const value = {
    wallet,
    connected,
    connecting,
    balance,
    connectWallet,
    disconnectWallet,
    sendPayment,
    getBalance
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}