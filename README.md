# bsc-upgradeable-token-termux

Minimal upgradeable BEP‑20 (UUPS) token project + tiny web UI, runnable from Termux.

Features
- Upgradeable BEP‑20 token (UUPS) using OpenZeppelin Contracts Upgradeable.
- Hardhat scripts to deploy/upgrade on BSC testnet/mainnet.
- Minimal Express web UI to trigger deploy/upgrade from a phone (Termux).
- Example V2 implementation demonstrating adding storage & functions.

Quick Termux setup (summary)
1. Install Termux packages:
   - pkg update -y && pkg upgrade -y
   - pkg install nodejs git -y
   - (if needed for native builds) pkg install clang make python -y

2. Clone or copy this repository into a directory on Termux.

3. Install dependencies:
   - cd bsc-upgradeable-token-termux
   - npm install

4. Create .env from .env.example and fill in:
   - PRIVATE_KEY (0x...)
   - BSC_TESTNET_RPC (or BSC_MAINNET_RPC)
   - Optionally OWNER_ADDRESS

5. Run the Express UI (serves frontend at port 3000):
   - npm start
   - Open http://localhost:3000 in your mobile browser

6. Deploy / Upgrade:
   - Use the UI or run Hardhat scripts directly:
     - npx hardhat run scripts/deploy-proxy.js --network bscTestnet
     - npx hardhat run scripts/upgrade-proxy.js --network bscTestnet

Security notes
- Don’t store mainnet private keys on an untrusted phone.
- Use a multisig or timelock for _authorizeUpgrade in production.
- Add authentication to the Express server if exposing it.

Repository contents
- contracts/ - MyBEP20Upgradeable.sol and MyBEP20UpgradeableV2.sol
- scripts/ - deploy-proxy.js and upgrade-proxy.js
- public/ - index.html (small UI)
- server.js - Express server
- hardhat.config.js, package.json, .env.example, .gitignore

If you want, I can:
- Generate a downloadable zip of the repository contents for you to upload.
- Provide a single-line Termux shell that creates the project files automatically.
- Walk you through creating the repository on GitHub and pushing from Termux.
