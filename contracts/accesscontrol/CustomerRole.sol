pragma solidity ^0.5.0;

// Import the library 'Roles'
import "./Roles.sol";


// Define a contract 'CustomerRole' to manage this role - add, remove, check
contract CustomerRole {
    using Roles for Roles.Role;
    // Define 2 events, one for Adding, and other for Removing
    event CustomerAdded(address indexed account, string name);
    event CustomerRemoved(address indexed account, string name);

    // Define a struct 'retailers' by inheriting from 'Roles' library, struct Role
    Roles.Role private customers;

    // In the constructor make the address that deploys this contract the 1st retailer
    constructor(string memory name) public {
        _addCustomer(msg.sender, name);
    }

    // Define a modifier that checks to see if msg.sender has the appropriate role
    modifier onlyCustomer() {
        require(isCustomer(msg.sender), "Only Customers can perform this action!");
        _;
    }

    function getNameCustomer(address account) public view returns (string memory) {
        return customers.getName(account);
    }

    // Define a function 'isCustomer' to check this role
    function isCustomer(address account) public view returns (bool) {
        return customers.has(account);
    }

    // Define a function 'addCustomer' that adds this role
    function addCustomer(address account, string memory name) public onlyCustomer {
        _addCustomer(account, name);
    }

    // Define a function 'renounceCustomer' to renounce this role
    function renounceCustomer() public {
        _removeCustomer(msg.sender);
    }

    // Define an internal function '_addCustomer' to add this role, called by 'addCustomer'
    function _addCustomer(address account, string memory name) internal {
        customers.add(account, name);
        emit CustomerAdded(account, name);
    }

    // Define an internal function '_removeCustomer' to remove this role, called by 'removeCustomer'
    function _removeCustomer(address account) internal {
        customers.remove(account);
        emit CustomerRemoved(account, customers.name[account]);
    }
}
