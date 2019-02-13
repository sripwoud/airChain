pragma solidity ^0.5.0;
import "../accesscontrol/SupplierRole.sol";
import "../accesscontrol/ManufacturerRole.sol";


// Define a contract 'Supplychain'
// note that by inheriting all these contracts, the deployer of this contract will have all roles!);
contract SupplyChain is SupplierRole("Owner"), ManufacturerRole("Owner") {
    // Define "owner"
    address payable owner;

    // Define a variable called 'upc' for Universal Product Code (UPC)
    uint public upc;

    /* to simplify prices are fixed within the contract.
     They could also be part of the constructor arguments.
     Price should be shared between supplier and manufacturer via e.g a shared catalog.
     As part of the contract data they are visible by anyone anyway.
     */
    uint public equipmentPrice = 10;
    uint public aircraftPrice = equipmentPrice * 10000000;
    // Define a public mappings 'assets' that maps the UPC to an asset.
    mapping (uint => Component) components;
    mapping (uint => Equipment) equipments;


    // Define a public mapping 'assetsHistory' that maps the UPC to an array of TxHash,
    // that track its journey through the supply chain -- to be sent from DApp.
    mapping (uint => string[]) componentsHistory;
    mapping (uint => string[]) equipmentsHistory;

    // Define enum 'State' with the following values:
    enum State {
        Unhandled,     // 0
        Ordered,       // 1
        Assembled,     // 2
        Packed,        // 3
        Shipped,       // 4
        Transported,   // 5
        Received,      // 6
        Integrated,    // 7
        StructureReady // 8
    }
    /* State constant defaultState = State.ToBeOrdered; */

    // Define a struct 'Component' with the following fields:
    struct Component {
        uint upc; // Universal Product Code (UPC) - unique to the product
        address ownerID;  // address of the current owner as the component moves though the supply chain
        string originManufacturerName; // Manufacturer Name
        string originPlant;  // city
        uint equipmentID;  // Equipment ID that component will be part of
        string componentNotes; // Component Notes
        State componentState;  // Component State as represented in the enum above
        address supplierID;  // Metamask-Ethereum address of the equipment supplier that bought this equipment
        address transporterID;  // address of the Transporter
        address manufacturerID; // address of the AC manufacturer that bought the equipment with this component
        address customerID; // address of the Airline that operates the AC with the equipment including this component
    }

    // Define a struct 'Equipment' with the following fields:
    struct Equipment {
        uint upc; // Universal Product Code (UPC) - unique to the product
        address ownerID;  // address of the current owner as the equipment moves though the supply chain
        string originPlant;  // city
        uint msn;  // MSN that equipment will be part of
        uint price;
        string equipmentNotes; // Equipment Notes
        State equipmentState;  // Equipment State as represented in the enum above
        address payable supplierID;  // address of user with supplier role that produced this equipment
        string supplierName;
        address payable transporterID;  // address of the Transporter
        address payable manufacturerID; // address of the AC manufacturer that bought the equipment with this equipment
        address customerID; // address of the Airline that operates the AC with the equipment including this equipment
    }

    // Define 8 events with the same 8 state values
    event Ordered(string asset, uint id); // asset= aircraft, equipment or equipment, id=msn or upc
    event Assembled(string asset, uint id);
    event Received(string asset, uint id);

    // Define a modifer that checks to see if msg.sender == owner of the contract
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // Define a modifer that verifies the Caller
    modifier verifyCaller (address _address) {
        require(msg.sender == _address);
        _;
    }

    // Define a modifier that checks if the paid amount is sufficient to cover the price
    modifier paidEnough(uint _price) {
        require(msg.value >= _price, "Value sent does not cover the price!");
        _;
    }

    // Define a modifier that checks the price and refunds the remaining balance
    modifier checkValue(uint _upc) {
        uint _price = equipments[_upc].price;
        uint amountToReturn = msg.value - _price;
        equipments[_upc].manufacturerID.transfer(amountToReturn);
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Received
    modifier received(uint _upc) {
        if (components[_upc].upc != 0) {
            require(components[_upc].componentState == State.Received);
            _;
        } else {
            require(equipments[_upc].equipmentState == State.Received);
            _;
        }
    }

    // In the constructor set 'owner' to the address that instantiated the contract
    // and set 'sku' to 1
    // and set 'upc' to 1
    constructor() public payable {
        owner = msg.sender;
        upc = 1;
    }

    // Define a function 'kill' if required
    function kill() public {
        if (msg.sender == owner) {
            selfdestruct(owner);
        }
    }

    // Define a function 'receive' that allows a supplier to mark an equipment as 'Received'
    // 1, "Arcelor", "Lyon", 1, "no comments"
    function receiveComponent(
        uint _upc,
        string memory _originManufacturerName,
        string memory _originPlant,
        uint _equipmentID,
        string memory _componentNotes
    )
    public
    onlySupplier
    {
      // Add the new Component as part of the mapping
        components[_upc] = Component(
            _upc,
            msg.sender,
            _originManufacturerName,
            _originPlant,
            _equipmentID,
            _componentNotes,
            State.Received,
            msg.sender,
            address(0),
            address(0),
            address(0)
        );

        // Emit the appropriate event
        emit Received("Component", _upc);
    }

    // Define a function orderEquipment that allows an AC manufacturer to order an equipment
    function orderEquipment(
        uint _upc,
        address payable _supplierID,
        uint _msn
    )
    public
    payable
    onlyManufacturer
    // TO DO: implement payments with withdraw pattern!!
    // paidEnough(equipments[_upc].price)
    // checkValue(equipments[_upc].price)
    {
        // Add the new Component as part of the mapping
        equipments[_upc] = Equipment(
            _upc,
            address(0), // equipment doesn't exist yet
            "", // originPlant will be updated by supplier, he decides where to produce
            _msn,
            equipmentPrice,
            "", // filled by Supplier
            State.Ordered,
            _supplierID,
            getNameSupplier(_supplierID),
            address(0),
            msg.sender,
            address(0)
        );
        emit Ordered("Equipment", _upc);
    }

/*
    // Define a function orderEquipment that allows an AC manufacturer to order an equipment
    function packEquipment(uint _upc)
    public
    {

    }

    // Define a function orderEquipment that allows an AC manufacturer to order an equipment
    function shipEquipment(uint _upc)
    public
    {

    }

    // Define a function orderEquipment that allows an AC manufacturer to order an equipment
    function transportEquipment(uint _upc)
    public
    {

    }

    // Define a function orderEquipment that allows an AC manufacturer to order an equipment
    function receiveEquipment(uint _upc)
    public
    {

    }
*/
    // Define functions 'fetchAsset' that fetches the data of a given asset
    function fetchComponent(uint _upc)
    public
    view
    returns (
        uint componentUPC,
        address ownerID,
        string memory originManufacturerName,
        string memory originPlant,
        uint equipmentID,
        string memory componentNotes,
        State componentState,
        address supplierID,
        address transporterID,
        address manufacturerID,
        address customerID
    )
    {
        // Assign values to the parameters
        Component memory component = components[_upc];
        componentUPC = _upc;
        ownerID = component.ownerID;
        originManufacturerName = component.originManufacturerName;
        originPlant = component.originPlant;
        equipmentID = component.equipmentID;
        componentNotes = component.componentNotes;
        componentState = component.componentState;
        supplierID = component.supplierID;
        transporterID = component.transporterID;
        manufacturerID = component.manufacturerID;
        customerID = component.customerID;
    }

    function fetchEquipment(uint _upc)
        public
        view
        returns (
        uint equipmentUPC,
        address ownerID,
        string memory originPlant,
        uint msn,
        uint price,
        string memory equipmentNotes,
        State equipmentState,
        address supplierID,
        string memory supplierName,
        address transporterID,
        address manufacturerID,
        address customerID
        )
        {
        // Assign values to the 7 parameters
        Equipment memory equipment = equipments[_upc];
        equipmentUPC = _upc;
        ownerID = equipment.ownerID;
        originPlant = equipment.originPlant;
        msn = equipment.msn;
        price = equipment.price;
        equipmentNotes = equipment.equipmentNotes;
        equipmentState = equipment.equipmentState;
        supplierID = equipment.supplierID;
        supplierName = equipment.supplierName;
        transporterID = equipment.transporterID;
        manufacturerID = equipment.manufacturerID;
        customerID = equipment.customerID;
    }
}
