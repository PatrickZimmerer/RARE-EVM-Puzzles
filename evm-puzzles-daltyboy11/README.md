# Original source: <https://github.com/daltyboy11/more-evm-puzzles>

- The real Readme will follow after my solutions

## Solutions

The goal of those puzzles is to enter the right transaction (with the right data) to get the execution not reverted.

### Puzzle 1

```assembly
############
# Puzzle 1 #
############

00      36      CALLDATASIZE
01      34      CALLVALUE
02      0A      EXP
03      56      JUMP
04      FE      INVALID
05      FE      INVALID
06      FE      INVALID
07      FE      INVALID
08      FE      INVALID
09      FE      INVALID
0A      FE      INVALID
0B      FE      INVALID
0C      FE      INVALID
0D      FE      INVALID
0E      FE      INVALID
0F      FE      INVALID
10      FE      INVALID
11      FE      INVALID
12      FE      INVALID
13      FE      INVALID
14      FE      INVALID
15      FE      INVALID
16      FE      INVALID
17      FE      INVALID
18      FE      INVALID
19      FE      INVALID
1A      FE      INVALID
1B      FE      INVALID
1C      FE      INVALID
1D      FE      INVALID
1E      FE      INVALID
1F      FE      INVALID
20      FE      INVALID
21      FE      INVALID
22      FE      INVALID
23      FE      INVALID
24      FE      INVALID
25      FE      INVALID
26      FE      INVALID
27      FE      INVALID
28      FE      INVALID
29      FE      INVALID
2A      FE      INVALID
2B      FE      INVALID
2C      FE      INVALID
2D      FE      INVALID
2E      FE      INVALID
2F      FE      INVALID
30      FE      INVALID
31      FE      INVALID
32      FE      INVALID
33      FE      INVALID
34      FE      INVALID
35      FE      INVALID
36      FE      INVALID
37      FE      INVALID
38      FE      INVALID
39      FE      INVALID
3A      FE      INVALID
3B      FE      INVALID
3C      FE      INVALID
3D      FE      INVALID
3E      FE      INVALID
3F      FE      INVALID
40      5B      JUMPDEST
41      58      PC
42      36      CALLDATASIZE
43      01      ADD
44      56      JUMP
45      FE      INVALID
46      FE      INVALID
47      5B      JUMPDEST
48      00      STOP
```

- Identify the target => need to get to index 0x47 where 'JUMPDEST' is located

- First challenge is to make the `EXP` of `CALLDATASIZE` & `CALLVALUE` to be 0x40 (64) which will get us to the first `JUMPDEST`

- Second challenge is to make `ADD` of `PC` (which is 0x41) & `CALLDATASIZE` to be 0x47 (64) which will get us to the last `JUMPDEST`

- So if we have a calldata of `0x010203040506` (6bytes) and a value of 2 the last `JUMP` will land on the last `JUMPDEST` and we will sucesfully finish the first puzzle

### Puzzle 2

```assembly
############
# Puzzle 2 #
############

00      36        CALLDATASIZE
01      6000      PUSH1 00
03      6000      PUSH1 00
05      37        CALLDATACOPY
06      36        CALLDATASIZE
07      6000      PUSH1 00
09      6000      PUSH1 00
0B      F0        CREATE
0C      6000      PUSH1 00
0E      80        DUP1
0F      80        DUP1
10      80        DUP1
11      80        DUP1
12      94        SWAP5
13      5A        GAS
14      F1        CALL
15      3D        RETURNDATASIZE
16      600A      PUSH1 0A
18      14        EQ
19      601F      PUSH1 1F
1B      57        JUMPI
1C      FE        INVALID
1D      FE        INVALID
1E      FE        INVALID
1F      5B        JUMPDEST
20      00        STOP
```

- Identify the target => need to get to index 1F (31) where 'JUMPDEST' is located

- `CALL` will call our created contract and `RETURNDATASIZE` will get us the length in bytes which were returned by the contract, so we need to deploy a contract that returns the value 10 when being called to pass the `PUSH1 0A` => `EQ` check afterwards and the `JUMPI` will bring us to the goal

- So we just need to deploy a contract that returns 10 when we call it, so I made a simple smart contract in solidity and got the bytecode which will be used below

