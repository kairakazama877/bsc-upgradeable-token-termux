/**
 * Minimal Express server that triggers Hardhat scripts through child processes.
 * Quick and dirty for on-device control; for production use a server with proper auth.
 */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

function runHardhatScript(script, envExtras = {}, network = 'bscTestnet') {
  return new Promise((resolve, reject) => {
    const env = Object.assign({}, process.env, envExtras);
    // Use npx to run hardhat from local node_modules
    const cmd = `npx hardhat run ${script} --network ${network}`;
    exec(cmd, { env, maxBuffer: 1024 * 500 }, (err, stdout, stderr) => {
      if (err) {
        return reject({ err: err.message, stdout, stderr });
      }
      resolve({ stdout, stderr });
    });
  });
}

app.post('/deploy', async (req, res) => {
  try {
    const { tokenName, tokenSymbol, initialSupply, ownerAddress, network } = req.body;
    const envExtras = {
      TOKEN_NAME: tokenName,
      TOKEN_SYMBOL: tokenSymbol,
      INITIAL_SUPPLY: initialSupply,
      OWNER_ADDRESS: ownerAddress
    };
    const r = await runHardhatScript('scripts/deploy-proxy.js', envExtras, network || 'bscTestnet');
    res.json({ success: true, output: r.stdout });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
});

app.post('/upgrade', async (req, res) => {
  try {
    const { proxyAddress, network } = req.body;
    if (!proxyAddress) return res.status(400).json({ error: "proxyAddress required" });
    const envExtras = { PROXY_ADDRESS: proxyAddress };
    const r = await runHardhatScript('scripts/upgrade-proxy.js', envExtras, network || 'bscTestnet');
    res.json({ success: true, output: r.stdout });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
