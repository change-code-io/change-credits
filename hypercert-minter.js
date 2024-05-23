import { createWalletClient, http } from 'viem'
import { sepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { ALCHEMY, key } from './config.js'
import { HypercertClient, formatHypercertData, TransferRestrictions } from '@hypercerts-org/sdk'
import fs from 'fs'

const account = privateKeyToAccount(key);

const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http(ALCHEMY),
});

const client = new HypercertClient({
  chain: { id: 11155111 }, // required
  walletClient,
});

// Read the metadata from the JSON file
const metadataJson = fs.readFileSync('./metadata.json', 'utf8');
const metadataObject = JSON.parse(metadataJson);

// Validate and format your Hypercert metadata
const { valid, errors, data: metadata } = formatHypercertData(metadataObject);

if (!valid) {
  console.error("Metadata validation errors:", errors);
  process.exit(1);
}

const totalUnits = 10000n;

try {
  const tx = await client.mintClaim({
    metadata,
    totalUnits,
    transferRestrictions: TransferRestrictions.FromCreatorOnly,
  });
  console.log("Minting transaction:", tx);
} catch (error) {
  console.error("Error minting claim:", error);
}