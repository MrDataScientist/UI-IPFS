import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3'
import _ from 'lodash'
import { Navbar, Jumbotron, Button } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import IpfsAPI from 'ipfs-api'
//const IpfsAPI = require('ipfs-api')

//var ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://104.236.58.158:8545"))

var ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://104.236.58.158:8545"))

var ipfsContractABI = [{"constant":true,"inputs":[],"name":"getIpfsData","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_addr1","type":"bytes32"},{"name":"_addr2","type":"bytes32"}],"name":"addIpfs","outputs":[{"name":"success","type":"bool"}],"payable":true,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"ipfsrecs","outputs":[{"name":"addr1","type":"bytes32"},{"name":"addr2","type":"bytes32"}],"payable":false,"type":"function"}]

var ipfsContractAddress = '0x8d3e374e9dfcf7062fe8fc5bd5476b939a99b3ed'

// 0x993374073fea30f0e354b15bcf95419bf4b84c6a

var ipfsContract = ETHEREUM_CLIENT.eth.contract(ipfsContractABI).at(ipfsContractAddress)

ETHEREUM_CLIENT.eth.defaultAccount = ETHEREUM_CLIENT.eth.coinbase;

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
        ipfsStateText: [],
        ipfsStateAddress: []

    }
   //  this.IpfsAPI = IpfsAPI('jenbil.com', '5001', {protocol: 'http', progress: 'false'})
//this.ipfsHost = new IpfsAPI({ host: 'jenbil.com', protocol: 'http', port: '5001', 'progress': false });

    this.IpfsAPI = IpfsAPI('ipfs.io', '', {protocol: 'http', progress: 'false'})
    this.ipfsHost= new IpfsAPI({ host: 'ipfs.io', protocol: 'http', port: '', 'progress': false });
  }

  componentWillMount() {
    console.log(ETHEREUM_CLIENT)

    var ipfsBCData = ipfsContract.getIpfsData()
    var ipfs1 = String(ipfsBCData[0]).split(',')
    var ipfs2 =  String(ipfsBCData[1]).split(',')
    var ipfsAddressLocalArray = [];
    for (var i = 0; i < ipfs1.length; i++) {
        var aIPDFDataRecHex = ipfs1[i]
          aIPDFDataRecHex=aIPDFDataRecHex.replace('0x','');
          aIPDFDataRecHex=aIPDFDataRecHex.replace('00','');
          var hex  = aIPDFDataRecHex.toString();
    	     var aIPDFDataRec = '';
    	      for (var n = 0; n < hex.length; n += 2) {
    		        aIPDFDataRec += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    	         }
          var addr1 = aIPDFDataRec;
      aIPDFDataRecHex = ipfs2[i]
      aIPDFDataRecHex=aIPDFDataRecHex.replace('0x','');
      aIPDFDataRecHex=aIPDFDataRecHex.replace(/00/g,'');
      var hex  = aIPDFDataRecHex.toString();
    	var aIPDFDataRec = '';
    	for (var n = 0; n < hex.length; n += 2) {
    		aIPDFDataRec += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    	}
      var addr2 = aIPDFDataRec;
      var fulladdr = addr1 + addr2;

      fulladdr = 'QmU5KhkgvweYgE3Gsr8A19uFQrq7mszx7dubcoo89cTmAV';

        ipfsAddressLocalArray[i]=fulladdr;


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
var ipfsTextLocalArray = [];
var ipfsHostLocal = this.ipfsHost;
var ipfsTextLocalArrayFn = function(ipfsAddressLocalArray, ipfsHostLocal) {
    return new Promise((reject, resolve) => {
        var ipfsTextLocalArray = [];
        for (var i = 0; i < ipfsAddressLocalArray.length; i++) {
         var fulladdr = ipfsAddressLocalArray[i];
         ipfsHostLocal.cat(fulladdr, function(err, stream) {
             var res = ''
             stream.on('data', function (chunk) {
                 res += chunk.toString()
                 ipfsTextLocalArray[i]=res;
             })
             stream.on('error', function (err) {
                 console.error('Oh nooo', err);
                 reject(err);
             })
             stream.on('end', function () {
                 console.log('Got:', res)
                 resolve(ipfsTextLocalArray);
            })
          });
        }
    });
}

       ipfsTextLocalArrayFn(ipfsAddressLocalArray, ipfsHostLocal)
       .then((response)=>{
           console.log('the reponse with ipfsTextLocalArray', response);
       })
       .catch((err)=>{
           console.log('err', err);
       });

  //  reviewContract.addReview("company1", "trevor lee oakley", 1)

    this.setState({
 //  ipfsAddr1: String(ipfsBCData[0]).split(','),
  //    ipfsAddr2: String(ipfsBCData[1]).split(',')
      ipfsStateText: String(ipfsTextLocalArray[0]).split(','),
      ipfsStateAddress:  String(ipfsAddressLocalArray[0]).split(',')
    })
  }
  render() {
    var TableRows = []
    var products =[];
    for (var i = 0; i < this.state.ipfsStateAddress.length; i++) {
        products.push({ 'reviewIndex': i, 'ipfsAddr': this.state.ipfsStateAddress[i], 'ipfsText': this.state.ipfsStateText[i]  });
     }

       // curl "http://127.0.0.1:5001/api/v0/object/get?arg=QmU5KhkgvweYgE3Gsr8A19uFQrq7mszx7dubcoo89cTmAV
     const multihashStr = 'QmU5KhkgvweYgE3Gsr8A19uFQrq7mszx7dubcoo89cTmAV' // here just once
     this.ipfsHost.cat(multihashStr, function(err, stream) {
         var res = ''
         stream.on('data', function (chunk) {
            res += chunk.toString()
         })
        stream.on('error', function (err) {
            console.error('Oh nooo', err)
        })
        stream.on('end', function () {
            console.log('Got:', res)
        })
      });

products.reverse();
       var tableHtml =
    <BootstrapTable data={products} striped={true} hover={true}>
        <TableHeaderColumn dataField="reviewIndex" isKey={true} dataAlign="center" dataSort={true}>Review ID</TableHeaderColumn>
          <TableHeaderColumn dataField="ipfsAddr"  dataAlign="center" dataSort={true}>Ipfs Address</TableHeaderColumn>
          <TableHeaderColumn dataField="ipfsText"  dataAlign="center" dataSort={true}>Ipfs Text</TableHeaderColumn>

       </BootstrapTable>




    return (
      <div>
         <p className="App-intro">
            Add your review to ISPF and the Blockchain. It takes a few minutes to update the blockchain according to the mining.
          </p>
        {tableHtml}
      </div>
    );
  }
}

export default App;
