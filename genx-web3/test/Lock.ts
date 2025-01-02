import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyNFT Contract", function () {
  let owner: any;
  let addr1: any;
  let myNFT: any;

  beforeEach(async function () {
    // Get the signers
    [owner, addr1] = await ethers.getSigners();

    // Deploy the contract with the initialOwner set to the owner's address
    const MyNFT = await ethers.getContractFactory("MyNFT");
    myNFT = await MyNFT.deploy(await owner.getAddress());
  
  });

  it("Should mint and assign NFT to the recipient", async function () {
    const tokenURI = "ipfs://QmSomeHash/metadata.json";

    // Mint the NFT (only the owner can mint)
    await myNFT.connect(owner).mintNFT(await addr1.getAddress(), tokenURI);

    // Check the owner of the token
    const ownerOfToken = await myNFT.ownerOf(1);
    expect(ownerOfToken).to.equal(await addr1.getAddress());

    // Check the token URI
    const tokenUri = await myNFT.tokenURI(1);
    expect(tokenUri).to.equal(tokenURI);
  });
});
