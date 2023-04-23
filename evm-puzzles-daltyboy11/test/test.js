const { expect } = require('chai');
const { BigNumber } = require('ethers');
const { parseEther } = require('ethers/lib/utils');
const { ethers } = require('hardhat');

describe('FindHash', () => {
	let findHash;

	beforeEach(async () => {
		const findHashFactory = await ethers.getContractFactory('FindHash');
		findHash = await findHashFactory.deploy();
		await findHash.deployed();
	});
	describe('find', () => {
		it('should find the correct hash', async () => {
			for (let i = 0; i < 1000; i++) {
				let hash = await findHash.find(i);
				if (hash.startsWith('0xa8')) {
					console.log(i);
				}
			}
		});
	});
});
