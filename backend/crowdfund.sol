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

    function contribute ( uint donation_amount ) public {
        require ( donation_amount > 0, "Invalid contribution amount" );
        require ( !hasContributed[msg.sender], "You have already contributed to this campaign" );
        hasContributed[msg.sender] = true;
        contributors.push ( msg.sender );
        amountContributed[msg.sender] += donation_amount;
        amountRaised += donation_amount;

        locker();

        emit Contribution ( msg.sender, donation_amount );
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

        emit Refund(msg.sender, refund_amount);
    }
    
    function locker () private {
        if ( amountRaised >= goal )
            locked = true;
        else
            locked = false;
    }    












    /* working function for boolean implementation
    function contribute () public {
        require ( !hasContributed[msg.sender], "You have already contributed to this campaign" );
        // TODO: ADJUST THIS TO A VARIABLE AMOUNT BASED OFF DONATION SIZE, 1 IS AMOUNT
        uint donation_amount = 1;
        hasContributed[msg.sender] = true;
        contributors.push ( msg.sender );
        amountRaised += donation_amount;

        locker();

        emit Contribution ( msg.sender, donation_amount );
    }

    function refund () public {
        require ( hasContributed[msg.sender], "You have not contributed to this campaign, consider doing so before requesting a refund" );
        // TODO: UPDATE THIS TO CHECK THE AMOUNT THEY HAVE DONATED IS LARGER/EQUAL TO THEIR REQUEST
        require ( !locked, "Sorry, this campaign reached its goal, you can no longer request a refund" );
        
        uint refund_amount = 1;
        amountRaised -= refund_amount; 
        hasContributed[msg.sender] = false; // This will need to be adjusted when we implement proper amounts for partial refund functionality

        locker();

        emit Refund(msg.sender, refund_amount);
    }
    */
}