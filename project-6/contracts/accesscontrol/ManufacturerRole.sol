pragma solidity ^0.5.0;

// Import the library 'Roles'
import "./Roles.sol";


// Define a contract 'ManufacturerRole' to manage this role - add, remove, check
contract ManufacturerRole {
    using Roles for Roles.Role;
    // Define 2 events, one for Adding, and other for Removing
    event ManufacturerAdded(address indexed account, string name);
    event ManufacturerRemoved(address indexed account, string name);

    // Define a struct 'retailers' by inheriting from 'Roles' library, struct Role
    Roles.Role private manufacturers;

    // In the constructor make the address that deploys this contract the 1st retailer
    constructor(string memory name) public {
        _addManufacturer(msg.sender, name);
    }

    // Define a modifier that checks to see if msg.sender has the appropriate role
    modifier onlyManufacturer() {
        require(isManufacturer(msg.sender), "Only Manufacturers can perform this action!");
        _;
    }

    // Define a function 'isManufacturer' to check this role
    function isManufacturer(address account) public view returns (bool) {
        return manufacturers.has(account);
    }

    // Define a function 'addManufacturer' that adds this role
    function addManufacturer(address account, string memory name) public onlyManufacturer {
        _addManufacturer(account, name);
    }

    // Define a function 'renounceManufacturer' to renounce this role
    function renounceManufacturer(address account) public {
        _removeManufacturer(account);
    }

    // Define an internal function '_addManufacturer' to add this role, called by 'addManufacturer'
    function _addManufacturer(address account, string memory name) internal {
        manufacturers.add(account, name);
        emit ManufacturerAdded(account, name);
    }

    // Define an internal function '_removeManufacturer' to remove this role, called by 'removeManufacturer'
    function _removeManufacturer(address account) internal {
        manufacturers.remove(account);
        emit ManufacturerRemoved(account, manufacturers.name[account]);
    }
}
