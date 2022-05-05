const Web3 = require('web3');

var provider = 'https://kovan.infura.io/v3/9d5f316d001e4dab835816d1f8877918';
var web3Provider = new Web3.providers.HttpProvider(provider);
var web3 = new Web3(web3Provider);

const CONTRACT_ADDRESS = "0x7D3a625977bFD7445466439E60C495bdc2855367";
const CONTRACT_ABI = require('./PingPong.json');
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
let jsoning = require('jsoning');
let db = new jsoning("database.json");
let private_key= process.env.PRIVATE_KEY
console.log(private_key)
async function getEvents() {

        let latest_block = await web3.eth.getBlockNumber();
        let historical_block=null
        if(await db.has("latest_done")){
           historical_block=db.get('latest_done')
        }
        else{
            historical_block = latest_block;
        }
    console.log("latest: ", latest_block, "historical block: ", historical_block);
    const events = await contract.getPastEvents(
        'Ping', // change if your looking for a different event
        { fromBlock: historical_block, toBlock: 'latest' }
    );
    await getTransferDetails(events);
    await db.set('latest_done',latest_block);
    console.log("Latest Block done: ",latest_block)
};

async function getTransferDetails(data_events) {
    for (i = 0; i < data_events.length; i++) {
        console.log("Event:",data_events[i]);

    };
};
const tellTime = async function () {
    console.log(new Date());
}

const minutes = 5;
const interval = minutes * 60 * 1000;

setInterval(function() {
    // catch all the errors.
    getEvents(CONTRACT_ABI, CONTRACT_ADDRESS,db).catch(console.log);
}, interval);


