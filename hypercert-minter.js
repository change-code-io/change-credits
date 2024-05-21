import { createWalletClient, http } from 'viem'
import { sepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { ALCHEMY } from './config.js'
import { HypercertClient, formatHypercertData, TransferRestrictions } from '@hypercerts-org/sdk'
 
const account = privateKeyToAccount('');

const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http(ALCHEMY),
});

const client = new HypercertClient({
  chain: { id: 11155111 }, // required
  walletClient,
});

const { metadata } = formatHypercertData({
  name: "Test Hypercert", // Add a valid name
  description: "This is a test hypercert", // Add a valid description
  image: "https://example.com/image.png", // Add a valid image URL
  impactScope: ["Impact Scope 1", "Impact Scope 2"],
  workScope: ["Work Scope 1", "Work Scope 2"],
  rights: ["Public Display"],
  contributors: ["0x"], // Add valid contributor addresses
});
const totalUnits = 10000n;

const txHash = await client.mintClaim({
  metadata,
  totalUnits,
  transferRestrictions: TransferRestrictions.FromCreatorOnly,

});
