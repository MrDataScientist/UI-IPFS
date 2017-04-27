import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3'
import _ from 'lodash'
import { Navbar, Jumbotron, Button } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

var ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://104.236.58.158:8545"))
var peopleContractABI = [{"constant":true,"inputs":[],"name":"getPeople","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"uint256[]"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_firstName","type":"bytes32"},{"name":"_lastName","type":"bytes32"},{"name":"_age","type":"uint256"}],"name":"addPerson","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"people","outputs":[{"name":"firstName","type":"bytes32"},{"name":"lastName","type":"bytes32"},{"name":"age","type":"uint256"}],"payable":false,"type":"function"}]

var reviewContractABI = [{"constant":false,"inputs":[{"name":"_companyName","type":"bytes32"},{"name":"_companyReviewer","type":"bytes32"},{"name":"_companyReview","type":"uint256"}],"name":"addReview","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getReviews","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"uint256[]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"reviews","outputs":[{"name":"companyName","type":"bytes32"},{"name":"companyReviewer","type":"bytes32"},{"name":"companyReview","type":"uint256"}],"payable":false,"type":"function"}]

//var UserMessage = '';


//var peopleContractAddress = '0xe2c7e8440f5089011951cb6114c31522ba524638'
var peopleContractAddress = '0xc9a79464fffab1bd9f355a472b3e255f61a68cec'

var reviewContractAddress = '0x993374073fea30f0e354b15bcf95419bf4b84c6a'
// 0x993374073fea30f0e354b15bcf95419bf4b84c6a

var peopleContract = ETHEREUM_CLIENT.eth.contract(peopleContractABI).at(peopleContractAddress)
var reviewContract = ETHEREUM_CLIENT.eth.contract(reviewContractABI).at(reviewContractAddress)
ETHEREUM_CLIENT.eth.defaultAccount = ETHEREUM_CLIENT.eth.coinbase;


//var MyContract = Web3.eth.contract(ABI);
//var myContractInstance = MyContract.at('0x78e97bcc5b5dd9ed228fed7a4887c0d7287344a9');

var peopleEvents = peopleContract.allEvents({fromBlock: 0,toBlock: 'latest'})
var reviewEvents = reviewContract.allEvents({fromBlock: 0,toBlock: 'latest'})


peopleEvents.watch(function (error, results) {
  console.log("zillerium events")
  console.log(results)
})

function ListItem(props) {
  return (
    <li onClick={props.onClick}>
      {props.item}
    </li>
  );
}
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstNames: [],
      lastNames: [],
      ages: [],
      companyNames: ['test'],
      companyReviewers: ['trevor'],
      companyReviews: [0],
       list: ['unicycle', 'juggling clubs', 'stilts'],
       UserMessage:[]

    }
  }

handleThumbsUp() {
  var companyName = document.getElementById("CompanyNameInput").value;
  document.getElementById("CompanyNameInput").value = "";

  var Reviewer = document.getElementById("ReviewerName").value;
  document.getElementById("ReviewerName").value = "";

  var allCompanyNames = this.state.companyNames.slice();
  allCompanyNames.push(companyName);
  this.setState({companyNames: allCompanyNames});

  var allCompanyReviewers = this.state.companyReviewers.slice();
  allCompanyReviewers.push(Reviewer);
  this.setState({companyReviewers:allCompanyReviewers})

  var allCompanyReviews = this.state.companyReviews.slice();
  allCompanyReviews.push(1);
  this.setState({companyReviews:allCompanyReviews})

  reviewContract.addReview(companyName, Reviewer, 1)
  var aMessage = this.state.UserMessage.slice();
    aMessage.push('Your review will be added in a few minutes to the blockchain - please refresh then')
  this.setState({UserMessage:aMessage});
 var a=1;
}

handleThumbsDown() {
  var companyName = document.getElementById("CompanyNameInput").value;
  document.getElementById("CompanyNameInput").value = "";

  var Reviewer = document.getElementById("ReviewerName").value;
  document.getElementById("ReviewerName").value = "";


  var allCompanyNames = this.state.companyNames.slice();
  allCompanyNames.push(companyName);
  this.setState({companyNames: allCompanyNames});

  var allCompanyReviewers = this.state.companyReviewers.slice();
  allCompanyReviewers.push(Reviewer);
  this.setState({companyReviewers:allCompanyReviewers})

  var allCompanyReviews = this.state.companyReviews.slice();
  allCompanyReviews.push(0);
  this.setState({companyReviews:allCompanyReviews})

  reviewContract.addReview(companyName, Reviewer, 0)

  var companyName1 = document.getElementById("CompanyNameInput").value;
  var aMessage = this.state.UserMessage.slice();
    aMessage.push('Your review will be added in a few minutes to the blockchain - please refresh then')
  this.setState({UserMessage:aMessage});
  //reviewContract.addReview("company12", "trevor lee oakley", 1)
}


  addItem() {
    var item = document.getElementById("CompanyNameInput").value;
    document.getElementById("CompanyNameInput").value = "";
    var newList = this.state.list.slice();
    newList.push(item);
    this.setState({list: newList});
  }

  onClick(index) {
    var newList = this.state.list.slice();
    newList.splice(index, 1);
    this.setState({list: newList});
  }
