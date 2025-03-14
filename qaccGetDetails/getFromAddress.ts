import axios from "axios";
import { ethers } from "ethers";
import pLimit from "p-limit"; // For controlling concurrency

const projectFPAddress = "0x9eF71aa2276d1BfceF83F9d7150F5026Ee782789";
const apiUrl = "https://api.polygonscan.com/api";
const apiKey = "B2HHM317RPBCK1NM4KAQJ9TVD2GIYGE4FE";
const AXELAR_API = "https://api.axelarscan.io/gmp/searchGMP";
const SQUID_API = "https://apiplus.squidrouter.com/v2/rfq/order";
const provider = new ethers.JsonRpcProvider("https://polygon.llamarpc.com");

const CONFIG = {
  integratorId: "test-project-4ba94915-f432-4d42-89df-53c6de4dd93e",
};

const BATCH_SIZE = 20; // Number of parallel requests allowed

const limit = pLimit(BATCH_SIZE);

const commonParams = {
  module: "account",
  address: projectFPAddress,
  apikey: apiKey,
  startblock: 0,
  page: 1,
  sort: "asc",
  offset: 10,
};

export const transactionHashes: string[] = [];

// Function to fetch transactions for a specific action
async function fetchTransactions(action: string) {
  try {
    const params = { ...commonParams, action };
    const response = await axios.get(apiUrl, { params });

    if (response.data.status === "1" && response.data.result) {
      response.data.result.forEach((tx: any) => {
        transactionHashes.push(tx.hash); // Store the transaction hash
      });
    } else {
      console.log(`No transactions found for action: ${action}`);
    }
  } catch (error) {
    console.error(`Error fetching transactions for action ${action}:`, error);
  }
}

// Function to fetch transactions for both actions
export async function fetchAllTransactions() {
  await fetchTransactions("txlistinternal"); // Internal transactions
  //   await fetchTransactions("txlist"); // transactions
  // await fetchTransactions("tokentx"); // tokenTransfer

  return transactionHashes;
}

// Function to get transaction receipt from the blockchain
async function getTxReceipt(txHash: string) {
  try {
    const receipt = await provider.getTransactionReceipt(txHash);
    if (receipt) {
      return receipt.from;
    }
  } catch (error) {
    console.error("Error fetching transaction receipt:", error);
  }
  return null;
}

// Lookup a transaction using Axelar and Squid APIs
async function lookupTransaction(txHash: string) {
  if (!txHash.startsWith("0x")) {
    throw new Error("Transaction hash must start with 0x");
  }

  const axelarBody = { size: 1, txHash };
  try {
    // Axelar API call
    const axelarResponse = await axios.post(AXELAR_API, axelarBody, {
      headers: { "Content-Type": "application/json" },
    });

    if (axelarResponse.data.data && axelarResponse.data.data.length > 0) {
      const from = axelarResponse.data.data[0].call.receipt.from;
      console.log(`Transaction found in Axelar: ${from}`);
      return from;
    }
  } catch (error) {
    console.log(`Not found in Axelar: ${txHash}`);
  }

  try {
    // Squid API call
    const squidResponse = await axios.post(
      SQUID_API,
      { hash: txHash },
      {
        headers: {
          "Content-Type": "application/json",
          "x-integrator-id": CONFIG.integratorId,
        },
      }
    );

    if (squidResponse.data) {
      const from = squidResponse.data.fromAddress;
      console.log(`Transaction found in Squid: ${from}`);
      return from;
    }
  } catch (error) {
    console.log(`Not found in Squid: ${txHash}`);
  }

  // Fallback to on-chain receipt
  try {
    return getTxReceipt(txHash);
  } catch (error) {
    console.log("Error in getting from tx Receipt", txHash);
  }
  return null;
}

// Process all transaction hashes with batching and concurrency control
export async function processTransactionHashes(transactionHashes: string[]) {
  const addressToTxMap: Record<string, string[]> = {};
  const notFoundHashes: string[] = [];

  const promises = transactionHashes.map((txHash) =>
    limit(async () => {
      const fromAddress = await lookupTransaction(txHash);
      if (fromAddress) {
        const normalizedAddress = fromAddress.toLowerCase();
        if (!addressToTxMap[normalizedAddress]) {
          addressToTxMap[normalizedAddress] = [];
        }
        addressToTxMap[normalizedAddress].push(txHash);
      } else {
        notFoundHashes.push(txHash);
      }
    })
  );

  await Promise.all(promises);

  console.log("Address to Transaction Map:", addressToTxMap);
  console.log("Not Found Hashes:", notFoundHashes);

  return { addressToTxMap, notFoundHashes };
}

export async function getFromAddress() {
  const transactions = await fetchAllTransactions();
  console.log("Transactions:", transactions);

  await processTransactionHashes(transactions);
}

getFromAddress();
