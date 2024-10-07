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

    describe("Deployment", function () {
        it("Should set the balance", async function () {
            const { token } = await loadFixture(deployFedotCoinFixture);
            expect(await token.read.name()).to.equal("Fedot");
        });
        it("Should totalSupply", async function () {
            const { token, initSupply } = await loadFixture(
                deployFedotCoinFixture
            );
            expect(await token.read.totalSupply()).to.equal(initSupply);
        });
        it("Should token owner", async function () {
            const { token, owner, initSupply } = await loadFixture(
                deployFedotCoinFixture
            );
            const balance = await token.read.balanceOf([owner.account.address]);
            expect(balance).to.equal(initSupply);
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
