import React, {useState,useEffect}from 'react';

import {useStateContext} from '../context';

import{DisplayCampaigns} from '../components';

const Profile = () => {
  const [isLoading,setIsLoading]=useState(false);
  const[campaigns,setCampaigns]=useState([]);//use it from smart contracts.

  const{address, contract, getUserCampaigns}=useStateContext();

  const fetchCampaigns=async()=>{
    setIsLoading(true);
    const data=await getUserCampaigns();
    setCampaigns(data);//update sc.
    setIsLoading(false);
  }

  useEffect(() => {
    // getCampaigns();--todo since async fun is need and cant be implemented in useEffect
    if(contract)fetchCampaigns();
  }, [address,contract]);
  
  return (
    <DisplayCampaigns
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  )
}

export default Profile