import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const X402POLY_ABI = [
    "function getAllSites() view returns (tuple(uint256 price, address owner, string url, bool exists)[])"
];

// Use the address from environment or default (should match frontend)
const CONTRACT_ADDRESS = process.env.X402_CONTRACT_ADDRESS || "0xe5E43468bcBd09391bF73d0D43a624537c46bBa9";
const RPC_URL = process.env.RPC_URL || "https://rpc-amoy.polygon.technology";

export class SmartContractService {
    constructor() {
        this.provider = new ethers.JsonRpcProvider(RPC_URL);
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, X402POLY_ABI, this.provider);
    }

    async fetchRegisteredSites() {
        try {
            console.log(`Fetching sites from contract at ${CONTRACT_ADDRESS}...`);
            const sites = await this.contract.getAllSites();

            // Format sites for payment config
            const formattedSites = {};

            sites.forEach(site => {
                if (site.exists && site.url) {
                    // Parse price from Wei (6 decimals for USDC) to USD string
                    const priceInUsd = ethers.formatUnits(site.price, 6);

                    // Create route key (assuming GET request to the URL path)
                    // We need to extract the path from the URL
                    try {
                        const urlObj = new URL(site.url);
                        // If it's a root URL, we might want to protect everything or specific paths
                        // For now, let's assume we protect the root and subpaths
                        // But the current payment middleware matches exact routes or regex

                        // Let's use the full URL as the key for now, or map it to a route
                        // The proxy server matches based on the request URL.
                        // If the proxy forwards requests to these sites, we need to know how to match them.

                        // In the current architecture, the proxy receives a request and checks if it matches a payment route.
                        // If the user registers "https://mysite.com", we want to charge for requests to "https://mysite.com"

                        // The x402-express middleware typically matches on relative paths if used in an Express app,
                        // but here we are using it in a proxy context.

                        // Let's store it with the URL as the key, and the proxy will need to handle matching.
                        formattedSites[site.url] = {
                            price: `$${priceInUsd}`,
                            network: "polygon-amoy",
                            config: {
                                description: `Access to ${site.url}`,
                                inputSchema: {
                                    type: "object",
                                    properties: {
                                        userAgent: { type: "string" }
                                    }
                                }
                            }
                        };
                    } catch (e) {
                        console.warn(`Invalid URL in smart contract: ${site.url}`);
                    }
                }
            });

            console.log(`Loaded ${Object.keys(formattedSites).length} sites from smart contract.`);
            return formattedSites;
        } catch (error) {
            console.error("Error fetching sites from smart contract:", error);
            return {};
        }
    }
}

export const smartContractService = new SmartContractService();
