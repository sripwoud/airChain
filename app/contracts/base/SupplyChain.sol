pragma solidity ^0.5.0;
import "../accesscontrol/SupplierRole.sol";
import "../accesscontrol/ManufacturerRole.sol";
import "../accesscontrol/CustomerRole.sol";
import "../accesscontrol/TransporterRole.sol";


// Define a contract 'Supplychain'
// note that by inheriting all these contracts, the deployer of this contract will have all roles!);
contract SupplyChain is SupplierRole("Owner"), ManufacturerRole("Owner"), CustomerRole("Owner"), TransporterRole("Owner") {
    // Define "owner"
    address payable owner;

    // Define a variable called 'man' for Manufacturer Serial Number (AC)
    uint public msn;

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
    mapping(uint => Aircraft) aircrafts;


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

    // Define strut for each asset: Component, Equipment, Aircraft
    struct Component {
        uint upc; // Universal Product Code (UPC) - unique to the product
        uint equipmentID;  // Equipment ID that component will be part of
        State state;  // Component State as represented in the enum above
        string originManufacturerName; // Manufacturer Name
        string originPlant;  // city
        address supplierID;  // Metamask-Ethereum address of the equipment supplier that bought this equipment
    }

    // Define a struct 'Equipment' with the following fields:
    struct Equipment {
        uint upc; // Universal Product Code (UPC) - unique to the product
        uint componentID; // component integrated into this equipment
        uint msn;  // MSN that equipment will be part of
        uint price;
        State state;  // Equipment State as represented in the enum above
        address ownerID;  // address of the current owner as the equipment moves though the supply chain
        address payable supplierID;  // address of user with supplier role that produced this equipment
        string originPlant;  // city where equipment was produced
        string equipmentNotes; // Equipment Notes
        address payable transporterID;  // address of the Transporter
        address payable manufacturerID; // address of the AC manufacturer that bought the equipment with this equipment
    }

    struct Aircraft {
        uint msn;
        uint equipmentID; // upc of the equipment integrated into this AC
        uint price;
        State state;
        address ownerID;
        address payable manufacturerID; // AC Manufacturer that produced this AC
        string originPlant;
        string aircraftNotes;
        address customerID; // airline that bought this aircraft
    }

    // Define 8 events with the same 8 state values
    event Ordered(string asset, uint id); // asset= aircraft, equipment or equipment, id=msn or upc
    event Assembled(string asset, uint id);
    event Integrated(string asset, uint id);
    event Received(string asset, uint id);
    event StructureReady(uint msn);

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

    // Define a modifier that checks if the state of an asset is Ordered
    // "_upc" can be an "equipment UPC" or an MSN
    modifier ordered(uint _upcOrMsn) {
        require(equipments[_upcOrMsn].state == State.Ordered || aircrafts[_upcOrMsn].state == State.Ordered);
        _;
    }

    // Define a modifier that checks if the state of an asset is Received
    modifier received(uint _upc) {
        if (components[_upc].upc != 0) {
            require(components[_upc].state == State.Received);
            _;
        } else {
            require(equipments[_upc].state == State.Received);
            _;
        }
    }

    // In the constructor set 'owner' to the address that instantiated the contract
    // and set 'sku' to 1
    // and set 'upc' to 1
    constructor() public payable {
        owner = msg.sender;
        msn = 1;
    }

    // Define a function 'kill' if required
    function kill() public {
        if (msg.sender == owner) {
            selfdestruct(owner);
        }
    }

    // function to order an AC. Customer provides the equipment he wants and the manufacterID
    function orderAircraft(uint _equipmentID, address payable _manufacturerID)
    public
    payable
    // onlyCustomer
    // paidEnough(0.5 * aircraftPrice)
    // checkValue(0.5 * aircraftPrice)
    {
        aircrafts[msn] = Aircraft(
            msn,
            _equipmentID,
            aircraftPrice,
            State.Ordered,
            address(0), // AC doesn't exist yet so no owner!
            _manufacturerID,
            "", // originPlant provided when AC ready by Manufacturer
            "", // originNotes provided when AC ready by Manufacturer
            msg.sender
        );

        emit Ordered("Aircraft", msn);
        msn++;
    }

    function orderEquipment(
        uint _upcEquipment,
        address payable _supplierID,
        uint _msn
    )
    public
    payable
    onlyManufacturer
    ordered(_msn)
    // TO DO: implement payments with withdraw pattern!!
    // paidEnough(equipments[_upc].price)
    // checkValue(equipments[_upc].price)
    {
        // Add the new Component as part of the mapping
        equipments[_upcEquipment] = Equipment(
            _upcEquipment,
            0, // the supplier will decide which component he'll use to produce this equipment
            _msn,
            equipmentPrice,
            State.Ordered,
            address(0), // equipment doesn't exist yet so no owner
            _supplierID,
            "", // originPlant will be updated by supplier, he decides where to produce
            "", // equipmentNotes filled by Supplier at production state
            address(0), // transportID filled by supplier at shipment stage
            msg.sender
        );
        emit Ordered("Equipment", _upcEquipment);
    }

    // function prepareStructure(uint _msn)
    // public
    // onlyManufacturer
    // ordered(_msn)
    // {
    //
    // }

    function receiveComponent(
        uint _upc,
        string memory _originManufacturerName,
        string memory _originPlant,
        uint _equipmentID
    )
    public
    onlySupplier
    ordered(_equipmentID)
    {
        // Add the new Component as part of the mapping
        components[_upc] = Component(
            _upc,
            _equipmentID,
            State.Received,
            _originManufacturerName,
            _originPlant,
            msg.sender
        );

        // Emit the appropriate event
        emit Received("Component", _upc);
    }

    function processComponent(
        uint _upc,
        string memory _originPlant,
        string memory _equipmentNotes
    )
    public
    onlySupplier
    received(_upc)
    {
        components[_upc].state = State.Integrated;

        equipments[components[_upc].equipmentID].componentID = _upc;
        equipments[components[_upc].equipmentID].state = State.Assembled;
        equipments[components[_upc].equipmentID].ownerID = msg.sender;
        equipments[components[_upc].equipmentID].originPlant = _originPlant;
        equipments[components[_upc].equipmentID].equipmentNotes = _equipmentNotes;

        emit Integrated("Component", _upc);
        emit Assembled("Equipment", components[_upc].equipmentID);
    }

    function prepareStructure(
        uint _msn,
        string memory _originPlant,
        string memory _aircraftNotes
    )
    public
    onlyManufacturer
    ordered(_msn)
    {
        aircrafts[_msn].state = State.StructureReady;
        aircrafts[_msn].ownerID = msg.sender;
        aircrafts[_msn].originPlant = _originPlant;
        aircrafts[_msn].aircraftNotes = _aircraftNotes;

        emit StructureReady(_msn);
    }
/*
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
        uint equipmentID,
        State state,
        string memory originManufacturerName,
        string memory originPlant,
        address supplierID
    )
    {
        // Assign values to the parameters
        Component memory component = components[_upc];
        componentUPC = _upc;
        equipmentID = component.equipmentID;
        state = component.state;
        originManufacturerName = component.originManufacturerName;
        originPlant = component.originPlant;
        supplierID = component.supplierID;
    }

    function fetchEquipment(uint _upc)
    public
    view
    returns (
        uint equipmentUPC,
        uint componentID,
        uint aircraftMsn,
        uint price,
        State state,
        address ownerID,
        address supplierID,
        string memory originPlant,
        string memory equipmentNotes,
        address transporterID,
        address manufacturerID
    )
    {
        // Assign values to the 7 parameters
        Equipment memory equipment = equipments[_upc];
        equipmentUPC = _upc;
        componentID = equipment.componentID;
        aircraftMsn = equipment.msn;
        price = equipment.price;
        state = equipment.state;
        ownerID = equipment.ownerID;
        supplierID = equipment.supplierID;
        originPlant = equipment.originPlant;
        equipmentNotes = equipment.equipmentNotes;
        transporterID = equipment.transporterID;
        manufacturerID = equipment.manufacturerID;
    }

    function fetchAircraft(uint _msn)
    public
    view
    returns (
        uint aircraftMsn,
        uint equipmentID,
        uint price,
        State state,
        address ownerID,
        address manufacturerID,
        string memory originPlant,
        string memory aircraftNotes,
        address customerID
    )
    {
        Aircraft memory aircraft = aircrafts[_msn];
        aircraftMsn = _msn;
        equipmentID = aircraft.equipmentID;
        price = aircraft.price;
        state = aircraft.state;
        ownerID = aircraft.ownerID;
        manufacturerID = aircraft.manufacturerID;
        originPlant = aircraft.originPlant;
        aircraftNotes = aircraft.aircraftNotes;
        customerID = aircraft.customerID;
    }
}
