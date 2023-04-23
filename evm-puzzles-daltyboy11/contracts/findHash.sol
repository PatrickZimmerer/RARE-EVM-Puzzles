// SPDX-License-Identifier: MIT

// Version as in hardhat config
pragma solidity 0.7.3;

contract FindHash {
    function find(uint256 i) external pure returns (bytes32) {
        return keccak256(abi.encode(i));
    }
}
