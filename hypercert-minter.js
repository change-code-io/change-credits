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
/*
const metadataJson = fs.readFileSync('./metadata.json', 'utf8');
const metadataObject = JSON.parse(metadataJson);
*/

// Validate and format your Hypercert metadata
const { valid, errors, data: metadata } = formatHypercertData({
    name: "test name",
    description: "test description",
    image: "some test image",
    impactScope: ["test impact scope"],
    workScope: ["test impact scope"],
    rights: ["test right 1", "test right 2"],
    contributors: ["0x111", "0x22"],
    impactTimeframeStart: 1697040000,
    impactTimeframeEnd: 1697040000,
    workTimeframeStart: 1697040000,
    workTimeframeEnd: 1697040000,
    version: "0.0.1",
});

if (!valid) {
  console.error("Metadata validation errors:", errors);
  process.exit(1);
} else {
  console.log("Validated metadata:", metadata);
}

const totalUnits = 10000n;

(async () => {
  try {
    const formattedMetadata = {
      name: metadata.name,
      description: metadata.description,
      image: metadata.image,
      impactScope: metadata.hypercert.impact_scope.value,
      workScope: metadata.hypercert.work_scope.value,
      rights: metadata.hypercert.rights.value,
      contributors: metadata.hypercert.contributors.value,
      impactTimeframeStart: metadata.hypercert.impact_timeframe.value[0],
      impactTimeframeEnd: metadata.hypercert.impact_timeframe.value[1],
      workTimeframeStart: metadata.hypercert.work_timeframe.value[0],
      workTimeframeEnd: metadata.hypercert.work_timeframe.value[1],
      version: metadata.version,
    };
    const tx = await client.mintClaim({
      metadata: formattedMetadata,
      totalUnits,   
      transferRestrictions: TransferRestrictions.FromCreatorOnly,
    });
    console.log("Minting transaction:", tx);
  } catch (error) {
    console.error("Error minting claim:", error);
  }
})();