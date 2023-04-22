# Original source: <https://github.com/fvictorio/evm-puzzles>

- The real Readme will follow after my solutions

## Solutions

The goal of those puzzles is to enter the right transaction (with the right data) to get the execution not reverted.

### Puzzle 1

```assembly
############
# Puzzle 1 #
############

00      34      CALLVALUE
01      56      JUMP
02      FD      REVERT
03      FD      REVERT
04      FD      REVERT
05      FD      REVERT
06      FD      REVERT
07      FD      REVERT
08      5B      JUMPDEST
09      00      STOP
```

- Identify the target => need to get to index 08 where 'JUMPDEST' is located

- First opcode is `CALLVALUE` which will push the value sent in Wei to the Stack

- So if we have a callvalue of `0x08` the `JUMP` will land on `JUMPDEST` and we will sucesfully finish the first puzzle

### Puzzle 2

```assembly
############
# Puzzle 2 #
############

00      34      CALLVALUE
01      38      CODESIZE
02      03      SUB
03      56      JUMP
04      FD      REVERT
05      FD      REVERT
06      5B      JUMPDEST
07      00      STOP
08      FD      REVERT
09      FD      REVERT
```

- Identify the target => need to get to index 06 where 'JUMPDEST' is located

- First opcode is `CALLVALUE` which will push the value sent in Wei to the Stack

- Second opcode is `CODESIZE` which will push the size of the current code (index 00 - 09 => 10) onto the stack

- Third opcode is `SUB` which will subtract the numbers on the stack so we need to calculate how we reach index 06 and since `CODESIZE` = 0x0a we need to subtract 4 of that (10 - 4) => 6

- So if we have a callvalue of `0x04` the `JUMP` will land on `JUMPDEST` and we will sucesfully finish the second puzzle

### Puzzle 3

```assembly
############
# Puzzle 3 #
############

00      36      CALLDATASIZE
01      56      JUMP
02      FD      REVERT
03      FD      REVERT
04      5B      JUMPDEST
05      00      STOP
```

- Identify the target => need to get to index 04 where 'JUMPDEST' is located

- First opcode is `CALLDATASIZE` which will push the bytee size of the calldata value to the stack

- So if we send any calldata with a length of 4 bytes we will pass

- So if we have a calldata of `0x01010101` or any arbitrary calldata with the length of 4 bytes the `JUMP` will land on `JUMPDEST` and we will sucesfully finish the third puzzle

### Puzzle 4

```assembly
############
# Puzzle 4 #
############

00      34      CALLVALUE
01      38      CODESIZE
02      18      XOR
03      56      JUMP
04      FD      REVERT
05      FD      REVERT
06      FD      REVERT
07      FD      REVERT
08      FD      REVERT
09      FD      REVERT
0A      5B      JUMPDEST
0B      00      STOP
```

- Identify the target => need to get to index 0a (10) where 'JUMPDEST' is located

- First opcode is `CALLVALUE` which will push the value sent in Wei to the Stack

- Second opcode is `CODESIZE` which will push the size of the current code (index 00 - 0B => 12) onto the stack

- Third opcode is `XOR` which will perform a bit shift (0 => 1 || 1 => 0) ONLY IF both bits are different e.g.

first value => 11001100
second value => 01010101
so now all equal bits will become 0, the bits with a difference will become 1
example res => 10011001

- Now we need to think in bits and get the value 10 as a bit value which is `1010` that's the result our `XOR` should output in the end

- We know `CODESIZE` will harvest 12 as a value which results in `1100` so we need to pass in a callvalue which will result in `0110` which is 6 and will result in our desired bitvalue `1010`

- So if we have a callvalue of `0x06` the `JUMP` will land on `JUMPDEST` and we will sucesfully finish the fourth puzzle

### Puzzle 5

```assembly
############
# Puzzle 5 #
############

00      34          CALLVALUE
01      80          DUP1
02      02          MUL
03      610100      PUSH2 0100
06      14          EQ
07      600C        PUSH1 0C
09      57          JUMPI
0A      FD          REVERT
0B      FD          REVERT
0C      5B          JUMPDEST
0D      00          STOP
0E      FD          REVERT
0F      FD          REVERT
```

- Identify the target => need to get to index 0c (12) where 'JUMPDEST' is located

- First opcode is `CALLVALUE` which will push the value sent in Wei to the Stack

- Second opcode is `DUP1` which will duplicate the value on the stack and push the duplicate onto the stack