```solidity
contract AlwaysReturn10 {
    fallback(bytes calldata) external returns(bytes memory) {
        return bytes("123456789a");
    }
}
```

- So if we pass in a calldata of `0x6080604052348015600f57600080fd5b50608e80601d6000396000f3fe6080604052348015600f57600080fd5b5060003660606040518060400160405280600a81526020017f31323334353637383961000000000000000000000000000000000000000000008152509050915050805190602001f3fea26469706673582212204e6df7f3469a66e9621c705ae4aa31be1157097ccc49417bfd702a82a33a863a64736f6c63430008100033` the `JUMP` will land on `JUMPDEST` and we will sucesfully finish the second puzzle

### Puzzle 3

```assembly
############
# Puzzle 3 #
############

00      36        CALLDATASIZE
01      6000      PUSH1 00
03      6000      PUSH1 00
05      37        CALLDATACOPY
06      36        CALLDATASIZE
07      6000      PUSH1 00
09      6000      PUSH1 00
0B      F0        CREATE
0C      6000      PUSH1 00
0E      80        DUP1
0F      80        DUP1
10      80        DUP1
11      93        SWAP4
12      5A        GAS
13      F4        DELEGATECALL
14      6005      PUSH1 05
16      54        SLOAD
17      60AA      PUSH1 AA
19      14        EQ
1A      601E      PUSH1 1E
1C      57        JUMPI
1D      FE        INVALID
1E      5B        JUMPDEST
1F      00        STOP
```

- Identify the target => need to get to index 1E (30) where 'JUMPDEST' is located

- We just need our `SLOAD` to return `0xaa` when it is loading from the fifth sotrage slot so we can just initalize a contract with the value 0xaa at the fifth storage slot and pass in its bytecode

```assembly
// initialization code
PUSH1 0x05 // length of runtimecode
PUSH1 0x0C // location of runtime code
PUSH1 0x00 // memory position
CODECOPY   // copy bytecode
PUSH1 0x05 // length of runtimecode
PUSH1 0x00 // read from memory at 0
RETURN
// runtime code
PUSH1 0xAA // desired value
PUSH1 0x05 // storage slot
SSTORE     // store command
```

This translates to `0x6005600C60003960056000F360AA600555`

- So if we pass in a calldata of `0x6005600C60003960056000F360AA600555` the `JUMP` will land on `JUMPDEST` and we will sucesfully finish the third puzzle

### Puzzle 4

```assembly
############
# Puzzle 4 #
############

00      30        ADDRESS
01      31        BALANCE
02      36        CALLDATASIZE
03      6000      PUSH1 00
05      6000      PUSH1 00
07      37        CALLDATACOPY
08      36        CALLDATASIZE
09      6000      PUSH1 00
0B      30        ADDRESS
0C      31        BALANCE
0D      F0        CREATE
0E      31        BALANCE
0F      90        SWAP1
10      04        DIV
11      6002      PUSH1 02
13      14        EQ
14      6018      PUSH1 18
16      57        JUMPI
17      FD        REVERT
18      5B        JUMPDEST
19      00        STOP
```

- Identify the target => need to get to index 19 (25) where 'JUMPDEST' is located

- We need our `BALANCE` after `CREATE` to return half the amount we sent as a call value, so we need to get rid of 50% of our sent wei so the following `DIV` opcode will result in 2, since after that `PUSH1 0x02` and `EQ` will check if our result equals 2

```assembly
PUSH1 0x00 // needed param for call
DUP1       // needed param for call
DUP1       // needed param for call
DUP1       // needed param for call
// now calculate the value by getting the balance divided by 2 and send to arbitrary address
PUSH1 0x02 // Push 2
CALLVALUE  // Pushes the sent amount in wei to the stack
DIV        // Divide by 2 => Result is now on top of the stack
DUP2       // zero address to burn half our wei
GAS        // 5A needed param for CALL
CALL       // F1 => success bool is now on to of the stack
PUSH1 0x00 // 0 to the stack
DUP1       // Duplicate
RETURN     // Return
```

