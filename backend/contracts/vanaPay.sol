// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// money --- user buys --- helds in escrow for time if he wants refund auto--refun under 24 hour or/xhours
//after x-hours money flow into to the contract and owner cna withdraw in his wallet 
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract PaymentGateway is ReentrancyGuard{
  using SafeERC20 for IERC20;
  address public owner;
  uint256 public feeBPS;
  uint256 public constant ESCROW_TIME=24 hours;
  struct Payment{
    address token;
    uint256 amount;
    uint256 fees;
    uint256 timestamp;
    bool refunded;
    bool withdrawn;
  }
  mapping(address=>Payment[])public payments;
  event paymentRecieved(address indexed sender ,address network ,uint256 amount ,uint256 fees ,uint256 timestamp );
  event refunded(address indexed payer ,address indexed token ,  uint256 amount );
  event withdraw(address owner ,address indexed token ,uint256 amount);

  modifier onlyOwner(){
    require(msg.sender==owner, "You are not the owner");
    _;
  }

  constructor(uint256 _feeAmount){
    owner=msg.sender;
    feeBPS=_feeAmount;
  }

  //--eth pay
  function payETH()external payable nonReentrant{
    require(msg.value>0,"should be greater than 0");
    uint256 _fees=(msg.value*feeBPS)/10000;
    uint256 netAmount=msg.value-_fees;
    payments[msg.sender].push(
      Payment({
        token:address(0),
        amount:netAmount,
        fees:_fees,
        timestamp:block.timestamp,
        refunded:false,
        withdrawn:false

      })
    );
    emit paymentRecieved(msg.sender,address(0),netAmount, _fees, block.timestamp );  
  }
  function payERC20(address token , uint256 _amount)external payable nonReentrant{
    require(token!=address(0),"Invalid Token");
    require(_amount>0 , "Must be greater than 0");
    uint256 _fee=(_amount*feeBPS)/10000;
    uint256 net=_amount-_fee;
    IERC20(token).safeTransferFrom(
      msg.sender, 
      address(this),
      _amount
    );

    payments[msg.sender].push(
      Payment({
        token:token,
        amount:net,
        fees:_fee,
        timestamp:block.timestamp,
        refunded:false,
        withdrawn:false
      })
    );

    emit paymentRecieved(msg.sender, token, net, _fee, block.timestamp);
  }
  function Refunded(uint256 index)external nonReentrant{
    Payment storage p=payments[msg.sender][index];
    require(!p.refunded,"Already Refunded");
    require(!p.withdrawn,"Already withdrawn");
    require(block.timestamp<=p.timestamp+ESCROW_TIME,"Refunded expire");
    p.refunded=true;
    if(p.token==address(0)){
    (bool success,)=payable(msg.sender).call{value:p.amount}("");
    require(success , "Eth Transaction Failed");
    }else{
      IERC20(p.token).safeTransfer(msg.sender,p.amount);
    }
    emit refunded(msg.sender, p.token , p.amount);
  }

  function WithDraw(address customer, uint256 _index)external onlyOwner nonReentrant{
    Payment storage p=payments[customer][_index];
    require(!p.refunded,"Payment Refunded");
    require(!p.withdrawn,"Already WithDraw");
    require(block.timestamp> p.timestamp+ESCROW_TIME,"Escrow Still active----");
    p.withdrawn=true;
    uint256 total=p.amount+p.fees;
    if(p.token==address(0)){
    (bool success,)=payable(owner).call{value:p.amount+p.fees}("");
    require(success , "Eth Transaction Failed");
    emit withdraw(owner,p.token , p.amount+p.fees);
    }else{
      IERC20(p.token).safeTransfer(owner,total);
    emit withdraw(owner, p.token, total);
    }
  }

  function withDrawAll(uint256[] calldata indices,address customer )external onlyOwner nonReentrant{
    uint256 totalETHToWithDraw=0;
    for (uint256 i = 0; i < indices.length; i++) {
      Payment storage p=payments[customer][indices[i]];
      if(!p.withdrawn && !p.refunded  && block.timestamp> p.timestamp+ESCROW_TIME){
        p.withdrawn=true;
        if(p.token==address(0)){
        totalETHToWithDraw+=(p.amount+p.fees);
        }else{
          // totalAmount+=p.amount+p.fees;
          IERC20(p.token).safeTransfer(owner ,p.amount+p.fees);
          emit withdraw(owner, p.token, p.amount+p.fees);
        }
      }
    }
  if(totalETHToWithDraw>0){
    (bool success,)=payable(owner).call{value:totalETHToWithDraw}("");
    require(success , "Eth Batch Transaction failed..");
    emit withdraw(owner, address(0) ,totalETHToWithDraw);
  }
  } 




}