- Third opcode is `MUL` which will perform a multiplication of the next 2 values on the stack

- Next opcode is `PUSH2 0100` which will push a 2 bytes value of 0100 (128) onto the stack

- Next opcode is `EQ` which will check the next 2 values on the stack for equality and push a 0 (false) or 1 (true) onto the stack based on the outcome of the check

- Next opcode is `PUSH1 0C` which will push 0c (12) to the stack which is our desired location

- Now we only need to understand the `JUMPI` opcode which only jumps to the location (top of the stack) if the value after that is truthy (not 0) which basically means to pass the puzzle we need the `EQ` opcode to harvest a truthy value

- So if we pass in a value of x where x² == 128 which will be 10 (16)

- So if we have a callvalue of `0x10` the `JUMP` will land on `JUMPDEST` and we will sucesfully finish the fifth puzzle

### Puzzle 6

```assembly
############
# Puzzle 6 #
############

00      6000      PUSH1 00
02      35        CALLDATALOAD
03      56        JUMP
04      FD        REVERT
05      FD        REVERT
06      FD        REVERT
07      FD        REVERT
08      FD        REVERT
09      FD        REVERT
0A      5B        JUMPDEST
0B      00        STOP
```

- Identify the target => need to get to index 0a (10) where 'JUMPDEST' is located

- First opcode is `PUSH1 00` which will push a 0 onto the stack

- Second opcode is `CALLDATALOAD` which will change the 32-byte value starting from the given offset of the calldata (in our case 0). All bytes after the end of the calldata are set to 0.

- Quick example:

=> First value on the stack = 0
=> `CALLDATALOAD` with a calldata of `0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF` will result in
=> ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff on the stack

=> First value on the stack = 31
=> `CALLDATALOAD` with a calldata of `0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF` will result in
=> ff00000000000000000000000000000000000000000000000000000000000000 on the stack since the 31 bytes of offset will result in only 1 byte being persisted

- This leads us to passing in a 32 bytes value that results in 0a (10) since the offest is zero we don't really have to take that into consideration in our case

- So if we pass in a value of `0x000000000000000000000000000000000000000000000000000000000000000a` the `JUMP` will land on `JUMPDEST` and we will sucesfully finish the sixth puzzle

### Puzzle 7

```assembly
############
# Puzzle 7 #
############

00      36        CALLDATASIZE
01      6000      PUSH1 00
03      80        DUP1
04      37        CALLDATACOPY
05      36        CALLDATASIZE
06      6000      PUSH1 00
08      6000      PUSH1 00
0A      F0        CREATE
0B      3B        EXTCODESIZE
0C      6001      PUSH1 01
0E      14        EQ
0F      6013      PUSH1 13
11      57        JUMPI
12      FD        REVERT
13      5B        JUMPDEST
14      00        STOP
```

- Identify the target => need to get to index 14 (20) where 'JUMPDEST' is located

- First opcode is `CALLDATASIZE` which will push the byte size of the calldata value to the stack

- Second opcode is `PUSH1 00` which will just push the number 0 to the stack.

- Third opcode is `DUP1` which will perform a duplication of the next value on the stack.

- Next opcode is `CALLDATACOPY` so when a smart contract receives some calldata, it can use the `CALLDATACOPY` opcode to copy some or all of that data to its own memory, where it can be processed and used to execute the contract's code. This opcode takes three parameters: the starting position in the calldata, the starting position in the contract's memory, and the number of bytes to copy. In our case we save the Calldata at destination offset 0 and offset of 0 and it has the size of calldata through `CALLDATASIZE`

- Next opcode is `CALLDATASIZE` which will push the byte size of the calldata value to the stack

- Next two opcodes are `PUSH1 00` which will just push the number 0 to the stack twice.

- Next opcode is `CREATE` which will create a new contract and enters a new sub context of the calculated destination address it also executes the provided initialisation code, then resumes the current context. It also takes 3 inputs from the stack:

1. value: value in wei to send to the new account.
2. offset: byte offset in the memory in bytes, the initialisation code for the new account.
3. size: byte size to copy (size of the initialisation code).
   => The result on the stack will be the address of the deployed contract and 0 if the deployment failed.

- Next opcode is `EXTCODESIZE` which takes a 20-byte address of the contract to query as an argument and push the byte size of the contract to the stack.

- Next opcode is `PUSH1 01` which will just push the number 1 to the stack.
- Next opcode is `EQ` which will check for equality and push 0 or 1 (false or true) to the stack depending on the outcome.