- So if we pass in a calldata of `600080808060023404815af1600080f3` and an arbitrary number that is dividable by 2 the `JUMP` will land on `JUMPDEST` and we will sucesfully finish the fourth puzzle

### Puzzle 5

```assembly
############
# Puzzle 5 #
############

00      6020      PUSH1 20
02      36        CALLDATASIZE
03      11        GT
04      6008      PUSH1 08
06      57        JUMPI
07      FD        REVERT
08      5B        JUMPDEST
09      36        CALLDATASIZE
0A      6000      PUSH1 00
0C      6000      PUSH1 00
0E      37        CALLDATACOPY
0F      36        CALLDATASIZE
10      59        MSIZE
11      03        SUB
12      6003      PUSH1 03
14      14        EQ
15      6019      PUSH1 19
17      57        JUMPI
18      FD        REVERT
19      5B        JUMPDEST
1A      00        STOP
```

- Identify the target => need to get to index 19 (25) where 'JUMPDEST' is located

- First challenge is to make the `CALLDATASIZE` be `GT` than `0x20` (32) which will get us to the first `JUMPDEST` at `08`

- Now the `CALLDATA` gets copied to the memory then the `CALLDATASIZE` gets pushed and then the `MSIZE` which gets the size of active memory in bytes, now we `SUB` which will result in `MSIZE - CALLDATASIZE` on the stack now the ruslt of that needs to `EQ` the value 3 wo allow our `JUMPI` to jump to the next `JUMPDEST`

- Second challenge is to make `MSIZE` - `CALLDATASIZE` == `3` to calculate the `MSIZE` we just need to know our data must be `GT 0x20` which means we will need at minimum 2 memory slots since one only can fit 32 bytes, so it will start at 0x40 (64 bytes) as long as our `CALLDATA` is not greater than 64 bytes obivously

- We could also send an arbitrary length of Calldata as long it's 3 bytes lower than the memory it will take up e.g. 93 bytes => 96 bytes - 93 bytes, 125 bytes => 128bytes - 125 bytes

- So if we pass in a calldata of `11223344556677889910111213141516171819202122232425262728293031323334353637383940414243444546474849505152535455565758596061` or an arbitrary 61 bytes calldata the `JUMP` will land on `JUMPDEST` and we will sucesfully finish the fifth puzzle

### Puzzle 6

```assembly
############
# Puzzle 6 #
############

00      7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF0      PUSH32 FF...F0
21      34                                                                      CALLVALUE
22      01                                                                      ADD
23      6001                                                                    PUSH1 01
25      14                                                                      EQ
26      602A                                                                    PUSH1 2A
28      57                                                                      JUMPI
29      FD                                                                      REVERT
2A      5B                                                                      JUMPDEST
2B      00                                                                      STOP
```

- Identify the target => need to get to index 19 (25) where 'JUMPDEST' is located

- First the max uint256 - 15 (last hex is empty which equals 0 and F would be 15) now the callvalue gets pushed to the stack and `ADD` gets performed. Now we `PUSH1 01` and check if the values are equal and if so we can `JUMPI`

- So we just need to send a callvalue of 17 to cause an overflow and start over at 1 and the `JUMP` will land on `JUMPDEST` and we will sucesfully finish the sixth puzzle

### Puzzle 7

```assembly
############
# Puzzle 7 #
############

00      5A        GAS
01      34        CALLVALUE
02      5B        JUMPDEST
03      6001      PUSH1 01
05      90        SWAP1
06      03        SUB
07      80        DUP1
08      6000      PUSH1 00
0A      14        EQ
0B      6011      PUSH1 11
0D      57        JUMPI
0E      6002      PUSH1 02
10      56        JUMP
11      5B        JUMPDEST
12      5A        GAS
13      90        SWAP1
14      91        SWAP2
15      03        SUB
16      60A6      PUSH1 A6
18      14        EQ
19      601D      PUSH1 1D
1B      57        JUMPI
1C      FD        REVERT
1D      5B        JUMPDEST
1E      00        STOP
```

- Identify the target => need to get to index 19 (25) where 'JUMPDEST' is located

- First we need to make sure our `CALLVALUE` will result in zero when getting subtracted by 1 to get the `JUMPI` to get us out of that loop at indexes `0E PUSH1 02 + JUMP` which will cause us to start over again, but first we need to spend some more gas

