// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// money --- user buys --- helds in escrow for time if he wants refund auto--refun under 24 hour or/xhours
//after x-hours money flow into to the contract and owner cna withdraw in his wallet 
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
contract PaymentGateway is ReentrancyGuard{
  address public owner;
  uint256 public feesAmount;
  uint256 public constant ESCROW_TIME=24 hours;
  struct Payment{
    uint256 amount;
    uint256 fees;
    uint256 timestamp;
    bool refunded;
    bool withdrawn;
  }
  mapping(address=>Payment[])public payments;
  event paymentRecieved(address indexed sender , uint256 amount ,uint256 fees ,uint256 timestamp);
  event refunded(address indexed payer , uint256 amount );
  event withdraw(address owner ,uint256 amount);

  modifier onlyOwner(){
    require(msg.sender==owner, "You are not the owner");
    _;
  }

  constructor(uint256 _feeAmount){
    owner=msg.sender;
    feesAmount=_feeAmount;
  }

  //--eth pay
  function pay()external payable nonReentrant{
    require(msg.value>0,"should be greater than 0");
    uint256 _fees=(msg.value*feesAmount)/100;
    uint256 netAmount=msg.value-_fees;
    payments[msg.sender].push(
      Payment({
        amount:netAmount,
        fees:_fees,
        timestamp:block.timestamp,
        refunded:false,
        withdrawn:false

      })
    );

    emit paymentRecieved(msg.sender, netAmount, _fees, block.timestamp);
    
  }

  function Refunded(uint256 index)external nonReentrant{
    Payment storage p=payments[msg.sender][index];
    require(!p.refunded,"Already Refunded");
    require(!p.withdrawn,"Already withdrawn");
    require(block.timestamp<=p.timestamp+ESCROW_TIME,"Refunded expire");
    p.refunded=true;
    (bool success ,_)=payable(msg.sender).call{value:p.amount}("");
    require(success , "Refunded Failed");
    emit refunded(msg.sender, p.amount);
  }

  function WithDraw(address customer, uint256 _index)external onlyOwner nonReentrant{
    Payment storage p=payments[customer][_index];
    require(!p.refunded,"Payment Refunded");
    require(!p.withdrawn,"Already WithDraw");
    require(block.timestamp> p.timestamp+ESCROW_TIME,"Escrow Still active----");
    p.withdrawn=true;
    (bool success, _)=payable(owner).call{value:p.amount+p.fees}("");
    emit withdraw(owner , p.amount+p.fees);
  }

  function withDrawALl(uint256[] calldata indices,address customer )external onlyOwner nonReentrant{
    uint256 totalToWithDraw=0;
    for (uint256 i = 0; i < indices.length; i++) {
      Payment storage p=payments[customer][indices[i]];

      if(!p.withdrawn  && block.timestamp> p.timestamp+ESCROW_TIME){
        p.withdrawn=true;
        totalToWithDraw+=(p.amount+p.fees);
      }
      
    }
  if(totalToWithDraw>0){
    (bool success)=payable(owner).call{value:totalToWithDraw}("");
    require(success , "Failed---");
    emit withdraw(owner ,totalToWithDraw)
  }
  } 


}