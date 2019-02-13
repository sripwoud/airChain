pragma solidity ^0.5.0;
/**
 * @title Roles
 * @dev Library for managing addresses assigned to a Role.
 */


library Roles {
    struct Role {
        mapping (address => bool) bearer;
        mapping (address => string) name;
    }

    /**
    * @dev give an account access to this role
    */
    function add(Role storage role, address account, string memory name) internal {
        require(account != address(0));
        require(!has(role, account));

        role.bearer[account] = true;
        role.name[account] = name;
    }

    /**
    * @dev remove an account's access to this role
    */
    function remove(Role storage role, address account) internal {
        require(account != address(0));
        require(has(role, account));

        role.bearer[account] = false;
    }

    /**
    * @dev check if an account has this role
    * @return bool
    */
    function has(Role storage role, address account)
    internal
    view
    returns (bool)
    {
        require(account != address(0));
        return role.bearer[account];
    }

    function getName(Role storage role, address account)
    internal
    view
    returns (string memory name)
    {
        return role.name[account];
    }
}
