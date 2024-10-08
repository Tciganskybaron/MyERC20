import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseGwei, parseUnits } from "viem";

describe("FEDOTToken", function () {
    async function deployFedotCoinFixture() {
        const initSupply = parseUnits("1000000", 18);
        const [owner, otherAccount] = await hre.viem.getWalletClients();
        const token = await hre.viem.deployContract("FEDOTToken");
        const publicClient = await hre.viem.getPublicClient();
        return {
            owner,
            otherAccount,
            token,
            publicClient,
            initSupply,
        };
    }

    describe("Initialization", function () {
        it("Correctly constructs ERC20 token", async () => {
            const { token } = await loadFixture(deployFedotCoinFixture);
            // Check token name
            expect(await token.read.name()).to.equal("Fedot");

            // Check token symbol
            expect(await token.read.symbol()).to.equal("FEDOT");

            // Check token decimals
            expect(await token.read.decimals()).to.equal(18);
        });

        // Check token totalSupply
        it("Should totalSupply", async function () {
            const { token, initSupply } = await loadFixture(
                deployFedotCoinFixture
            );
            expect(await token.read.totalSupply()).to.equal(initSupply);
        });

        // Check token owner balance
        it("Should token owner", async function () {
            const { token, owner, initSupply } = await loadFixture(
                deployFedotCoinFixture
            );
            const balance = await token.read.balanceOf([owner.account.address]);
            expect(balance).to.equal(initSupply);
        });
    });

    describe("Mint token", function () {
        it("Mint", async function () {
            const { token, owner, initSupply } = await loadFixture(
                deployFedotCoinFixture
            );
            // Mint initial supply of tokens
            await token.write.mint([owner.account.address, initSupply]);

            // Check the minted amount
            const balance = await token.read.balanceOf([owner.account.address]);
            expect(balance).to.equal(initSupply + initSupply);
        });
    });

    describe("Mint token", function () {
        it("Mint", async function () {
            const { token, owner, initSupply } = await loadFixture(
                deployFedotCoinFixture
            );
            // Mint initial supply of tokens
            await token.write.mint([owner.account.address, initSupply]);

            // Check the minted amount
            const balance = await token.read.balanceOf([owner.account.address]);
            expect(balance).to.equal(initSupply + initSupply);
        });
    });

    describe("Burn token", function () {
        it("Burn", async function () {
            const { token, owner, initSupply, publicClient } =
                await loadFixture(deployFedotCoinFixture);

            const burnSupply = parseUnits("500000", 18);

            // Выполнение транзакции для сжигания токенов
            const tx = await token.write.burn([burnSupply]);

            // Получение квитанции о транзакции
            const receipt = await publicClient.waitForTransactionReceipt({
                hash: tx,
            });
            // Проверка потребления газа
            console.log("Gas used for burn:", receipt.gasUsed.toString());

            // Проверяем баланс после сжигания
            const balance = await token.read.balanceOf([owner.account.address]);
            expect(balance).to.equal(initSupply - burnSupply);
        });
    });

    describe("Transfer ", function () {
        it("Should token owner", async function () {
            const value = parseUnits("100", 18);
            const { token, owner, otherAccount, initSupply } =
                await loadFixture(deployFedotCoinFixture);

            await token.write.transfer([otherAccount.account.address, value]);
            const balanceOtherAccount = await token.read.balanceOf([
                otherAccount.account.address,
            ]);
            const balanceOwner = await token.read.balanceOf([
                owner.account.address,
            ]);
            expect(balanceOwner).to.equal(initSupply - value);
            expect(balanceOtherAccount).to.equal(value);
        });
    });
});
