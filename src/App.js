import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3'
import _ from 'lodash'
import {Navbar, Jumbotron, Button} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import IpfsAPI from 'ipfs-api'
//const IpfsAPI = require('ipfs-api')

//var ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://104.236.58.158:8545"))

var ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://104.236.58.158:8545"))

var ipfsContractABI =
[
  {
    "constant": true,
    "inputs": [],
    "name": "getIpfsData",
    "outputs": [
      {
        "name": "",
        "type": "bytes32[]"
      },
      {
        "name": "",
        "type": "bytes32[]"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_addr1",
        "type": "bytes32"
      },
      {
        "name": "_addr2",
        "type": "bytes32"
      }
    ],
    "name": "addIpfs",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": true,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "ipfsrecs",
    "outputs": [
      {
        "name": "addr1",
        "type": "bytes32"
      },
      {
        "name": "addr2",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "type": "function"
  }
]


var ipfsContractAddress = '0x8d3e374e9dfcf7062fe8fc5bd5476b939a99b3ed'

// 0x993374073fea30f0e354b15bcf95419bf4b84c6a

var ipfsContract = ETHEREUM_CLIENT.eth.contract(ipfsContractABI).at(ipfsContractAddress)

ETHEREUM_CLIENT.eth.defaultAccount = ETHEREUM_CLIENT.eth.coinbase;

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ipfsStateText: [],
            UserMessage:[],
            ipfsStateAddress: [],
            products: []
        };
        //  this.IpfsAPI = IpfsAPI('jenbil.com', '5001', {protocol: 'http', progress: 'false'})
//this.ipfsHost = new IpfsAPI({ host: 'jenbil.com', protocol: 'http', port: '5001', 'progress': false });


//this.IpfsAPI = IpfsAPI('127.0.0.1', '5001');

this.IpfsAPI = IpfsAPI({host: 'localhost', port: '5001', protocol: 'http'})

//this.ipfsHost1 = new IpfsAPI({host: '127.0.0.1', protocol: 'http', port: '5001', 'progress': false});
//        this.IpfsAPI = IpfsAPI('127.0.0.1', '', {protocol: 'http', progress: 'false'})
        this.ipfsHost = new IpfsAPI({host: 'ipfs.io', protocol: 'http', port: '', 'progress': false});
    }

