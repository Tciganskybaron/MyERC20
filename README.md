# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```
Деплой контракта в localhost
```bash
npx hardhat ignition deploy ./ignition/modules/Lock.ts --network localhost
```

Деплой контракта в sepolia
```bash
npx hardhat ignition deploy ./ignition/modules/Lock.ts --network sepolia  
```

Команда для верификации контракта
``` bash
npx hardhat verify --network sepolia 0xbBba42a717fB23b91743E10278e85367119Ab420 "1893456000"
```
Нужно передать адрес контракта, и аргументы для конструктора.
