const { expect, assert } = require("chai");
const { BigNumber } = require('ethers')
const { waffle, artifacts, ethers} = require('hardhat')
const hre = require('hardhat')

const { DAI, DAI_WHALE, POOL_ACCESS_PROVIDER } = require('../config');

describe('Deploy Flash Loan', () => { 
    it("Should be able to take loan and return it", async () => {
        const flashLoan = await ethers.getContractFactory("FlashLoan")
    
        const _flashLoan = await flashLoan.deploy(POOL_ACCESS_PROVIDER) // https://docs.aave.com/developers/deployed-contracts/v3-mainnet/polygon
        await _flashLoan.deployed()

        const token = await ethers.getContractAt("IERC20", DAI) // to get the instanct of dai token
        const BALANCE_AMOUNT_DAI = ethers.utils.parseEther("2000")

         // Impersonate the DAI_WHALE account to be able to send transactions from that account

         await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [DAI_WHALE]
         })

         const signer = await ethers.getSigner(DAI_WHALE)
         await token
            .connect(signer)
            .transfer(_flashLoan.address, BALANCE_AMOUNT_DAI) // Sends our contract 2000 DAI from the DAI_WHALE

        const tx = await _flashLoan.createFlashLoans(1000, DAI);
        await tx.wait()
        const remainingBalance = await token.balanceOf(_flashLoan.address) // Check the balance of DAI in the Flash Loan contract afterwards

        expect(remainingBalance.lt(BALANCE_AMOUNT_DAI)).to.be.true;

    })

 })