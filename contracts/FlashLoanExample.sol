// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FlashLoan is FlashLoanSimpleReceiverBase {

    using SafeMath for uint;
    event Log(address asset, uint val);

    constructor(IPoolAddressesProvider provider) FlashLoanSimpleReceiverBase(provider){}

    function createFlashLoans(uint256 amount, address asset) external {
        address reciever = address(this);
        bytes memory params = "";
        uint16 referralCode = 0;

        POOL.flashLoanSimple(reciever, asset, amount, params, referralCode);
    }
    function executeOperation(address asset,uint256 amount,uint256 premium,address initiator,bytes calldata params) external returns(bool){
        uint256 amountOwing = amount.add(premium);   // do things like arbitrage, liquidation, etc
        IERC20(asset).approve(address(POOL), amountOwing);       // abi.decode(params) to decode params
        emit Log(asset, amountOwing);
        return true;
    }
}