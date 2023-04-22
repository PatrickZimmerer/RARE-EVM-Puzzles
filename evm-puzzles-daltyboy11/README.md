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

- So if we have a calldatasize of `0x010203040506` (6bytes) and a value of 2 the last `JUMP` will land on the last `JUMPDEST` and we will sucesfully finish the first puzzle

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

- So if we pass in a value of `0x6080604052348015600f57600080fd5b50608e80601d6000396000f3fe6080604052348015600f57600080fd5b5060003660606040518060400160405280600a81526020017f31323334353637383961000000000000000000000000000000000000000000008152509050915050805190602001f3fea26469706673582212204e6df7f3469a66e9621c705ae4aa31be1157097ccc49417bfd702a82a33a863a64736f6c63430008100033` the `JUMP` will land on `JUMPDEST` and we will sucesfully finish the eighth puzzle

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
