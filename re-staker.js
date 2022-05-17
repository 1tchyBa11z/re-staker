const fs = require('fs');
const path = require('path');
require('dotenv').config()
const Web3 = require('web3')
const math = require('mathjs');

function shortId(str, size) {
        return str.substr(0, 6) + '...' + str.substr(36,42);
}
const P =  process.env.PRIVATE_KEYS.split(",") ;

//WEB3 Config
const web3 = new Web3(process.env.RPC_URL);
//rechecks every 10ins. Adjust accordingly in Milliseconds
const POLLING_INTERVAL = 600000 // 10 mins in milliseconds;
let i = 0;
let y = 0;
console.log(" ░▒█▀▀▀█░▀█▀░█▀▀▄░█░▄░█▀▀░█▀▀▄░░░▒█▀▀█░█▀▀▄░▄▀▀▄░▀█▀░▄▀▀▄░█▀▄░▄▀▀▄░█░ ")
console.log(" ░░▀▀▀▄▄░░█░░█▄▄█░█▀▄░█▀▀░█▄▄▀░░░▒█▄▄█░█▄▄▀░█░░█░░█░░█░░█░█░░░█░░█░█░ ")
console.log(" ░▒█▄▄▄█░░▀░░▀░░▀░▀░▀░▀▀▀░▀░▀▀░░░▒█░░░░▀░▀▀░░▀▀░░░▀░░░▀▀░░▀▀▀░░▀▀░░▀▀ ")
                                                                  
console.log("stakerprotocol.com re-staker/compounder \n");

console.log("If you find this script useful, consider donating to the developers:\n0xE1751655b290C573573eB1E14358C3E092AaA467 \n")