- So the second challenge takes our initial `GAS` which is stored until we reach index 14 `SWAP2 => SUB` which will subtract our current `GAS` from our initial `GAS` and check if the result is equal to `A6 (166)` so we need to go through the loop mentioned above a certain amount of times to reduce our remaining gas. The first iteration will end up costing us 47 gas each other iteration will cost 43 gas, so if we go through the loop 3 times will cost 133 gas, now we want to break out of that loop and reach our check mentioned above to complete the challenge

- So we just need to send a callvalue of 4 to loop 3 times and break out of the loop after that `JUMP` will land on `JUMPDEST` and we will sucesfully finish the seventh puzzle

### Puzzle 8

```assembly
############
# Puzzle 8 #
############

00      34        CALLVALUE
01      15        ISZERO
02      19        NOT
03      6007      PUSH1 07
05      57        JUMPI
06      FD        REVERT
07      5B        JUMPDEST
08      36        CALLDATASIZE
09      6000      PUSH1 00
0B      6000      PUSH1 00
0D      37        CALLDATACOPY
0E      36        CALLDATASIZE
0F      6000      PUSH1 00
11      6000      PUSH1 00
13      F0        CREATE
14      47        SELFBALANCE
15      6000      PUSH1 00
17      6000      PUSH1 00
19      6000      PUSH1 00
1B      6000      PUSH1 00
1D      47        SELFBALANCE
1E      86        DUP7
1F      5A        GAS
20      F1        CALL
21      6001      PUSH1 01
23      14        EQ
24      6028      PUSH1 28
26      57        JUMPI
27      FD        REVERT
28      5B        JUMPDEST
29      47        SELFBALANCE
2A      14        EQ
2B      602F      PUSH1 2F
2D      57        JUMPI
2E      FD        REVERT
2F      5B        JUMPDEST
30      00        STOP
```

- Identify the target => need to get to index 2F (47) where 'JUMPDEST' is located

- First we need to understand the first lines where it doesn't matter which callvalue we send it checks if it `ISZERO` and then the `NOT` operator flipps all bits from 0 => 1 and 1 => 0 se we will always end up with a value of type(uint256).max or type(uint256).max - 1 after the `NOT` operator the value doesn't get stored so itÄ's not important, the callvalue will come into play later because of `SELFBALANCE`

- Now the `CALLDATA` gets copied to memory and it gets `CREATE`ed and the `SELFABALANCE` gets pushed to the stack after that 4 zeros get pushed and the `SELFBALANCE` gets pushed again, now `DUP7` will duplicate the address of the created contract and we add `GAS` + `CALL` the contract, if that CALL is successfull we will pass the following `EQ` and `JUMPI` to index 28

- We are now left with the initially passed in `CALLVALUE` (in form of SELFBALANCE) on top of the stack and the address of the contract below that now `SELFBALANCE` gets pushed ontop of the stack and gets checked for the old equality

- This leads us to deploying a contract that should return us the sent value when being called function should look like this

Runtime code

```assembly
PUSH1 00    // 6000
DUP1        // 80
DUP1        // 80
DUP1        // 80
SELFBALANCE // 47
CALLER      // 33
GAS         // 5A
CALL        // F1
```

=> `600080808047335AF1`

Creation code

```assembly
PUSH9 0x600080808047335AF1 // runtime code
PUSH1 0x00
MSTORE

PUSH1 0x09
PUSH1 0x17
RETURN
```

=> `68600080808047335AF160005360096017F3600080808047335AF1`

- So we just need to send a calldata of `68600080808047335AF160005360096017F3600080808047335AF1` and `JUMP` will land on `JUMPDEST` and we will sucesfully finish the eigth puzzle

### Puzzle 9

```assembly
############
# Puzzle 9 #
############

00      34        CALLVALUE
01      6000      PUSH1 00
03      52        MSTORE
04      6020      PUSH1 20
06      6000      PUSH1 00
08      20        SHA3
09      60F8      PUSH1 F8
0B      1C        SHR
0C      60A8      PUSH1 A8
0E      14        EQ
0F      6016      PUSH1 16
11      57        JUMPI
12      FD        REVERT
13      FD        REVERT
14      FD        REVERT
15      FD        REVERT
16      5B        JUMPDEST
17      00        STOP
```

