# Crowdfund dApp - Decentralized Crowdfunding Platform

## Project Overview

A full-stack Web3 decentralized application (dApp) built for **CPSC 8810 - Blockchain & Web3** at Clemson University. This project implements a crowdfunding platform on the Ethereum Sepolia testnet, allowing users to contribute funds toward a campaign goal and request refunds before the goal is reached.

> **Disclaimer:** This README was AI-generated to document the project structure and functionality.

### Team Members

- Moe Lambert
- Daniel Visser
- Austin Wagner

### Course Information

- **Instructor:** Dr. Lu Yu
- **Course:** ECE/CPSC 8810 - Blockchain & Web3
- **Due Date:** November 24, 2025
- **Institution:** Clemson University

## Features

### Smart Contract Capabilities

- **Contribution System**: Users can contribute ETH to the crowdfunding campaign
- **One-Time Contribution**: Each address can only contribute once to maintain fairness
- **Refund Mechanism**: Contributors can request partial or full refunds before the goal is reached
- **Goal Locking**: Campaign automatically locks when the funding goal is met
- **Event Logging**: All major actions emit events for transparency and tracking
- **Access Control**: Security measures including require statements and validation checks

### Frontend Features

- **MetaMask Integration**: Seamless wallet connection and authentication
- **Network Detection**: Automatically verifies Sepolia testnet connection
- **Real-time Data**: Live updates of campaign progress and user contributions
- **Transaction Management**: User-friendly interface for contributions and refunds
- **Event History**: Transaction log displaying recent activity
- **Responsive Design**: Clean, modern UI with status indicators

## Technology Stack

| Component | Technology |
|-----------|-----------|
| **Smart Contract** | Solidity ^0.8.x |
| **Blockchain Network** | Ethereum Sepolia Testnet |
| **Frontend Framework** | React 18.2 with Vite |
| **Blockchain Library** | ethers.js v5.7.2 |
| **Wallet** | MetaMask |
| **Deployment** | Vercel |
| **Contract Verification** | Etherscan (Sepolia) |

## Project Structure

```
dApp-crowdfund-frontend/
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main application component
│   │   ├── App.css       # Application styles
│   │   ├── abi.json      # Contract ABI
│   │   └── main.jsx      # React entry point
│   ├── index.html        # HTML template
│   ├── package.json      # Dependencies and scripts
│   └── vite.config.js    # Vite configuration
├── backend/
│   └── crowdfund.sol     # Solidity smart contract
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MetaMask browser extension
- Sepolia testnet ETH (from faucet)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd dApp-crowdfund-frontend/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

4. **Build for production**

   ```bash
   npm run build
   ```

## Deployed Contract

- **Contract Address:** `0x87204075Cb6392d20F9C9621536FbA857E38c5Af`
- **Network:** Sepolia Testnet
- **Etherscan Link:** [View on Etherscan](https://sepolia.etherscan.io/address/0x87204075Cb6392d20F9C9621536FbA857E38c5Af)

## How to Use

### 1. Connect Your Wallet

- Click "Connect MetaMask" button
- Approve the connection in MetaMask
- Ensure you're on the Sepolia testnet

### 2. View Campaign Status

- See the funding goal and amount raised
- Monitor your personal contribution
- Check campaign progress percentage

### 3. Make a Contribution

- Enter the amount in ETH you wish to contribute
- Click "Contribute" button
- Confirm the transaction in MetaMask
- Wait for transaction confirmation

### 4. Request a Refund (if needed)

- Enter the amount you wish to refund (up to your contribution)
- Click "Request Refund" button
- Confirm the transaction in MetaMask
- Refunds are only available before the goal is reached

## Smart Contract Functions

### State-Changing Functions

- `contribute(uint256 amount)` - Contribute ETH to the campaign (payable)
- `refund(uint256 amount)` - Request a refund before goal is reached

### View Functions

- `goal()` - Returns the campaign funding goal
- `amountRaised()` - Returns total funds raised
- `locked()` - Returns whether the goal has been reached
- `amountContributed(address)` - Returns contribution amount for an address
- `hasContributed(address)` - Returns whether an address has contributed

### Events

- Contribution events logged for each successful contribution
- Refund events logged for each successful refund

## Security Features

- **Input Validation**: All user inputs are validated before processing
- **Require Statements**: Smart contract uses require() to enforce business logic
- **Access Control**: One contribution per address limitation
- **Network Verification**: Frontend validates Sepolia testnet connection
- **Amount Validation**: Checks ensure valid contribution and refund amounts

## Testing

The project includes comprehensive testing coverage:

- Successful contribution transactions
- Failed transactions (duplicate contributions, invalid amounts)
- Refund functionality before goal is reached
- Locked state after goal achievement
- Event emission verification

## Assignment Requirements Met

### Smart Contract Requirements

- 2+ state-changing functions (contribute, refund)
- 1+ view functions (multiple implemented)
- Event emission on state changes
- Security validation with require statements
- Access control (one contribution per address)
- Deployed and verified on Sepolia

### Frontend Requirements

- React with Vite framework
- ethers.js integration
- MetaMask wallet connection
- Write operations (contribute, refund)
- Read operations (view campaign data)
- Event/result display
- Deployed on Vercel

## Live Demo

**Vercel URL:** [Insert your Vercel deployment URL here]

## Troubleshooting

**MetaMask not connecting?**

- Ensure MetaMask is installed and unlocked
- Check that you're on the Sepolia testnet
- Refresh the page and try again

**Transaction failing?**

- Verify you have sufficient Sepolia ETH for gas fees
- Check that you haven't already contributed (if trying to contribute)
- Ensure refund amount doesn't exceed your contribution

**Data not loading?**

- Click the "Refresh Data" button
- Check your network connection
- Verify the contract address is correct

## License

This project was created for educational purposes as part of CPSC 8810 - Blockchain & Web3 at Clemson University.

## Acknowledgments

- **Dr. Lu Yu** - Course instructor and project guidance
- **Clemson University** - ECE/CPSC 8810 course materials
- **MetaMask** - Wallet integration
- **Etherscan** - Contract verification and exploration
- **Vercel** - Frontend hosting platform