addIPFSContent() {
  var zstr = document.getElementById("NewIPFSContent").value;
  document.getElementById("NewIPFSContent").value = "";

      this.IpfsAPI.add(new Buffer(zstr), function (err, res){
              console.log("hello");
              if(err || !res) return console.error("ipfs add error", err, res);
              else{
//                console.log("no issue"ipfsAdd);
//                console.log(res);
                res.forEach(function(text) {
                       console.log('successfully stored', text.hash);
                     //  console.log('successfully stored', text.path);
                     //  display(file.Hash);
                        var textaddress=text.hash;
                        console.log(textaddress);
                });
              }
            });
}

    addIPFSContent1() {
      var IPFSContent = document.getElementById("NewIPFSContent").value;
      document.getElementById("NewIPFSContent").value = "";

      this.IpfsAPI.add([new Buffer(IPFSContent)]).then((res) => {
    // do something with res
        console.log(res);

       var ipfsId = res[0].hash;
        console(ipfsId);
      }).catch((err) => { console.log("error in api call ") })

    }

    addAddress() {
      var IPFSAddress = document.getElementById("NewIPFSAddress").value;
      document.getElementById("NewIPFSAddress").value = "";
var IPFS1 = "";
var IPFS2 = "";
var err = 0;
if (IPFSAddress.length>31) {
  if (IPFSAddress.length>63) {
    var aMessage = this.state.UserMessage.slice();
      aMessage.push('Error - string too long - max is 32 chars')
    this.setState({UserMessage:aMessage});
    var err =1;
  }
  else {
    IPFS1 = IPFSAddress.substring(0,32);
    IPFS2 = IPFSAddress.substring(32,IPFSAddress.length);

  }
} else {
  IPFS2 = "";
}
if (err==0) {
  ipfsContract.addIpfs(IPFS1, IPFS2);

  var aMessage = this.state.UserMessage.slice();
    aMessage.push('Your IPFS ADDRESS will be added in a few minutes to the blockchain - please refresh then')
  this.setState({UserMessage:aMessage});
}



      //reviewContract.addReview("company12", "trevor lee oakley", 1)
    }



    componentWillMount() {
        console.log(ETHEREUM_CLIENT)

        var ipfsBCData = ipfsContract.getIpfsData()
        var ipfs1 = String(ipfsBCData[0]).split(',')
        var ipfs2 = String(ipfsBCData[1]).split(',')
        var ipfsAddressLocalArray = [];
        for (var i = 0; i < ipfs1.length; i++) {
            var aIPDFDataRecHex = ipfs1[i]
            aIPDFDataRecHex = aIPDFDataRecHex.replace('0x', '');
            aIPDFDataRecHex = aIPDFDataRecHex.replace('00', '');
            var hex = aIPDFDataRecHex.toString();
            var aIPDFDataRec = '';
            for (var n = 0; n < hex.length; n += 2) {
                aIPDFDataRec += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
            }
            var addr1 = aIPDFDataRec;
            aIPDFDataRecHex = ipfs2[i]
            aIPDFDataRecHex = aIPDFDataRecHex.replace('0x', '');
            aIPDFDataRecHex = aIPDFDataRecHex.replace(/00/g, '');
            var hex = aIPDFDataRecHex.toString();
            var aIPDFDataRec = '';
            for (var n = 0; n < hex.length; n += 2) {
                aIPDFDataRec += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
            }
            var addr2 = aIPDFDataRec;

// fix - bad data in blockchain which causes IPFS cat call to fail - there is not sufficient error handling in that call

            var fulladdr = addr1 + addr2;

            var errStr1 = "QmWcsZXZJ1hmTS8uXqCriUFCreaNjd5skk9qXAgFFpCaEE";
            var errStr2 =  "QmXde1ZURUdBRLhpoAxXz2KzXSqdonDmib8jbBD2bkoSyu";
            var errStr3 = "QmeAfcM5esSxEU3PDdzS3MZXbvPWYdCy546Typk95is9";

            var errStr4 = "QmeAfcM5esSxEU3PDdzS3MZXbvPWYdCCy546Typk95is9";

               var n1 = errStr1.localeCompare(fulladdr);
               var n2 = errStr2.localeCompare(fulladdr);
               var n3 = errStr3.localeCompare(fulladdr);
               var n4 = errStr4.localeCompare(fulladdr);
            if ((n1==0) || (n2==0) || (n3==0) || (n4==0)) {
              // no action
            } else {


            //    fulladdr = 'QmU5KhkgvweYgE3Gsr8A19uFQrq7mszx7dubcoo89cTmAV';

                ipfsAddressLocalArray[i] = fulladdr;

            }
            // products.push({ 'reviewIndex': i, 'ipfsAddr': fulladdr });
        }
//var ipfsTextLocalArray = [];
        /* var ipfsTextLocalArray = [];
         for (var i = 0; i < ipfsAddressLocalArray.length; i++) {
         var fulladdr = ipfsAddressLocalArray[i];
         this.ipfsHost.cat(fulladdr, function(err, stream) {
         var res = ''
         stream.on('data', function (chunk) {
         res += chunk.toString()
         ipfsTextLocalArray[i]=res;

         })
         stream.on('error', function (err) {
         console.error('Oh nooo', err)
         })
         stream.on('end', function () {
         console.log('Got:', res)

         })

         });
         }
         */

        var ipfsHostLocal = this.ipfsHost;
        var ipfsTextLocalFn = function (fulladdr, ipfsHostLocal) {
            return new Promise((resolve, reject) => {
                var ipfsTextLocal = '';
                ipfsHostLocal.cat(fulladdr, function (err, stream) {

                    stream.on('data', function (chunk) {
                        ipfsTextLocal += chunk.toString()
                        console.log('found data '+ ipfsTextLocal)
                    })
                    stream.on('error', function (err) {
                        console.error('Oh nooo', err);
                        reject(err);
                    })
                    stream.on('end', function () {
                        console.log('Got:', ipfsTextLocal)
                        resolve({address: fulladdr, ipfsTextLocal: ipfsTextLocal});
                    })
                });


            });
        }
        var _this = this;
        for (var i = 0; i < ipfsAddressLocalArray.length; i++) {
            let fulladdr = ipfsAddressLocalArray[i];
            console.log('processing addr - ' + fulladdr);
            ipfsTextLocalFn(fulladdr, ipfsHostLocal)
                .then((response) => {
                    console.log('the reponse with ipfsTextLocalArray', response);

                    _this.setState({
                        products: _this.state.products.concat({
                            'reviewIndex': _this.state.products.length,
                            'ipfsAddr': response.address,
                            'ipfsText': response.ipfsTextLocal

                        })
                    })
                })
                .catch((err) => {
                    console.log('err', err);
                });
        }

        //  reviewContract.addReview("company1", "trevor lee oakley", 1)


    }

    // componentDidMount() {
    //     var productTmp = [];
    //
    //     for (var i = 0; i < this.state.ipfsStateAddress.length; i++) {
    //         productTmp.push({
    //             'reviewIndex': i,
    //             'ipfsAddr': this.state.ipfsStateAddress[i],
    //             'ipfsText': this.state.ipfsStateText[i]
    //         });
    //     }
    //
    //     // curl "http://127.0.0.1:5001/api/v0/object/get?arg=QmU5KhkgvweYgE3Gsr8A19uFQrq7mszx7dubcoo89cTmAV
    //     const multihashStr = 'QmU5KhkgvweYgE3Gsr8A19uFQrq7mszx7dubcoo89cTmAV' // here just once
    //     this.ipfsHost.cat(multihashStr, function (err, stream) {
    //         var res = '';
    //         stream.on('data', function (chunk) {
    //             res += chunk.toString()
    //         })
    //         stream.on('error', function (err) {
    //             console.error('Oh nooo', err)
    //         })
    //         stream.on('end', function () {
    //             console.log('Got:', res)
    //
    //         })
    //     });
    //
    //
    // }

    render() {

      var ShowMessage = [];
          this.state.UserMessage.forEach((item, i) => {
              ShowMessage.push(<p className = "jenbil-warn">{item}</p>);
          });

        return (
            <div>
                <p className="App-intro">
                    This is a demo to add text and read text from IPFS which is referenced by Ethereum.
                </p>
                <input
                     type="text"
                     id="NewIPFSAddress"
                     placeholder="New Address"

                     name="NewAddressName"
                 />
                        <button type="button" className="btn btn-link" onClick={() => this.addAddress()}>Add IPFS Address</button>
                        <input
                             type="text"
                             id="NewIPFSContent"
                             placeholder="New Content"

                             name="NewIPFSContentName"
                         />
                          <button type="button" className="btn btn-link" onClick={() => this.addIPFSContent()}>Add IPFS Content</button>
               {ShowMessage}

                <BootstrapTable data={this.state.products} striped={true} hover={true}>
                    <TableHeaderColumn dataField="reviewIndex" isKey={true} dataAlign="center" dataSort={true}>Review
                        ID</TableHeaderColumn>
                    <TableHeaderColumn dataField="ipfsAddr" dataAlign="center" dataSort={true}>Ipfs
                        Address</TableHeaderColumn>
                    <TableHeaderColumn dataField="ipfsText" dataAlign="center" dataSort={true}>Ipfs
                        Text</TableHeaderColumn>

                </BootstrapTable>
            </div>
        );
    }
}