- Identify the target => need to get to index 16 (22) where 'JUMPDEST' is located

- First the `CALLVALUE` gets stored with an offset of 0

- Now the `SHA3` will create a keccak256 hash of the value stored at offset 0, with the size of 0x20 (32 bytes)

- 0xF8 gets pushed to the stack, now we will `SHR` which shifts for 0xF8 (248) bits to the right, now if we manage to get a value of 0xA8 after that we would pass the `EQ` check and `JUMPI` to the desired location

- So we only need to pass in a value which will result in a keccask256 hash that starts with 0xA8 to pass since the `SHR` will remove the other bits anyways 256 - 248 = 8 => 1 byte

- I spun up a quick hardhat test which bruteforces me the hashes which would result in us solving the challenge

Contract:

```solidity
contract FindHash {
    function find(uint256 i) external pure returns (bytes32) {
        return keccak256(abi.encode(i));
    }
}
```

Test:

```javascript
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
```

- So we just need to send a callvalue of `47` or `69` and we will sucesfully finish the 9th puzzle

### Puzzle 10

```assembly
#############
# Puzzle 10 #
#############

00      6020                                                                    PUSH1 20
02      6000                                                                    PUSH1 00
04      6000                                                                    PUSH1 00
06      37                                                                      CALLDATACOPY
07      6000                                                                    PUSH1 00
09      51                                                                      MLOAD
0A      7FF0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0      PUSH32 F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0
2B      16                                                                      AND
2C      6020                                                                    PUSH1 20
2E      6020                                                                    PUSH1 20
30      6000                                                                    PUSH1 00
32      37                                                                      CALLDATACOPY
33      6000                                                                    PUSH1 00
35      51                                                                      MLOAD
36      17                                                                      OR
37      7FABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABAB      PUSH32 ABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABAB
58      14                                                                      EQ
59      605D                                                                    PUSH1 5D
5B      57                                                                      JUMPI
5C      FD                                                                      REVERT
5D      5B                                                                      JUMPDEST
5E      00                                                                      STOP
```

- Identify the target => need to get to index 5D (93) where 'JUMPDEST' is located

- First the first 32 bytes of our `CALLDATA` get stored to memory with an offset && destoffset of 0

- Now we `MLOAD` the first 32 bytes of our calldata, and psuh 32 bytes of `F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0` a single set of `f0` will look like this in binary `11110000` to the stack, then we perform an `AND` bit operation which will flip all bits to a 0 if not both bits are set so => `111000111 AND 11001110` will result in `11000110` for example

- In the next steps we will do the same as in the first step but just with our second 32 bytes of calldata => store them => load them and then perform an `OR` operation on our existing value after the `AND` operation and the second 32 bytes of our calldata

- We push 32 bytes `ABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABAB` to the stack and check for equality to our value after the `OR` operation, so if you understand the `AND & OR` operations you know that you have to pass in a calldata where the first 32 bytes need to be in this pattern AXAXAXAXAX where the value of X doesn't matter since its an AND operation, and the second 32 bytes need to have this pattern ABABAB for 32 bytes consecutive

- So we need to send a calldata of `abababababababababababababababababababababababababababababababababababababababababababababababababababababababababababababababab` (64 bytes worth of ab's) and we will sucesfully finish the last puzzle

## 10 more EVM puzzles

Here are 10 more puzzles, inspired by the 10 EVM puzzles created by [@fvictorio](https://github.com/fvictorio/evm-puzzles). These ones are harder and more focused on the CREATE and CALL opcodes. Have fun!

Each puzzle consists of sending a successful transaction to a contract. The bytecode of the contract is provided, and you need to fill the transaction CALLDATA and CALLVALUE that won't revert the execution.

## How to play

Clone this repository and install its dependencies (`npm install` or `yarn`). Then run:

```
npx hardhat play
```

And the game will start.

In some puzzles you only need to provide the value that will be sent to the contract, in others the calldata, and in others both values.

You can use [`evm.codes`](https://www.evm.codes/)'s reference and playground to work through this.
