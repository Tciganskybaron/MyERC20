import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { parseUnits, zeroAddress } from "viem";

describe("FEDOTToken", function () {
    async function deployFedotCoinFixture() {
        const initSupply = parseUnits("1000000", 18);
        const [owner, otherAccount, thirdAccount] =
            await hre.viem.getWalletClients();
        const token = await hre.viem.deployContract("FEDOTToken");
        const publicClient = await hre.viem.getPublicClient();
        return {
            owner,
            otherAccount,
            thirdAccount,
            token,
            publicClient,
            initSupply,
        };
    }

    describe("Initialization", function () {
        it("Should correctly construct ERC20 token", async () => {
            const { token } = await loadFixture(deployFedotCoinFixture);
            expect(await token.read.name()).to.equal("Fedot");
            expect(await token.read.symbol()).to.equal("FEDOT");
            expect(await token.read.decimals()).to.equal(18);
        });

        it("Should set totalSupply correctly", async function () {
            const { token, initSupply } = await loadFixture(
                deployFedotCoinFixture
            );
            expect(await token.read.totalSupply()).to.equal(initSupply);
        });

        it("Should assign total supply to the owner", async function () {
            const { token, owner, initSupply } = await loadFixture(
                deployFedotCoinFixture
            );
            const balance = await token.read.balanceOf([owner.account.address]);
            expect(balance).to.equal(initSupply);
        });
    });

    describe("Minting", function () {
        it("Should allow the owner to mint tokens", async function () {
            const { token, owner, initSupply } = await loadFixture(
                deployFedotCoinFixture
            );
            const mintAmount = parseUnits("500000", 18);

            await token.write.mint([owner.account.address, mintAmount]);

            const balance = await token.read.balanceOf([owner.account.address]);
            expect(balance).to.equal(initSupply + mintAmount);
        });

        it("Should revert if minting exceeds the max supply", async function () {
            const { token, owner } = await loadFixture(deployFedotCoinFixture);
            const mintAmount = parseUnits("900000000", 18); // Exceeding max supply
            await expect(
                token.write.mint([owner.account.address, mintAmount])
            ).to.be.rejectedWith("ERC20: minting exceeded max supply");
        });

        it("Should revert if a non-owner tries to mint tokens", async function () {
            const { token, otherAccount } = await loadFixture(
                deployFedotCoinFixture
            );
            const mintAmount = parseUnits("1000", 18);
            const tokenAsOtherAccount = await hre.viem.getContractAt(
                "FEDOTToken",
                token.address,
                {
                    client: { wallet: otherAccount },
                }
            );
            await expect(
                tokenAsOtherAccount.write.mint([
                    otherAccount.account.address,
                    mintAmount,
                ])
            ).to.be.rejectedWith("Only owner can call this function");
        });
    });

    describe("Burning", function () {
        it("Should allow token holders to burn their tokens", async function () {
            const { token, owner, initSupply } = await loadFixture(
                deployFedotCoinFixture
            );
            const burnAmount = parseUnits("500000", 18);

            await token.write.burn([burnAmount]);

            const balance = await token.read.balanceOf([owner.account.address]);
            expect(balance).to.equal(initSupply - burnAmount);
        });

        it("Should revert if burning more than balance", async function () {
            const { token, owner } = await loadFixture(deployFedotCoinFixture);
            const burnAmount = parseUnits("2000000", 18); // Exceeding balance
            await expect(token.write.burn([burnAmount])).to.be.rejectedWith(
                "ERC20InsufficientBalance"
            );
        });

        // it("Should revert if trying to burn tokens from the zero address", async function () {
        //     const { token } = await loadFixture(deployFedotCoinFixture);
        //     const burnAmount = parseUnits("1000", 18);

        //     const tokenAsZER0Account = await hre.viem.getContractAt(
        //         "FEDOTToken",
        //         token.address,
        //         {
        //             client: { wallet: zeroAddress },
        //         }
        //     );

        //     await expect(
        //         token.write.burn([burnAmount], { from: zeroAddress })
        //     ).to.be.rejectedWith("ERC20InvalidSender");
        // });
    });

    describe("Transfers", function () {
        it("Should allow token transfers between accounts", async function () {
            const { token, owner, otherAccount, initSupply } =
                await loadFixture(deployFedotCoinFixture);
            const transferAmount = parseUnits("1000", 18);

            await token.write.transfer([
                otherAccount.account.address,
                transferAmount,
            ]);

            const balanceOwner = await token.read.balanceOf([
                owner.account.address,
            ]);
            const balanceOther = await token.read.balanceOf([
                otherAccount.account.address,
            ]);

            expect(balanceOwner).to.equal(initSupply - transferAmount);
            expect(balanceOther).to.equal(transferAmount);
        });

        it("Should revert if transfer amount exceeds balance", async function () {
            const { token, owner } = await loadFixture(deployFedotCoinFixture);
            const transferAmount = parseUnits("2000000", 18); // Exceeds owner's balance
            await expect(
                token.write.transfer([owner.account.address, transferAmount])
            ).to.be.rejectedWith("ERC20InsufficientBalance");
        });

        it("Should revert when transferring to the zero address", async function () {
            const { token, owner } = await loadFixture(deployFedotCoinFixture);
            const transferAmount = parseUnits("1000", 18);
            await expect(
                token.write.transfer([zeroAddress, transferAmount])
            ).to.be.rejectedWith("ERC20InvalidReceiver");
        });
    });

    describe("Allowance", function () {
        it("Should set allowance for a spender", async function () {
            const { token, owner, otherAccount } = await loadFixture(
                deployFedotCoinFixture
            );
            const allowanceAmount = parseUnits("1000", 18);

            await token.write.approve([
                otherAccount.account.address,
                allowanceAmount,
            ]);
            const allowance = await token.read.allowance([
                owner.account.address,
                otherAccount.account.address,
            ]);

            expect(allowance).to.equal(allowanceAmount);
        });

        it("Should revert when approving the zero address", async function () {
            const { token } = await loadFixture(deployFedotCoinFixture);
            const allowanceAmount = parseUnits("1000", 18);

            await expect(
                token.write.approve([zeroAddress, allowanceAmount])
            ).to.be.rejectedWith("ERC20InvalidSpender");
        });

        it("Should allow spender to transfer tokens within allowance", async function () {
            const { token, owner, otherAccount, thirdAccount } =
                await loadFixture(deployFedotCoinFixture);
            const allowanceAmount = parseUnits("1000", 18);
            const transferAmount = parseUnits("500", 18);

            // Owner approves otherAccount to spend tokens
            await token.write.approve([
                otherAccount.account.address,
                allowanceAmount,
            ]);

            // Get the contract connected to the otherAccount
            const tokenAsOtherAccount = await hre.viem.getContractAt(
                "FEDOTToken",
                token.address,
                {
                    client: { wallet: otherAccount },
                }
            );

            // Call transferFrom with the correct contract instance
            await tokenAsOtherAccount.write.transferFrom([
                owner.account.address,
                thirdAccount.account.address,
                transferAmount,
            ]);

            const remainingAllowance = await token.read.allowance([
                owner.account.address,
                otherAccount.account.address,
            ]);
            const balanceThirdAccount = await token.read.balanceOf([
                thirdAccount.account.address,
            ]);

            expect(remainingAllowance).to.equal(
                allowanceAmount - transferAmount
            );
            expect(balanceThirdAccount).to.equal(transferAmount);
        });

        it("Should revert if spender exceeds allowance", async function () {
            const { token, owner, otherAccount } = await loadFixture(
                deployFedotCoinFixture
            );
            const allowanceAmount = parseUnits("1000", 18);
            const transferAmount = parseUnits("1500", 18);

            await token.write.approve([
                otherAccount.account.address,
                allowanceAmount,
            ]);

            const tokenAsOtherAccount = await hre.viem.getContractAt(
                "FEDOTToken",
                token.address,
                {
                    client: { wallet: otherAccount },
                }
            );

            await expect(
                tokenAsOtherAccount.write.transferFrom([
                    owner.account.address,
                    otherAccount.account.address,
                    transferAmount,
                ])
            ).to.be.rejectedWith("ERC20InsufficientAllowance");
        });
    });
});
