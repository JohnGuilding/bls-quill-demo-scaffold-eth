//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Bank {
    function deposit(address _token, uint256 _amount) public {
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
    }

    function withdraw(address _token, uint256 _amount) public {
        IERC20(_token).transfer(msg.sender, _amount);
    }
}