console.log(`Polling time: ${POLLING_INTERVAL / 60000} minutes`);

        //SMART CONTRACT ABI
        const ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_mintAddress",
                "type": "address"
            },
            {
                "name": "_PennyTokenAddress",
                "type": "address",
                "internalType": "address"
            },
            {
                "internalType": "address",
                "type": "address",
                "name": "_stakerTokenAddress"
            },
            {
                "internalType": "address",
                "type": "address",
                "name": "_vaultAddress"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "type": "event",
        "anonymous": false,
        "inputs": [
            {
                "name": "_src",
                "internalType": "address",
                "type": "address",
                "indexed": true
            },
            {
                "internalType": "address",
                "name": "_dest",
                "type": "address",
                "indexed": true
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_deposits",
                "type": "uint256"
            },
            {
                "name": "_payouts",
                "indexed": false,
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "name": "BalanceTransfer"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "type": "address",
                "name": "addr"
            },
            {
                "name": "beneficiary",
                "indexed": true,
                "internalType": "address",
                "type": "address"
            }
        ],
        "type": "event",
        "name": "BeneficiaryUpdate"
    },
    {
        "name": "Checkin",
        "inputs": [
            {
                "name": "addr",
                "indexed": true,
                "type": "address",
                "internalType": "address"
            },
            {
                "indexed": false,
                "type": "uint256",
                "name": "timestamp",
                "internalType": "uint256"
            }
        ],
        "anonymous": false,
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "internalType": "address",
                "indexed": true,
                "type": "address",
                "name": "addr"
            },
            {
                "name": "from",
                "internalType": "address",
                "type": "address",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amount",
                "internalType": "uint256",
                "indexed": false
            }
        ],
        "type": "event",
        "name": "DirectPayout"
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "HeartBeat",
        "inputs": [
            {
                "indexed": true,
                "name": "addr",
                "type": "address",
                "internalType": "address"
            },
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": "timestamp",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "HeartBeatIntervalUpdate",
        "inputs": [
            {
                "internalType": "address",
                "type": "address",
                "indexed": true,
                "name": "addr"
            },
            {
                "type": "uint256",
                "name": "interval",
                "indexed": false,
                "internalType": "uint256"
            }
        ]
    },
    {
        "name": "Leaderboard",
        "type": "event",
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "type": "address",
                "name": "addr"
            },
            {
                "indexed": false,
                "type": "uint256",
                "name": "referrals",
                "internalType": "uint256"
            },
            {
                "internalType": "uint256",
                "indexed": false,
                "name": "total_deposits",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "total_payouts",
                "type": "uint256"
            },
            {
                "type": "uint256",
                "name": "total_structure",
                "indexed": false,
                "internalType": "uint256"
            }
        ]
    },
    {
        "name": "LimitReached",
        "inputs": [
            {
                "internalType": "address",
                "indexed": true,
                "type": "address",
                "name": "addr"
            },
            {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256",
                "indexed": false
            }
        ],
        "type": "event",
        "anonymous": false
    },
    {
        "anonymous": false,
        "type": "event",
        "name": "ManagerUpdate",
        "inputs": [
            {
                "internalType": "address",
                "indexed": true,
                "name": "addr",
                "type": "address"
            },
            {
                "internalType": "address",
                "type": "address",
                "name": "manager",
                "indexed": true
            },
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": "timestamp",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MatchPayout",
        "inputs": [
            {
                "internalType": "address",
                "name": "addr",
                "type": "address",
                "indexed": true
            },
            {
                "name": "from",
                "indexed": true,
                "type": "address",
                "internalType": "address"
            },
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": "amount",
                "indexed": false
            }
        ]
    },
    {
        "name": "NewAirdrop",
        "type": "event",
        "anonymous": false,
        "inputs": [
            {
                "name": "from",
                "type": "address",
                "internalType": "address",
                "indexed": true
            },
            {
                "internalType": "address",
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "type": "uint256",
                "name": "amount"
            },
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": "timestamp",
                "indexed": false
            }
        ]
    },
    {
        "name": "NewDeposit",
        "anonymous": false,
        "type": "event",
        "inputs": [
            {
                "internalType": "address",
                "indexed": true,
                "name": "addr",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "indexed": false,
                "type": "uint256",
                "name": "amount"
            }
        ]
    },
    {
        "inputs": [
            {
                "indexed": true,
                "type": "bytes32",
                "name": "role",
                "internalType": "bytes32"
            },
            {
                "indexed": true,
                "type": "bytes32",
                "name": "previousAdminRole",
                "internalType": "bytes32"
            },
            {
                "type": "bytes32",
                "internalType": "bytes32",
                "name": "newAdminRole",
                "indexed": true
            }
        ],
        "type": "event",
        "name": "RoleAdminChanged",
        "anonymous": false
    },
    {
        "name": "RoleGranted",
        "type": "event",
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "type": "address",
                "name": "account",
                "indexed": true
            },
            {
                "type": "address",
                "indexed": true,
                "name": "sender",
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "internalType": "bytes32",
                "type": "bytes32",
                "name": "role",
                "indexed": true
            },
            {
                "type": "address",
                "internalType": "address",
                "indexed": true,
                "name": "account"
            },
            {
                "name": "sender",
                "indexed": true,
                "type": "address",
                "internalType": "address"
            }
        ],
        "type": "event",
        "name": "RoleRevoked"
    },
    {
        "type": "event",
        "anonymous": false,
        "inputs": [
            {
                "name": "addr",
                "indexed": true,
                "type": "address",
                "internalType": "address"
            },
            {
                "internalType": "address",
                "name": "upline",
                "indexed": true,
                "type": "address"
            }
        ],
        "name": "Upline"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "type": "address",
                "internalType": "address",
                "indexed": true,
                "name": "addr"
            },
            {
                "name": "amount",
                "internalType": "uint256",
                "indexed": false,
                "type": "uint256"
            }
        ],
        "type": "event",
        "name": "Withdraw"
    },
    {
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "name": "CompoundTax",
        "type": "function",
        "inputs": []
    },
    {
        "inputs": [],
        "name": "DEFAULT_ADMIN_ROLE",
        "type": "function",
        "stateMutability": "view",
        "outputs": [
            {
                "type": "bytes32",
                "internalType": "bytes32",
                "name": ""
            }
        ]
    },
    {
        "inputs": [],
        "stateMutability": "view",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "type": "function",
        "name": "ExitTax"
    },
    {
        "type": "function",
        "name": "GOVERNANCE_ROLE",
        "outputs": [
            {
                "type": "bytes32",
                "internalType": "bytes32",
                "name": ""
            }
        ],
        "stateMutability": "view",
        "inputs": []
    },
    {
        "name": "MAX_UINT",
        "inputs": [],
        "type": "function",
        "stateMutability": "view",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "inputs": [
            {
                "type": "address",
                "internalType": "address",
                "name": ""
            }
        ],
        "stateMutability": "view",
        "name": "airdrops",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "airdrops",
                "type": "uint256"
            },
            {
                "name": "airdrops_received",
                "internalType": "uint256",
                "type": "uint256"
            },
            {
                "name": "last_airdrop",
                "internalType": "uint256",
                "type": "uint256"
            }
        ]
    },
    {
        "outputs": [
            {
                "name": "",
                "internalType": "uint256",
                "type": "uint256"
            }
        ],
        "type": "function",
        "name": "claim_ref_bonus",
        "inputs": [],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "custody",
        "stateMutability": "view",
        "inputs": [
            {
                "internalType": "address",
                "type": "address",
                "name": ""
            }
        ],
        "outputs": [
            {
                "internalType": "address",
                "name": "manager",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "beneficiary",
                "type": "address"
            },
            {
                "type": "uint256",
                "name": "last_heartbeat",
                "internalType": "uint256"
            },
            {
                "internalType": "uint256",
                "type": "uint256",
                "name": "last_checkin"
            },
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": "heartbeat_interval"
            }
        ]
    },
    {
        "type": "function",
        "outputs": [
            {
                "type": "uint256",
                "name": "",
                "internalType": "uint256"
            }
        ],
        "name": "deposit_bracket_max",
        "stateMutability": "view",
        "inputs": []
    },
    {
        "inputs": [],
        "type": "function",
        "stateMutability": "view",
        "outputs": [
            {
                "type": "uint256",
                "name": "",
                "internalType": "uint256"
            }
        ],
        "name": "deposit_bracket_size"
    },
    {
        "stateMutability": "view",
        "outputs": [
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": ""
            }
        ],
        "name": "deposit_ref_bonus",
        "inputs": [],
        "type": "function"
    },
    {
        "outputs": [
            {
                "name": "",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            }
        ],
        "type": "function",
        "stateMutability": "view",
        "name": "getRoleAdmin"
    },
    {
        "outputs": [],
        "type": "function",
        "stateMutability": "nonpayable",
        "inputs": [
            {
                "internalType": "bytes32",
                "type": "bytes32",
                "name": "role"
            },
            {
                "internalType": "address",
                "type": "address",
                "name": "account"
            }
        ],
        "name": "grantRole"
    },
    {
        "inputs": [
            {
                "type": "bytes32",
                "internalType": "bytes32",
                "name": "role"
            },
            {
                "type": "address",
                "internalType": "address",
                "name": "account"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "internalType": "bool",
                "name": ""
            }
        ],
        "stateMutability": "view",
        "name": "hasRole",
        "type": "function"
    },
    {
        "stateMutability": "view",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "internalType": "uint256",
                "type": "uint256"
            }
        ],
        "name": "max_payout_cap",
        "type": "function"
    },
    {
        "name": "minimumAmount",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "stateMutability": "view",
        "inputs": [],
        "name": "minimumInitial",
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "outputs": [
            {
                "internalType": "address",
                "type": "address",
                "name": ""
            }
        ],
        "name": "owner",
        "type": "function",
        "inputs": []
    },
    {
        "type": "function",
        "stateMutability": "view",
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "inputs": [],
        "name": "payoutRate"
    },
    {
        "stateMutability": "view",
        "inputs": [],
        "type": "function",
        "outputs": [
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": ""
            }
        ],
        "name": "payoutRateScale"
    },
    {
        "name": "pennyToken",
        "type": "function",
        "inputs": [],
        "stateMutability": "view",
        "outputs": [
            {
                "type": "address",
                "internalType": "contract IToken",
                "name": ""
            }
        ]
    },
    {
        "outputs": [
            {
                "internalType": "bool",
                "type": "bool",
                "name": ""
            }
        ],
        "name": "refPayOutIsActive",
        "type": "function",
        "stateMutability": "view",
        "inputs": []
    },
    {
        "stateMutability": "view",
        "type": "function",
        "outputs": [
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": ""
            }
        ],
        "inputs": [
            {
                "name": "",
                "internalType": "uint256",
                "type": "uint256"
            }
        ],
        "name": "ref_balances"
    },
    {
        "stateMutability": "view",
        "inputs": [],
        "name": "ref_depth",
        "type": "function",
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ]
    },
    {
        "stateMutability": "nonpayable",
        "name": "renounceRole",
        "outputs": [],
        "inputs": [
            {
                "type": "bytes32",
                "name": "role",
                "internalType": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "type": "function"
    },
    {
        "type": "function",
        "stateMutability": "nonpayable",
        "inputs": [
            {
                "internalType": "bytes32",
                "type": "bytes32",
                "name": "role"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "revokeRole",
        "outputs": []
    },
    {
        "name": "shareFee",
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "inputs": [],
        "type": "function",
        "stateMutability": "view"
    },
    {
        "stateMutability": "view",
        "name": "stakerToken",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "internalType": "contract IToken",
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "outputs": [
            {
                "name": "",
                "internalType": "contract IStakerVault",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "name": "stakerVault",
        "inputs": []
    },
    {
        "name": "stakerVaultAddress",
        "outputs": [
            {
                "type": "address",
                "internalType": "address",
                "name": ""
            }
        ],
        "inputs": [],
        "type": "function",
        "stateMutability": "view"
    },
    {
        "name": "supportsInterface",
        "outputs": [
            {
                "name": "",
                "internalType": "bool",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "inputs": [
            {
                "name": "interfaceId",
                "internalType": "bytes4",
                "type": "bytes4"
            }
        ]
    },
    {
        "outputs": [
            {
                "type": "address",
                "internalType": "contract ITokenMint",
                "name": ""
            }
        ],
        "type": "function",
        "stateMutability": "view",
        "name": "tokenMint",
        "inputs": []
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "total_airdrops",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "inputs": []
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "total_bnb",
        "inputs": [],
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "outputs": [
            {
                "internalType": "uint256",
                "type": "uint256",
                "name": ""
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "name": "total_deposited",
        "inputs": []
    },
    {
        "name": "total_txs",
        "outputs": [
            {
                "type": "uint256",
                "name": "",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view",
        "inputs": [],
        "type": "function"
    },
    {
        "name": "total_users",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "internalType": "uint256",
                "type": "uint256"
            }
        ],
        "type": "function",
        "stateMutability": "view"
    },
    {
        "name": "total_withdraw",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": ""
            }
        ],
        "stateMutability": "view"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "outputs": [
            {
                "type": "address",
                "internalType": "address",
                "name": "upline"
            },
            {
                "type": "uint256",
                "name": "referrals",
                "internalType": "uint256"
            },
            {
                "name": "total_structure",
                "internalType": "uint256",
                "type": "uint256"
            },
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": "direct_bonus"
            },
            {
                "name": "match_bonus",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "name": "deposits",
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": "deposit_time"
            },
            {
                "internalType": "uint256",
                "type": "uint256",
                "name": "payouts"
            },
            {
                "internalType": "uint256",
                "type": "uint256",
                "name": "rolls"
            },
            {
                "internalType": "uint256",
                "name": "ref_claim_pos",
                "type": "uint256"
            },
            {
                "type": "uint256",
                "name": "accumulatedDiv",
                "internalType": "uint256"
            }
        ],
        "name": "users"
    },
    {
        "type": "function",
        "outputs": [],
        "stateMutability": "nonpayable",
        "name": "updateRefBalances",
        "inputs": [
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": "level"
            },
            {
                "internalType": "uint256",
                "type": "uint256",
                "name": "levelAmount"
            }
        ]
    },
    {
        "name": "updateTokenMint",
        "inputs": [
            {
                "name": "_newTokenMint",
                "type": "address",
                "internalType": "address"
            }
        ],
        "type": "function",
        "stateMutability": "nonpayable",
        "outputs": []
    },
    {
        "inputs": [
            {
                "type": "address",
                "internalType": "address",
                "name": "_newOwner"
            }
        ],
        "type": "function",
        "name": "updateOwner",
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "name": "updatePennyToken",
        "inputs": [
            {
                "type": "address",
                "internalType": "address",
                "name": "_newPennyToken"
            }
        ],
        "outputs": [],
        "type": "function",
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "outputs": [],
        "inputs": [
            {
                "name": "_newStakerToken",
                "internalType": "address",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "name": "updateStakerToken"
    },
    {
        "name": "updateStakerVault",
        "inputs": [
            {
                "type": "address",
                "internalType": "address",
                "name": "_newStakerVault"
            }
        ],
        "stateMutability": "nonpayable",
        "outputs": [],
        "type": "function"
    },
    {
        "type": "function",
        "name": "updatePayoutRate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "inputs": [
            {
                "internalType": "uint256",
                "type": "uint256",
                "name": "_newPayoutRate"
            }
        ]
    },
    {
        "type": "function",
        "stateMutability": "nonpayable",
        "name": "updateRefDepth",
        "outputs": [],
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_newRefDepth",
                "type": "uint256"
            }
        ]
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "type": "uint256",
                "name": "_newRefBonus"
            }
        ],
        "name": "updateDepositRefBonus",
        "outputs": [],
        "type": "function",
        "stateMutability": "nonpayable"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "type": "uint256",
                "name": "_newRefBonus"
            }
        ],
        "name": "updateClaimRefBonus",
        "stateMutability": "nonpayable",
        "type": "function",
        "outputs": []
    },
    {
        "inputs": [
            {
                "type": "bool",
                "name": "_isActive",
                "internalType": "bool"
            }
        ],
        "name": "updateRefPayOutActivation",
        "outputs": [],
        "type": "function",
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "stateMutability": "nonpayable",
        "name": "updateInitialDeposit",
        "outputs": [],
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_newInitialDeposit",
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "outputs": [],
        "inputs": [
            {
                "type": "uint256",
                "name": "_newMinimumAmountDeposit",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "name": "updateMinimumAmountDeposit"
    },
    {
        "outputs": [],
        "inputs": [
            {
                "name": "_newCompoundTax",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "updateCompoundTax"
    },
    {
        "type": "function",
        "name": "updateExitTax",
        "stateMutability": "nonpayable",
        "outputs": [],
        "inputs": [
            {
                "internalType": "uint256",
                "type": "uint256",
                "name": "_newExitTax"
            }
        ]
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "inputs": [
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": "_newBracketSize"
            }
        ],
        "outputs": [],
        "name": "updateDepositBracketSize"
    },
    {
        "inputs": [
            {
                "name": "_shareFee",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "name": "updateShareFee",
        "type": "function",
        "outputs": []
    },
    {
        "name": "updateMaxPayoutCap",
        "inputs": [
            {
                "internalType": "uint256",
                "type": "uint256",
                "name": "_newPayoutCap"
            }
        ],
        "outputs": [],
        "type": "function",
        "stateMutability": "nonpayable"
    },
    {
        "stateMutability": "nonpayable",
        "name": "updateDeposit_bracket_max",
        "outputs": [],
        "type": "function",
        "inputs": [
            {
                "type": "uint256",
                "name": "_newDepositBracketMax",
                "internalType": "uint256"
            }
        ]
    },
    {
        "outputs": [],
        "stateMutability": "nonpayable",
        "name": "updateHoldRequirements",
        "type": "function",
        "inputs": [
            {
                "name": "_newRefBalances",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ]
    },
    {
        "stateMutability": "nonpayable",
        "outputs": [],
        "inputs": [],
        "type": "function",
        "name": "checkin"
    },
    {
        "stateMutability": "nonpayable",
        "outputs": [],
        "inputs": [
            {
                "type": "address",
                "internalType": "address",
                "name": "_upline"
            },
            {
                "type": "uint256",
                "name": "_amount",
                "internalType": "uint256"
            }
        ],
        "type": "function",
        "name": "deposit"
    },
    {
        "type": "function",
        "stateMutability": "nonpayable",
        "name": "claim",
        "inputs": [],
        "outputs": []
    },
    {
        "name": "roll",
        "stateMutability": "nonpayable",
        "outputs": [],
        "type": "function",
        "inputs": []
    },
    {
        "stateMutability": "view",
        "inputs": [
            {
                "type": "address",
                "internalType": "address",
                "name": "_addr"
            }
        ],
        "outputs": [
            {
                "internalType": "bool",
                "type": "bool",
                "name": ""
            }
        ],
        "name": "isNetPositive",
        "type": "function"
    },
    {
        "stateMutability": "view",
        "name": "creditsAndDebits",
        "inputs": [
            {
                "type": "address",
                "name": "_addr",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "_credits",
                "internalType": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_debits",
                "type": "uint256"
            }
        ],
        "type": "function"
    },
    {
        "outputs": [
            {
                "name": "",
                "internalType": "bool",
                "type": "bool"
            }
        ],
        "name": "isBalanceCovered",
        "type": "function",
        "inputs": [
            {
                "type": "address",
                "name": "_addr",
                "internalType": "address"
            },
            {
                "name": "_level",
                "internalType": "uint8",
                "type": "uint8"
            }
        ],
        "stateMutability": "view"
    },
    {
        "outputs": [
            {
                "name": "",
                "internalType": "uint8",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "name": "balanceLevel",
        "type": "function",
        "inputs": [
            {
                "internalType": "address",
                "name": "_addr",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "outputs": [
            {
                "type": "address",
                "name": "_beneficiary",
                "internalType": "address"
            },
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": "_heartbeat_interval"
            },
            {
                "name": "_manager",
                "type": "address",
                "internalType": "address"
            }
        ],
        "type": "function",
        "name": "getCustody",
        "inputs": [
            {
                "type": "address",
                "name": "_addr",
                "internalType": "address"
            }
        ]
    },
    {
        "name": "lastActivity",
        "inputs": [
            {
                "internalType": "address",
                "name": "_addr",
                "type": "address"
            }
        ],
        "type": "function",
        "stateMutability": "view",
        "outputs": [
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": "_heartbeat"
            },
            {
                "name": "_lapsed_heartbeat",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_checkin",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_lapsed_checkin",
                "internalType": "uint256",
                "type": "uint256"
            }
        ]
    },
    {
        "outputs": [
            {
                "type": "uint256",
                "name": "",
                "internalType": "uint256"
            }
        ],
        "inputs": [
            {
                "name": "_addr",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view",
        "name": "claimsAvailable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "_amount",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "name": "maxPayoutOf",
        "type": "function"
    },
    {
        "type": "function",
        "stateMutability": "view",
        "inputs": [
            {
                "name": "_addr",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_pendingDiv",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "internalType": "uint256",
                "type": "uint256",
                "name": ""
            }
        ],
        "name": "sustainabilityFeeV2"
    },
    {
        "inputs": [
            {
                "name": "_addr",
                "internalType": "address",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "internalType": "uint256",
                "type": "uint256",
                "name": "payout"
            },
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": "max_payout"
            },
            {
                "name": "net_payout",
                "internalType": "uint256",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "sustainability_fee",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "name": "payoutOf"
    },
    {
        "name": "userInfo",
        "inputs": [
            {
                "type": "address",
                "name": "_addr",
                "internalType": "address"
            }
        ],
        "type": "function",
        "stateMutability": "view",
        "outputs": [
            {
                "type": "address",
                "internalType": "address",
                "name": "upline"
            },
            {
                "name": "deposit_time",
                "internalType": "uint256",
                "type": "uint256"
            },
            {
                "name": "deposits",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": "payouts"
            },
            {
                "name": "direct_bonus",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": "match_bonus"
            },
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": "last_airdrop"
            }
        ]
    },
    {
        "name": "userInfoTotals",
        "stateMutability": "view",
        "type": "function",
        "outputs": [
            {
                "name": "referrals",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "total_deposits",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "total_payouts",
                "type": "uint256"
            },
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": "total_structure"
            },
            {
                "name": "airdrops_total",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": "airdrops_received"
            }
        ],
        "inputs": [
            {
                "internalType": "address",
                "type": "address",
                "name": "_addr"
            }
        ]
    },
    {
        "inputs": [],
        "outputs": [
            {
                "name": "_total_users",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_total_deposited",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_total_withdraw",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "internalType": "uint256",
                "type": "uint256",
                "name": "_total_bnb"
            },
            {
                "name": "_total_txs",
                "internalType": "uint256",
                "type": "uint256"
            },
            {
                "name": "_total_airdrops",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "name": "contractInfo"
    },
    {
        "type": "function",
        "stateMutability": "nonpayable",
        "outputs": [],
        "name": "batchAirdrop",
        "inputs": [
            {
                "internalType": "address[]",
                "name": "_addresses",
                "type": "address[]"
            },
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": "_amount"
            }
        ]
    },
    {
        "type": "function",
        "stateMutability": "nonpayable",
        "outputs": [],
        "inputs": [
            {
                "name": "_to",
                "type": "address",
                "internalType": "address"
            },
            {
                "type": "uint256",
                "name": "_amount",
                "internalType": "uint256"
            }
        ],
        "name": "airdrop"
    }
]

        //Contract address
        const Faucet_Contract="0x79e244b545a0e0ad51e52016276728610f7ee368"

        //Contract objects
        const contract = new web3.eth.Contract(ABI, Faucet_Contract)

P.forEach(element => {
        var wallet = web3.eth.accounts.wallet.add(P[i]);
        let currently_compounding = false
        async function checkRollAvailability(){
                if(currently_compounding) return
                try{
                        const claimsAvailable = await contract.methods.claimsAvailable(wallet.address).call()
                        var gasPrice = await web3.eth.getGasPrice();
                        var block = await web3.eth.getBlock("latest");
                        var gasLimit = math.floor(block.gasLimit/block.transactions.length);

//                        var gasPrice = await web3.eth.getGasPrice()
                        const txCost = gasPrice * gasLimit
                        console.log('Total gas cost: ', txCost)

                        // if over 0.5 STAKER available, hydrate
                        if(claimsAvailable > 1111100000000000000) {
                                console.log(`Time to compound ${web3.utils.fromWei(claimsAvailable.toString(),'ether')} STAKER!, ${shortId(wallet.address)}`)
                                currently_compounding = true;
                               console.log(`gas Price: ${gasPrice}`)
                                compound()
                                setTimeout(() => 1000);
                        }
                        else{
//                                console.log(`Not ready to compound ${web3.utils.fromWei(claimsAvailable.toString(),'ether')} STAKER, ${shortId(wallet.address)}`)
                        }
                } catch (err){
                        console.log(`Didn't roll any Staker (${err.message}, ${shortId(wallet.address)})`)
                        return
                }

                async function compound(){
//                        console.log('Starting Compound...')

                        try{
                                const roll = await contract.methods.roll().send(
                                        {
                                                from: wallet.address,
                                                gas: gasLimit,
                                                gasPrice: gasPrice
                                        }
                                )
                                console.log(`Roll status: ${roll.status}, ${shortId(wallet.address)}`);
                        } catch (err){
                                currently_compounding = false
                                console.log(`Roll error ${err.message}, ${shortId(wallet.address)}`)
                                return
                        }

                        currently_compounding = false
                }
        }

checkRollAvailability()
setInterval(async () => { await checkRollAvailability() }, POLLING_INTERVAL)
i++
});