- Next opcode is `PUSH1 13` which will just push the number 13 to the stack.

- Next opcode is `JUMPI` opcode which only jumps to the location (top of the stack) if the value after that is truthy (not 0)

- So the goal here is to sucesfully create a contract with the `CREATE` opcode where the contracts byte size == 1 which will result in a 1 at the stack after pushing the 13 (destination) the `JUMPI` opcode will jump to the desired `JUMPDEST`

- With the help of the following code and the EVM Playground <https://www.evm.codes/playground?callValue=0&unit=Wei&codeType=Bytecode&code=%276160016000526002601Ef3%27_&fork=merge> I grasped the concept of the `CREATE` opcode.

```assembly
// Creates a constructor that creates a contract with 32 FF as code
PUSH32 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
PUSH1 0
MSTORE
//Opcodes to return 32 ff
PUSH32 0xFF60005260206000F30000000000000000000000000000000000000000000000
PUSH1 32
MSTORE

// Create the contract with the constructor code above
PUSH1 41
PUSH1 0
PUSH1 0
CREATE // Puts the new contract address on the stack

// The address is on the stack, we can query the size
EXTCODESIZE
```

- This leads us to passing in any calldata that consists of an opcode that effectively returns 1 when being deployed e.g. 6001 (PUSH1 01)
- Calldata that would return 1 when being deployed this will happen =>

1. Push 1 with `PUSH1 01` 60 01
2. Push 0 with `PUSH1 00` 60 00
3. Store in Memory with `MSTORE` 52
4. Push 1 with `PUSH1 01` 60 01 (to later return 1 byte)
5. Push 1f with `PUSH1 1f` 60 1f (offset to return the padded byte we want since we always store in 32 bytes its padded with 31 x 0 in the memory)
6. Return (offset,size) => (31,1) => will return one with `RETURN` f3

- So if we pass in a value of `0x60016000526001601ff3` the `JUMP` will land on `JUMPDEST` and we will sucesfully finish the seventh puzzle

### Puzzle 8

```assembly
############
# Puzzle 8 #
############

00      36        CALLDATASIZE
01      6000      PUSH1 00
03      80        DUP1
04      37        CALLDATACOPY
05      36        CALLDATASIZE
06      6000      PUSH1 00
08      6000      PUSH1 00
0A      F0        CREATE
0B      6000      PUSH1 00
0D      80        DUP1
0E      80        DUP1
0F      80        DUP1
10      80        DUP1
11      94        SWAP5
12      5A        GAS
13      F1        CALL
14      6000      PUSH1 00
16      14        EQ
17      601B      PUSH1 1B
19      57        JUMPI
1A      FD        REVERT
1B      5B        JUMPDEST
1C      00        STOP
```

- Identify the target => need to get to index 1c (28) where 'JUMPDEST' is located

#### From here on I will not list up all opcodes just new ones to explain them and increase my learning effect

- Basically the same setup from index 00 to 0A (10) we created our contract and now have the address of that on the stack and the calldata copied to the 0th slot with 0 offset

- Now we push 0 to the stack and duplicate that 4times so our stack is now form top to bottom => [0, 0, 0, 0, 0, addressOfContract] after `SWAP5` the address will be on top of the stack and the stack will look like this top to bottom [addressOfContract, 0, 0, 0, 0, 0] (address is now on top)

- Next opcode is `GAS` which pushes the remaining gas to the stack

- Next opcode is `CALL` that creates a new sub context and execute the code of the given account, then resumes the current one. Note that an account with no code will return success as true. It takes 7 arguments (exactly the amount of items on our stack) as following:

1. gas: amount of gas to send to the sub context to execute. The gas that is not used by the sub context is returned to this one.
2. address: the account which context to execute.
3. value: value in wei to send to the account.
4. argsOffset: byte offset in the memory in bytes, the calldata of the sub context.
5. argsSize: byte size to copy (size of the calldata).
6. retOffset: byte offset in the memory in bytes, where to store the return data of the sub context.
7. retSize: byte size to copy (size of the return data).

- `CALL` will push 0 if the sub context reverted, otherwise 1. So the call should be not sucessfull and revert to achieve a zero on the stack

- now we push another 0 to the stack an check for equality which will then result with a 1 on the stack now the desired `JUMPDEST` 1b gets pushed to the stack and since we resulted with a truthy value in the `EQ` opcode the `JUMPI` will get us to the desired destination

- So we just need to deploy a contract that reverts when we call it, so I made a simple smart contract in solidity and got the bytecode which will be used below

