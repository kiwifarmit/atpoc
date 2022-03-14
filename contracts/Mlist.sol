// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";

contract Mlist {
    address owner;
    uint hashInternal;
    uint value;
    bytes mData; // tmp

    /*
    // https://solidity-by-example.org/sending-ether/
    Which function is called, fallback() or receive()?

           send Ether
               |
         msg.data is empty?
              / \
            yes  no
            /     \
receive() exists?  fallback()
         /   \
        yes   no
        /      \
    receive()   fallback()
    */

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {
        emit Paid(msg.sender, msg.value);
    }

    /// @notice Logs the address of the sender and amounts paid to the contract
    event Paid(address indexed _from, uint _value);

    constructor(string memory _hashString) {
        value = 22;
        owner = msg.sender;
        hashInternal = uint(keccak256(abi.encodePacked(_hashString)));
    }

    function concatenate(string memory a, string memory b) internal pure returns (string memory) {
        return string(abi.encodePacked(a, b));
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getContractSelfAddress() public view returns (address) {
        return address(this);
    }

    function gethashInternalAsString() public view returns(string memory) {
        return Strings.toHexString(hashInternal);
    }

    function sendAllToOwner() public payable {
       require(msg.sender == owner, "Not the owner");
        // require(address(this).balance >= 0.1 ether);

        // replace payable(owner) with payable(msg.sender) or another address and
        // sendAllToOwner() to rename(address payable _to) to be parametric
        (bool sent, bytes memory data) = payable(owner).call{value: address(this).balance}(abi.encode(value));
        mData = data;
        require(sent, "Failed to send Ether");
    }
    
    function sethashInternal(string memory _hashString) public {
        require(msg.sender == owner, "Not the owner");

        string memory hashInternalString = Strings.toHexString(hashInternal);
        string memory stringNew = concatenate(hashInternalString, _hashString);

        hashInternal = uint(keccak256(abi.encodePacked(stringNew)));
    }
}