import {useState, useEffect} from 'react';
import { ethers} from 'ethers';
import './App.css';
import Framezz from './artifacts/contracts/Framezz.sol/Framezz.json';
import PredominantColorImage from "./tools/PredominantColorImage";
import NFTabi from "./artifacts/NFTabi.json";


const framezzAddress = '0xc46e4E6a31Be2fFD6a00c267Dfd607593a9D58Fa'; 


function App() {

  
  const [error, setError] = useState('');
  const [data, setData] = useState({});
  const [frameAddress, setFrameAddress] = useState('')

  useEffect(() => {
    connectWallet();
    fetchData();
    approveNftForAll();
  }, [frameAddress])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchData();
  //     },10*1000);
  //     return () => clearInterval(interval);
  //   }, []);

  async function fetchData() {
    if(typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(framezzAddress, Framezz.abi, provider);
      try {
        const frameInfo = await contract.frameInfo(frameAddress);
        if(frameInfo.nftId.toNumber() === 0) {
          const object = {
            'nftSmartContractAddress': 0,
            'nftId': 0, 
            'currentOwner': 0,
            'lockedTime': 0,
            'uri': "",
            'approvedNft': false
            }
            setData(object);
        }
        else {
          const NFTcontract = new ethers.Contract(frameInfo.nftSmartContractAddress, NFTabi, provider);
          const uriLink = await NFTcontract.tokenURI(frameInfo.nftId);
          const isApproved = await NFTcontract.isApprovedForAll(frameAddress,framezzAddress);

          const uri = await fetchNftData(uriLink);

          const object = {
            'nftSmartContractAddress': frameInfo.nftSmartContractAddress,
            'nftId': frameInfo.nftId, 
            'currentOwner': frameInfo.currentOwner,
            'lockedTime': frameInfo.lockedTime,
            'uri': uri,
            'approvedNft': isApproved
            }
            setData(object);
      }
    }
      catch(err) {
        console.log("ERROR:", err.message);
      }

    
    }
  }

  async function connectWallet(){
    if(typeof window.ethereum !== 'undefined') {
      let account = await window.ethereum.request({method:"eth_requestAccounts"});
      console.log("ACCOUNT:", account);
      setFrameAddress(account[0]);

    }
  }
  async function approveNftForAll(){
    if(typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(data.nftSmartContractAddress, NFTabi, signer);

      try {
        const approve = await contract.setApprovalForAll(framezzAddress,true);
        setData({...data, isApproved: true});
      } catch (error) {
        setError(error.message);
        console.log(error.message);
      }
    }
  }

  async function fetchNftData(nftMetadataUrl) {
    try {
      const response = await fetch(nftMetadataUrl);
      const data = await response.json();
  
      let imageUrl = data.image;
      if (imageUrl.includes("ipfs://")) {
        imageUrl = "https://ipfs.io/ipfs/" + imageUrl.split("ipfs://")[1];
      }
  
      return {
        name: data.name,
        description: data.description,
        imageUrl,
      };
    } catch (error) {
      console.error(error);
    }
  }


  console.log("DATA NFT ID:", data.nftId);
  console.log("DATA URI,", data.uri);

  console.log("DATA APPROVEd:", data.approvedNft);

  return (
    <div className="App">
      
      { data.nftId === 0 || data.nftId === undefined ? ( 
        <div className='container' style={{padding: '400px'}}>
          <div style={{
            fontWeight: 'bold',
            fontSize: '40px',
          }}>
            <p>YOU NEED TO STORE AN NFT TO SEE IT</p>
          </div>
            <p style={{padding: '15px'}}>More info on our website https://Framezz.com/</p>
            <p style={{
              padding: '15px',
              fontWeight: 'bold',
              fontSize: '25px',
              color: 'lightcyan'
            }}
            >Your frameAddress is {frameAddress} </p>
        </div>
      ) : (  
        data.approvedNft ? (
          <PredominantColorImage src={data.uri.imageUrl} />
        )  : ( 
        <div className='container' style={{padding: '400px'}}>
          <div style={{
            fontWeight: 'bold',
            fontSize: '40px',
          }}>
            <p>YOU NEED TO APPROVE THE NFT TO DISLPAY IT</p>
          </div>
            <button onClick={() => approveNftForAll()}>Approve NFT</button>
            
        </div>
      )
      )}   
      </div>
  );
}

export default App;
