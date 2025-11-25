// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfund {
    uint public goal;               // Campaign goal
    uint public amountRaised;       // Total raised
    bool public locked;             // Locker for if goal is raised
    address public owner;           // Creator of the contract
    address[] contributors;         // List of contributor addresses

    mapping ( address => bool ) public hasContributed;      // Record whether an address has contributed before
    mapping ( address => uint ) public amountContributed;   // Record how much an address has contributed

    event Contribution ( address contributor, uint amountDonated );     // Event to log contributions
    event Refund ( address contributor, uint amountRefunded );          // Event to log refunds

    modifier onlyOwner () {
        require ( msg.sender == owner, "Only the owner is authorized to perform this action" );
        _;
    }

    constructor ( uint _goal ) {
        owner = msg.sender;
        goal = _goal;
        amountRaised = 0;
        locker();
    }

    function contribute () public payable {
        require ( msg.value > 0, "Invalid contribution amount" );
        require ( !hasContributed[msg.sender], "You have already contributed to this campaign" );
        hasContributed[msg.sender] = true;
        contributors.push ( msg.sender );
        amountContributed[msg.sender] += msg.value;
        amountRaised += msg.value;

        locker();

        emit Contribution ( msg.sender, msg.value );
    }

    function refund ( uint refund_amount ) public {
        require ( hasContributed[msg.sender], "You have not contributed to this campaign, consider doing so before requesting a refund" );
        require ( amountContributed[msg.sender] >= refund_amount, "You are requesting a refund larger than your contribution" );
        require ( !locked, "Sorry, this campaign reached its goal, you can no longer request a refund" );
        
        amountRaised -= refund_amount; 
        amountContributed[msg.sender] -= refund_amount;
        
        if (amountContributed[msg.sender] == 0 )
            hasContributed[msg.sender] = false;

        locker();

        payable(msg.sender).transfer(refund_amount);

        emit Refund(msg.sender, refund_amount);
    }
    
    function locker () private {
        if ( amountRaised >= goal )
            locked = true;
        else
            locked = false;
    }    

}