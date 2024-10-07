// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.27;

import "./ERC20.sol";

contract FEDOTToken is ERC20 {
     /**
     * @dev EIP-20 token name for this token
     */
    string private constant TOKEN_NAME = "Fedot";

    /**
     * @dev EIP-20 token symbol for this token
     */
    string private constant TOKEN_SYMBOL = "FEDOT";
    /**
     * @dev Total number of tokens in circulation
     */
    uint256 private constant TOKEN_INITIAL_SUPPLY = 1_000_000;

    /**
     * @dev Maximum total supply of tokens
     */
    uint256 private constant TOKEN_MAX_SUPPLY = 10_000_000 * 10 ** 18;

    /**
     * @dev Owner contract
     */
    address public owner;
    
    /**
     * @dev Constructor contract
     */
    constructor() ERC20(TOKEN_NAME, TOKEN_SYMBOL, TOKEN_INITIAL_SUPPLY * 10 ** decimals()) {
        owner = msg.sender;
    }

     /**
     * @dev Function to mint new tokens
     * @param account The address that will receive the minted tokens
     * @param value The amount of tokens to mint
     */
    function mint(address account, uint256 value) external onlyOwner {
        require(totalSupply() + value <= TOKEN_MAX_SUPPLY, "ERC20: minting exceeded max supply");
        _mint(account, value);
    }

    /**
     * @dev Modifier to restrict functions to only the owner
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
}
