import { createWalletClient, http } from 'viem'
import { sepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { ALCHEMY, key } from '../config.js'
import { HypercertClient, formatHypercertData, TransferRestrictions } from '@hypercerts-org/sdk'
import fs from 'fs'

const account = privateKeyToAccount(key);

const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http(ALCHEMY),
});

const client = new HypercertClient({
  chain: { id: 11155420 }, // required
  walletClient,
});

