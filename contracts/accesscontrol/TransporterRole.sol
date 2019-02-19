pragma solidity ^0.5.0;

// Import the library 'Roles'
import "./Roles.sol";


// Define a contract 'TransporterRole' to manage this role - add, remove, check
contract TransporterRole {
    using Roles for Roles.Role;
    // Define 2 events, one for Adding, and other for Removing
    event TransporterAdded(address indexed account, string name);
    event TransporterRemoved(address indexed account, string name);

    // Define a struct 'retailers' by inheriting from 'Roles' library, struct Role
    Roles.Role private transporters;

    // In the constructor make the address that deploys this contract the 1st retailer
    constructor(string memory name) public {
        _addTransporter(msg.sender, name);
    }

    // Define a modifier that checks to see if msg.sender has the appropriate role
    modifier onlyTransporter() {
        require(isTransporter(msg.sender), "Only Transporters can perform this action!");
        _;
    }

    function getNameTransporter(address account) public view returns (string memory) {
        return transporters.getName(account);
    }

    // Define a function 'isTransporter' to check this role
    function isTransporter(address account) public view returns (bool) {
        return transporters.has(account);
    }

    // Define a function 'addTransporter' that adds this role
    function addTransporter(address account, string memory name) public onlyTransporter {
        _addTransporter(account, name);
    }

    // Define a function 'renounceTransporter' to renounce this role
    function renounceTransporter() public {
        _removeTransporter(msg.sender);
    }

    // Define an internal function '_addTransporter' to add this role, called by 'addTransporter'
    function _addTransporter(address account, string memory name) internal {
        transporters.add(account, name);
        emit TransporterAdded(account, name);
    }

    // Define an internal function '_removeTransporter' to remove this role, called by 'removeTransporter'
    function _removeTransporter(address account) internal {
        transporters.remove(account);
        emit TransporterRemoved(account, transporters.name[account]);
    }
}
