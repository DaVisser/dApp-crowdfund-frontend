import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import contractABI from './abi.json';

// Deployed contract address
const CONTRACT_ADDRESS = "0x87204075Cb6392d20F9C9621536FbA857E38c5Af";

function App() {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [network, setNetwork] = useState('');
  
  // Contract state
  const [goal, setGoal] = useState('0');
  const [amountRaised, setAmountRaised] = useState('0');
  const [locked, setLocked] = useState(false);
  const [myContribution, setMyContribution] = useState('0');
  
  // Form inputs
  const [contributeAmount, setContributeAmount] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  
  // Status messages
  const [status, setStatus] = useState('');
  const [events, setEvents] = useState([]);

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask!');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      
      // Check if connected to Sepolia
      if (network.chainId !== 11155111) {
        alert('Please switch to Sepolia testnet!');
        return;
      }

      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      setAccount(accounts[0]);
      setProvider(provider);
      setContract(contract);
      setNetwork(network.name);
      setStatus('Wallet connected successfully!');

      // Load contract data
      await loadContractData(contract);
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setStatus('Error: ' + error.message);
    }
  };

  // Load contract data
  const loadContractData = async (contractInstance) => {
    try {
      const contract = contractInstance || contract;
      if (!contract) return;

      const goalValue = await contract.goal();
      const raisedValue = await contract.amountRaised();
      const lockedValue = await contract.locked();
      
      setGoal(ethers.utils.formatEther(goalValue));
      setAmountRaised(ethers.utils.formatEther(raisedValue));
      setLocked(lockedValue);

      // Get user's contribution
      if (account) {
        const myAmount = await contract.amountContributed(account);
        setMyContribution(ethers.utils.formatEther(myAmount));
      }
    } catch (error) {
      console.error('Error loading contract data:', error);
    }
  };

  // Contribute to campaign
  const handleContribute = async () => {
    if (!contract || !contributeAmount) {
      setStatus('Please enter a contribution amount');
      return;
    }

    try {
      setStatus('Processing transaction...');
      
      const amountInWei = ethers.utils.parseEther(contributeAmount);
      const tx = await contract.contribute(amountInWei);
      
      setStatus('Transaction pending...');
      await tx.wait();
      
      setStatus('Contribution successful!');
      setEvents(prev => [...prev, `Contributed ${contributeAmount} ETH - TX: ${tx.hash}`]);
      
      // Reload data
      await loadContractData();
      setContributeAmount('');
      
    } catch (error) {
      console.error('Error contributing:', error);
      setStatus('Error: ' + (error.reason || error.message));
    }
  };

  // Request refund
  const handleRefund = async () => {
    if (!contract || !refundAmount) {
      setStatus('Please enter a refund amount');
      return;
    }

    try {
      setStatus('Processing refund...');
      
      const amountInWei = ethers.utils.parseEther(refundAmount);
      const tx = await contract.refund(amountInWei);
      
      setStatus('Transaction pending...');
      await tx.wait();
      
      setStatus('Refund successful!');
      setEvents(prev => [...prev, `Refunded ${refundAmount} ETH - TX: ${tx.hash}`]);
      
      // Reload data
      await loadContractData();
      setRefundAmount('');
      
    } catch (error) {
      console.error('Error requesting refund:', error);
      setStatus('Error: ' + (error.reason || error.message));
    }
  };

  // Listen for network changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          loadContractData();
        } else {
          setAccount('');
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <div className="App">
      <header className="header">
        <h1>Crowdfund dApp</h1>
        <p>Decentralized Crowdfunding on Sepolia</p>
      </header>

      <main className="container">
        {/* Wallet Connection */}
        <div className="card">
          <h2>Connect Wallet</h2>
          {!account ? (
            <button onClick={connectWallet} className="btn-primary">
              Connect MetaMask
            </button>
          ) : (
            <div className="wallet-info">
              <p><strong>Address:</strong> {account.slice(0, 6)}...{account.slice(-4)}</p>
              <p><strong>Network:</strong> {network}</p>
              <span className="badge">Connected ✓</span>
            </div>
          )}
        </div>

        {/* Campaign Status */}
        {account && (
          <div className="card">
            <h2>Campaign Status</h2>
            <div className="stats">
              <div className="stat-item">
                <label>Goal:</label>
                <span>{goal} ETH</span>
              </div>
              <div className="stat-item">
                <label>Amount Raised:</label>
                <span>{amountRaised} ETH</span>
              </div>
              <div className="stat-item">
                <label>Progress:</label>
                <span>{((parseFloat(amountRaised) / parseFloat(goal)) * 100).toFixed(2)}%</span>
              </div>
              <div className="stat-item">
                <label>Status:</label>
                <span className={locked ? 'badge-success' : 'badge-pending'}>
                  {locked ? 'Goal Reached!' : 'In Progress'}
                </span>
              </div>
              <div className="stat-item">
                <label>Your Contribution:</label>
                <span>{myContribution} ETH</span>
              </div>
            </div>
            <button onClick={loadContractData} className="btn-secondary">
              Refresh Data
            </button>
          </div>
        )}

        {/* Contribute Section */}
        {account && (
          <div className="card">
            <h2>Make a Contribution</h2>
            <div className="form-group">
              <input
                type="number"
                step="0.01"
                placeholder="Amount in ETH (e.g., 0.1)"
                value={contributeAmount}
                onChange={(e) => setContributeAmount(e.target.value)}
                className="input"
              />
              <button onClick={handleContribute} className="btn-primary">
                Contribute
              </button>
            </div>
          </div>
        )}

        {/* Refund Section */}
        {account && parseFloat(myContribution) > 0 && !locked && (
          <div className="card">
            <h2>Request Refund</h2>
            <div className="form-group">
              <input
                type="number"
                step="0.01"
                placeholder="Amount to refund (max: your contribution)"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="input"
              />
              <button onClick={handleRefund} className="btn-danger">
                Request Refund
              </button>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {status && (
          <div className={`status ${status.includes('Error') ? 'error' : 'success'}`}>
            {status}
          </div>
        )}

        {/* Event Log */}
        {events.length > 0 && (
          <div className="card">
            <h2>Transaction History</h2>
            <div className="events">
              {events.map((event, index) => (
                <div key={index} className="event-item">
                  {event}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contract Info */}
        <div className="card info">
          <p><strong>Contract Address:</strong></p>
          <a 
            href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {CONTRACT_ADDRESS}
          </a>
        </div>
      </main>
    </div>
  );
}

export default App;
