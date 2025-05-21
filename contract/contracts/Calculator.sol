// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./AbstractCalculator.sol";

contract Calculator is AbstractCalculator {
    struct LastResult {
        uint256 a;
        uint256 b;
        uint256 result;
        string operation;
    }

    mapping(address => LastResult[]) public history;

    event Calculate(uint256 result);

    function calculate(
        uint256 a,
        uint256 b,
        string memory operation
    ) public returns (uint256) {
        bytes32 op = keccak256(abi.encodePacked(operation));
        uint256 _result;

        if (op == keccak256("add")) {
            _result = add(a, b);
        } else if (op == keccak256("subtract")) {
            _result = subtract(a, b);
        } else if (op == keccak256("multiply")) {
            _result = multiply(a, b);
        } else if (op == keccak256("divide")) {
            _result = divide(a, b);
        } else {
            revert("Invalid operation");
        }

        history[msg.sender].push(LastResult(a, b, _result, operation));
        emit Calculate(_result);
        return _result;
    }

    function getLastResult(
        address userAddr
    ) public view returns (LastResult memory) {
        uint256 len = history[userAddr].length;
        require(len > 0, "No calculation history");
        return history[userAddr][len - 1];
    }

    function getHistoryItem(
        address userAddr
    ) public view returns (LastResult[] memory) {
        if (history[userAddr].length == 0) {
            revert("No calculation history");
        }
        return history[userAddr];
    }

    function getHistoryLength(address userAddr) public view returns (uint256) {
        return history[userAddr].length;
    }
}
