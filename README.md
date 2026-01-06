Non custodial payment gateway that allows merchants to accept ETH and ERC-20 tokens with a built-in 24-hour(changeable) escrow protection. No third party, no middleman 
Handles native ETH and custom ERC-20 tokens. Batch withdrawal function to save on network fees.
flow:
Payments: Users pay ETH or Tokens. Funds are locked in the Smart Contract.
Escrow: A 24-hour window where users can claim an instant refund.
Settlement: After 24 hours, the merchant can withdraw funds via single or batch transactions.
Syncing: Node.js backend listens to blockchain events to keep the Dashboard updated in real-time.

