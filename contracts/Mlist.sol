// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";

contract Mlist {
    address owner;
    uint hashInternal;

    constructor(string memory _hashString) {
        owner = msg.sender;
        hashInternal = uint(keccak256(abi.encodePacked(_hashString)));
    }

    function concatenate(string memory a, string memory b) internal pure returns (string memory) {
        return string(abi.encodePacked(a, b));
    }

    function gethashInternalAsString() public view returns(string memory) {
        return Strings.toHexString(hashInternal);
    }

    function sethashInternal(string memory _hashString) public {
        require(msg.sender == owner, "Not the owner");

        string memory hashInternalString = Strings.toHexString(hashInternal);
        string memory stringNew = concatenate(hashInternalString, _hashString);

        hashInternal = uint(keccak256(abi.encodePacked(stringNew)));
    }
}