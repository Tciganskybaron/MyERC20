// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import {IERC20} from "./IERC20.sol";


interface IERC20Errors is IERC20 {
    error ERC20InvalidSender(address account);

    error ERC20InvalidReceiver(address account);

    error ERC20InvalidApprover(address account);

    error ERC20InvalidSpender(address account);

    error ERC20InsufficientAllowance(address spender, uint256 currentAllowance, uint256 value);

    error ERC20InsufficientBalance(address from, uint256 fromBalance, uint256 value);
 }
