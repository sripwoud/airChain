pragma solidity ^0.5.0;
import "../accesscontrol/SupplierRole.sol";
import "../accesscontrol/ManufacturerRole.sol";
import "../accesscontrol/CustomerRole.sol";
import "../accesscontrol/TransporterRole.sol";

// Define a contract 'Supplychain'
// note that by inheriting all these contracts, the deployer of this contract will have all roles!);
contract SupplyChain is
SupplierRole("Owner"),
ManufacturerRole("Owner"),
CustomerRole("Owner"),
TransporterRole("Owner") {

    // Define "owner"
    address payable owner;

    // Define a variable called 'man' for Manufacturer Serial Number (AC)
    uint public msn;

    /* to simplify prices are fixed within the contract.
     They could also be part of the constructor arguments.
     Price should be shared between supplier and manufacturer via e.g a shared catalog.
     As part of the contract data they are visible by anyone anyway.
     */
    uint public equipmentPrice = 1000; //
    uint public aircraftPrice = 1000000000000000000; // 1 ETH
    uint public transportFee = 100; //
    // Define a public mappings 'assets' that maps the UPC to an asset.
    mapping (uint => Component) components;
    mapping (uint => Equipment) equipments;
    mapping(uint => Aircraft) aircrafts;


    // Define a public mapping 'assetsHistory' that maps the UPC to an array of TxHash,
    // that track its journey through the supply chain -- to be sent from DApp.
    mapping (uint => string[]) componentsHistory;
    mapping (uint => string[]) equipmentsHistory;

    // define the mapping for the withdrawal pattern
    // see https://solidity.readthedocs.io/en/v0.5.3/common-patterns.html#withdrawal-from-contracts
    mapping (address => uint) public pendingWithdrawals;

    // Define enum 'State' with the following values:
    enum State {
        Unhandled,     // 0
        Ordered,       // 1
        Assembled,     // 2
        Packed,        // 3
        InTransit,     // 4
        Received,      // 5
        Integrated,    // 6
        StructureReady // 7
    }

    // Define 8 events with the same 8 state values
    event Ordered(string asset, uint id); // asset= aircraft, equipment or equipment, id=msn or id
    event Assembled(string asset, uint id);
    event Packed(uint id);
    event InTransit(uint id);
    event Received(string asset, uint id);
    event Integrated(string asset, uint id);
    event StructureReady(uint msn);

    // Define strut for each asset: Component, Equipment, Aircraft
    struct Component {
        uint id; // Universal Product Code (UPC) - unique to the product
        uint equipmentID;  // Equipment ID that component will be part of
        State state;  // Component State as represented in the enum above
        string originManufacturerName; // Manufacturer Name
        string originPlant;  // city
        address supplierID;  // Metamask-Ethereum address of the equipment supplier that bought this equipment
    }

    // Define a struct 'Equipment' with the following fields:
    struct Equipment {
        uint id; // Universal Product Code (UPC) - unique to the product
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
        uint equipmentID; // id of the equipment integrated into this AC
        uint price;
        State state;
        address ownerID;
        address payable manufacturerID; // AC Manufacturer that produced this AC
        string originPlant;
        string aircraftNotes;
        address customerID; // airline that bought this aircraft
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier verifyCaller (address _address) {
        require(msg.sender == _address, "Caller not allowed to execute this function");
        _;
    }

    modifier paidEnough(uint _price) {
        require(msg.value >= _price, "Value sent does not cover the price!");
        _;
    }

    // Define a modifier that checks the price and refunds the remaining balance
    modifier checkValue(uint _id) {
        uint _price = equipments[_id].price;
        uint amountToReturn = msg.value - _price;
        equipments[_id].manufacturerID.transfer(amountToReturn);
        _;
    }

    modifier ordered(uint _idOrMsn) {
        require(equipments[_idOrMsn].state == State.Ordered || aircrafts[_idOrMsn].state == State.Ordered);
        _;
    }

    modifier received(uint _id) {
        require(components[_id].state == State.Received || equipments[_id].state == State.Received);
        _;
    }

    modifier assembled(uint _idOrMsn) {
        require(
            equipments[_idOrMsn].state == State.Assembled || aircrafts[_idOrMsn].state == State.Assembled,
            "Missing asset or asset in the wrong state");
        _;
    }

    modifier packed(uint _id) {
        require(equipments[_id].state == State.Packed);
        _;
    }

    modifier inTransit(uint _id) {
        require(equipments[_id].state == State.InTransit);
        _;
    }

    modifier structureReady(uint _id) {
        require(aircrafts[_id].state == State.StructureReady);
        _;
    }

    // In the constructor set 'owner' to the address that instantiated the contract
    // and set 'msn' to 1
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

    // Allows users to withdraw their payments from the contract
    function withdraw() public {
        uint amount = pendingWithdrawals[msg.sender];
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
    }

    // function to order an AC. Customer provides the equipment he wants and the manufacterID
    function orderAircraft(uint _equipmentID, address payable _manufacturerID)
    public
    payable
    onlyCustomer
    paidEnough(500000000000000000)
    checkValue(500000000000000000)
    {
        pendingWithdrawals[_manufacturerID] += 500000000000000000;
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
        uint _equipmentID,
        address payable _supplierID,
        uint _msn
    )
    public
    payable
    onlyManufacturer
    ordered(_msn)
    paidEnough(equipmentPrice)
    checkValue(equipmentPrice)
    {
        pendingWithdrawals[_supplierID] += equipmentPrice;

        // Add the new Component as part of the mapping
        equipments[_equipmentID] = Equipment(
            _equipmentID,
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
        emit Ordered("Equipment", _equipmentID);
    }

    function receiveComponent(
        uint _componentID,
        string memory _originManufacturerName,
        string memory _originPlant,
        uint _equipmentID
    )
    public
    onlySupplier
    ordered(_equipmentID)
    {
        // Add the new Component as part of the mapping
        components[_componentID] = Component(
            _componentID,
            _equipmentID,
            State.Received,
            _originManufacturerName,
            _originPlant,
            msg.sender
        );

        // Emit the appropriate event
        emit Received("Component", _componentID);
    }

    function processComponent(
        uint _componentID,
        string memory _originPlant,
        string memory _equipmentNotes
    )
    public
    onlySupplier
    received(_componentID)
    ordered(components[_componentID].equipmentID)
    // verify that caller is the same as the supplier contracted by the manufacturer who ordered the equipment
    verifyCaller(equipments[components[_componentID].equipmentID].supplierID)
    {
        components[_componentID].state = State.Integrated;

        equipments[components[_componentID].equipmentID].componentID = _componentID;
        equipments[components[_componentID].equipmentID].state = State.Assembled;
        equipments[components[_componentID].equipmentID].ownerID = msg.sender;
        equipments[components[_componentID].equipmentID].originPlant = _originPlant;
        equipments[components[_componentID].equipmentID].equipmentNotes = _equipmentNotes;

        emit Integrated("Component", _componentID);
        emit Assembled("Equipment", components[_componentID].equipmentID);
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

    function packEquipment(uint _equipmentID, address payable _transporterID)
    public
    payable
    onlySupplier
    assembled(_equipmentID)
    // verify that caller is the supplier that was contracted by manufacturer that ordered the equipment
    verifyCaller(equipments[_equipmentID].supplierID)
    // Supplier pays halfs the transportFee at expedition stage
    paidEnough(50)
    checkValue(50)
    {
        pendingWithdrawals[_transporterID] += 50;

        equipments[_equipmentID].state = State.Packed;
        equipments[_equipmentID].transporterID = _transporterID;

        emit Packed(_equipmentID);
    }

    function transportEquipment(uint _equipmentID)
    public
    onlyTransporter
    // verify that caller is the transporter that was contracted by the supplier
    verifyCaller(equipments[_equipmentID].transporterID)
    packed(_equipmentID)
    {
        equipments[_equipmentID].state = State.InTransit;
        equipments[_equipmentID].ownerID = msg.sender;
        emit InTransit(_equipmentID);
    }

    function receiveEquipment(uint _equipmentID)
    public
    payable
    onlyManufacturer
    inTransit(_equipmentID)
    // verify that caller is the manufactuer that ordered the equipment in the first place
    verifyCaller(equipments[_equipmentID].manufacturerID)
    // manufactuer pays second half of the transportFee
    paidEnough(50)
    checkValue(50)
    {
        pendingWithdrawals[equipments[_equipmentID].transporterID] += 50;

        equipments[_equipmentID].state = State.Received;
        equipments[_equipmentID].ownerID = msg.sender;

        emit Received("Equipment", _equipmentID);
    }

    function processEquipment(uint _equipmentID, string memory _aircraftNotes)
    public
    onlyManufacturer
    received(_equipmentID)
    structureReady(equipments[_equipmentID].msn)
    // verify that caller is the same as the manufacturer who ordered the equipment in the first place
    verifyCaller(equipments[_equipmentID].manufacturerID)
    // verify that caller is the same as the manufacturer contracted by the customer who ordered the aircraft
    verifyCaller(aircrafts[equipments[_equipmentID].msn].manufacturerID)
    {
        equipments[_equipmentID].state = State.Integrated;

        aircrafts[equipments[_equipmentID].msn].state = State.Assembled;
        // possiblity to update notes at this stage:
        aircrafts[equipments[_equipmentID].msn].aircraftNotes = string(abi.encodePacked(
            aircrafts[equipments[_equipmentID].msn].aircraftNotes,
            ", Assembly stage: ",
            _aircraftNotes
        ));

        emit Integrated("Equipment", _equipmentID);
        emit Assembled("Aircraft", equipments[_equipmentID].msn);
    }

    // function receiveAircraft(uint _msn)
    // public
    // payable
    // onlyCustomer
    // assembled(_msn)
    // verifyCaller(aircrafts[_msn].customerID)
    // // customer pays second half at aircraft reception
    // paidEnough(500000000000000000)
    // checkValue(500000000000000000)
    // {
    //     pendingWithdrawals[aircrafts[_msn].manufacturerID] += 500000000000000000;
    //
    //     aircrafts[_msn].state = State.Received;
    //     aircrafts[_msn].ownerID = msg.sender;
    //
    //     emit Received("Aircraft", _msn);
    // }

    // Define functions 'fetchAsset' that fetches the data of a given asset
    function fetchComponent(uint _id)
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
        Component memory component = components[_id];
        componentUPC = _id;
        equipmentID = component.equipmentID;
        state = component.state;
        originManufacturerName = component.originManufacturerName;
        originPlant = component.originPlant;
        supplierID = component.supplierID;
    }

    function fetchEquipment(uint _id)
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
        Equipment memory equipment = equipments[_id];
        equipmentUPC = _id;
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
