// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    constructor(address initialOwner) ERC721("MyNFT", "MNFT") Ownable(initialOwner) {}

    /**
     * @dev Mint a new NFT to a specific address.
     * @param recipient The address to receive the NFT.
     * @param tokenURI The metadata URI for the NFT.
     * @return The ID of the newly minted token.
     */
    function mintNFT(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIds += 1; // Increment token ID
        uint256 newItemId = _tokenIds;

        _mint(recipient, newItemId); // Mint the NFT
        _setTokenURI(newItemId, tokenURI); // Set the token URI (metadata)

        return newItemId;
    }
}