//added QmeAfcM5esSxEU3PDdzS3MZXbvPWYdCCy546Typk95is9b z1

//QmeAfcM5esSxEU3PDdzS3MZXbvPWYdCCy546Typk95is9b

//QmeAfcM5es SxEU3PDdzS 3MZXbvPWYd CCy546Typk 95is9b
//0123456789 0123456789 0123456789 0123456789 012345
//root@ubuntu-512mb-nyc3-01:~# ipfs add z2
//added QmSXbYEcsWdymeodZqqBNpPZyeEsW1tho1hJmDD59dRxE2 z2
//root@ubuntu-512mb-nyc3-01:~# ipfs add z3
//added QmNMDfPLys9WXzSjbE7Phkh29WLeNVTrdocjQXFFXwvFMu z3
//root@ubuntu-512mb-nyc3-01:~#

//[["0x516d5763735a585a4a31686d5453387558714372695546437265614e6a643573",
//"0x516d586465315a5552556442524c68706f4178587a324b7a585371646f6e446d",
//"0x516d654166634d35657353784555335044647a53334d5a586276505759644300",
//"0x516d654166634d35657353784555335044647a53334d5a586276505759644343",
//"0x516d654166634d35657353784555335044647a53334d5a586276505759644343"],
//["0x6b6b397158416746467043614545000000000000000000000000000000000000",
//"0x6962386a62424432626b6f537975000000000000000000000000000000000000",
//"0x793534365479706b393569733900000000000000000000000000000000000000",
//"0x793534365479706b393569733900000000000000000000000000000000000000",
//"0x793534365479706b393569733962000000000000000000000000000000000000"]]


//



export
default
App;