CompanyNameInput
  componentWillMount() {
    console.log(ETHEREUM_CLIENT)
    console.log(peopleContract.getPeople())

    var data = peopleContract.getPeople()
    var reviewData = reviewContract.getReviews()

  //  reviewContract.addReview("company1", "trevor lee oakley", 1)

    this.setState({
      firstNames: String(data[0]).split(','),
      lastNames: String(data[1]).split(','),
      ages: String(data[2]).split(','),

      companyNames: String(reviewData[0]).split(','),
      companyReviewers: String(reviewData[1]).split(','),
      companyReviews: String(reviewData[2]).split(',')


    })
  }
  render() {
    var listItems = [];
    this.state.companyNames.forEach((item, i) => {
      listItems.push(<ListItem item={item} onClick={() => this.onClick(i)} />)
    });


    var listItems2 = [];
    this.state.list.forEach((item, i) => {
      listItems2.push(<ListItem item={item} onClick={() => this.onClick(i)} />)
    });
var ShowMessage = [];
    this.state.UserMessage.forEach((item, i) => {
        ShowMessage.push(<p className = "jenbil-warn">{item}</p>);
    });





    var companyList =[];

    var TableRows = []
    _.each(this.state.firstNames, (valucompanyNamese, index) => {
      TableRows.push(
        <tr>
        <td>{ETHEREUM_CLIENT.toAscii(this.state.firstNames[index])}</td>
        <td>{ETHEREUM_CLIENT.toAscii(this.state.lastNames[index])}</td>
        <td>{this.state.ages[index]}</td>
        </tr>
      )
    })

    var products =[];
    for (var i = 0; i < this.state.companyNames.length; i++) {
      var aCompanyName = ETHEREUM_CLIENT.toAscii(this.state.companyNames[i])
      var aCompanyReviewer = ETHEREUM_CLIENT.toAscii(this.state.companyReviewers[i])
      var aCompanyReview = this.state.companyReviews[i]
         products.push({ 'companyindex': i, 'companyname': aCompanyName, 'companyreviewer': aCompanyReviewer, 'companyreview': aCompanyReview });
       }
products.reverse();
       var tableHtml =
    <BootstrapTable data={products} striped={true} hover={true}>
        <TableHeaderColumn dataField="companyindex" isKey={true} dataAlign="center" dataSort={true}>Review ID</TableHeaderColumn>
          <TableHeaderColumn dataField="companyname"  dataAlign="center" dataSort={true}>Company Name</TableHeaderColumn>
          <TableHeaderColumn dataField="companyreviewer" >Reviewer</TableHeaderColumn>
          <TableHeaderColumn dataField="companyreview" >Review</TableHeaderColumn>
      </BootstrapTable>

    var CompanyReviews = []
    _.each(this.state.companyNames, (value, index) => {
      CompanyReviews.push(
        <tr>
        <td>{ETHEREUM_CLIENT.toAscii(this.state.companyNames[index])}</td>
        <td>{ETHEREUM_CLIENT.toAscii(this.state.companyReviewers[index])}</td>
        <td>{this.state.companyReviews[index]}</td>
        </tr>




      )
    })

    return (
      <div className="App">
        <div className="App-header">

          <h2>Zillerium Demo (Reviews on the blockchain)</h2>

        </div>
  <div  className="App-Content">

  <input
       type="text"
       id="CompanyNameInput"
       placeholder="Company Name"

       name="filtertext"
   />
   <input
        type="text"
        id="ReviewerName"
        placeholder="Your Name"

        name="filtertext"
    />
           <button type="button" className="btn btn-link" onClick={() => this.handleThumbsUp()}><span className="glyphicon glyphicon-thumbs-up"></span></button>
           <button type="button" className="btn btn-link" onClick={() => this.handleThumbsDown()}><span className="glyphicon glyphicon-thumbs-down"></span></button>
{ShowMessage}
<div>

</div>

        <p className="App-intro">
          Add your review to the blockchain. It takes a few minutes to update the blockchain according to the mining.

        </p>





{tableHtml}






        </div>

      </div>
    );
  }
}

export default App;
