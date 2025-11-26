// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract x402poly {
    struct Site {
        uint256 price; // price per scrape
        address owner; // website owner
        string url; // website URL
        bool exists;
    }

    IERC20 public immutable paymentToken;

    // siteId → Site
    mapping(bytes32 => Site) public sites;

    // Track all registered site IDs
    bytes32[] public allSiteIds;

    // user → siteId → hasPaid
    mapping(address => mapping(bytes32 => bool)) public hasAccess;

    // escrow balances for website owners
    mapping(address => uint256) public pendingWithdrawals;

    event SiteRegistered(
        bytes32 indexed siteId,
        uint256 price,
        address owner,
        string url
    );
    event PriceUpdated(bytes32 indexed siteId, uint256 price);
    event AccessPurchased(
        address indexed buyer,
        bytes32 indexed siteId,
        uint256 amount
    );
    event Withdraw(address indexed owner, uint256 amount);

    constructor(address _paymentToken) {
        paymentToken = IERC20(_paymentToken);
    }

    function registerSite(
        bytes32 siteId,
        uint256 price,
        string memory url
    ) external {
        require(!sites[siteId].exists, "Site already exists");
        require(price > 0, "Price must be > 0");

        sites[siteId] = Site({
            price: price,
            owner: msg.sender,
            url: url,
            exists: true
        });

        allSiteIds.push(siteId);

        emit SiteRegistered(siteId, price, msg.sender, url);
    }

    function updatePrice(bytes32 siteId, uint256 newPrice) external {
        require(sites[siteId].exists, "Site not found");
        require(sites[siteId].owner == msg.sender, "Not site owner");
        require(newPrice > 0, "Invalid price");

        sites[siteId].price = newPrice;

        emit PriceUpdated(siteId, newPrice);
    }

    function buyAccess(bytes32 siteId) external {
        require(sites[siteId].exists, "Site not found");

        Site memory s = sites[siteId];

        // transfer USDC → escrow (contract)
        bool ok = paymentToken.transferFrom(msg.sender, address(this), s.price);
        require(ok, "Payment failed");

        // record credit for site owner
        pendingWithdrawals[s.owner] += s.price;

        // grant access
        hasAccess[msg.sender][siteId] = true;

        emit AccessPurchased(msg.sender, siteId, s.price);
    }

    function getAllSites() external view returns (Site[] memory) {
        Site[] memory allSites = new Site[](allSiteIds.length);
        for (uint i = 0; i < allSiteIds.length; i++) {
            allSites[i] = sites[allSiteIds[i]];
        }
        return allSites;
    }
}