```solidity
contract AlwaysRevert {
    fallback() external {
        assembly {
            revert(0, 0)
        }
    }
}
```

- So if we pass in a value of `0x6080604052348015600f57600080fd5b5060918061001e6000396000f3fe60806040526004361060205760003560e01c8063e7b3e17b146025575b600080fd5b348015602f57600080fd5b5060366048565b005b6000811315604a575b600080fd5b9056fea2646970667358221220c7f95ef527de52b0e3e87d07366496cc44efb154eb1e266adfe98201e845a4a864736f6c63430008040033` the `JUMP` will land on `JUMPDEST` and we will sucesfully finish the eighth puzzle

### Puzzle 9

```assembly
############
# Puzzle 9 #
############

00      36        CALLDATASIZE
01      6003      PUSH1 03
03      10        LT
04      6009      PUSH1 09
06      57        JUMPI
07      FD        REVERT
08      FD        REVERT
09      5B        JUMPDEST
0A      34        CALLVALUE
0B      36        CALLDATASIZE
0C      02        MUL
0D      6008      PUSH1 08
0F      14        EQ
10      6014      PUSH1 14
12      57        JUMPI
13      FD        REVERT
14      5B        JUMPDEST
15      00        STOP
```

- Identify the targets => get to index 09 (9) first then we need to get to index 14 (20) where 'JUMPDEST' is located

- First 3 opcodes are getting the calldatasize in bytes then checking if the number 3 is `LT` the calldatasize

- So to jump to the first `JUMPDEST` we just need to harvest a truthy value out of the `LT` check => min 4 bytes in calldata

- Now we take the call value in wei and the calldatasize in bytes to the stack and multiply them and push X to the stack, after that we push the number 8 to the stack and check if 8 == x, when we pass this check the second `JUMPI` will bring us to our desired destination

- now we need to calculate since calldata needs to be > 3 we cann either send an arbitrary 4 bytes calldata and 2 (wei) as the callvalue or we could send an arbitrary 8 byte calldata and 1 (wei)

- So if we pass in a calldata of `0x01010101` and a value of `2` the second `JUMP` will land on the final `JUMPDEST` and we will sucesfully finish the eighth puzzle

### Puzzle 10

```assembly
#############
# Puzzle 10 #
#############

00      38          CODESIZE
01      34          CALLVALUE
02      90          SWAP1
03      11          GT
04      6008        PUSH1 08
06      57          JUMPI
07      FD          REVERT
08      5B          JUMPDEST
09      36          CALLDATASIZE
0A      610003      PUSH2 0003
0D      90          SWAP1
0E      06          MOD
0F      15          ISZERO
10      34          CALLVALUE
11      600A        PUSH1 0A
13      01          ADD
14      57          JUMPI
15      FD          REVERT
16      FD          REVERT
17      FD          REVERT
18      FD          REVERT
19      5B          JUMPDEST
1A      00          STOP
```

- Identify the targets => get to index 08 (8) first then we need to get to index 19 (25) where 'JUMPDEST' is located

- First 3 opcodes are getting the codesize = 1b = 27 & the callvalue in wei swap those and then check if Codesize > Callvalue

- So to jump to the first `JUMPDEST` we just need to harvest a truthy value out of the `GT` check => at max 26 wei that we should send

- We take the calldatasize and push two bytes 0003 which = 3 on the stack swap those and now we can do Calldatasize % 3 the result will be on top of the stack now

- Check if the result `ISZERO` and if it is a 1 will be on the stack else a 0 will be on the stack => !! we need calldata that is a multiple of 3 bytes long !!

- The call value gets pushed onto the stack as well as 0a (10) we then add thos two which needs to result in 19 (25)

- Now we need to calculate the callvalue needs to be 15 (wei) since 10 + 15 => 25

- So if we pass in a calldata of `0x010101` and a value of `2` the second `JUMP` will land on the final `JUMPDEST` and we will sucesfully finish the eighth puzzle

## EVM puzzles

A collection of EVM puzzles. Each puzzle consists on sending a successful transaction to a contract. The bytecode of the contract is provided, and you need to fill the transaction data that won't revert the execution.

## How to play

Clone this repository and install its dependencies (`npm install` or `yarn`). Then run:a

```node
npx hardhat play
```

And the game will start.

In some puzzles you only need to provide the value that will be sent to the contract, in others the calldata, and in others both values.

You can use [`evm.codes`](https://www.evm.codes/)'s reference and playground to work through this.
