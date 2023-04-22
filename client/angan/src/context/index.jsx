//all web3 logic.

import React, {useContext, createContext} from "react";

import {useAddress, useContract, useMetamask, useContractWrite} from '@thirdweb-dev/react';

import {ethers} from 'ethers';

const StateContext =createContext();

//create and export contextprovider
export const StateContextProvider=({children})=>{//regular react component but has children
    //wrap our entire application with contextprovider but still render children

    //now connect to sc
    const{contract}=useContract('0x1f737999a988eeBed3787229c02Fa6Da7B7d8C41');//todo

    const {mutateAsync:createCampaign}=useContractWrite(contract,'createCampaign');//renaming mutateasync
    //this will allow to write by calling createcampaign.
 
    //now address of smartwallet.
    const address = useAddress();
    const connect=useMetamask();

    const publishCampaign=async (form)=>{
        try{
            const data = await createCampaign({
                args: [
                                address,
                                form.title,
                                form.description,
                                form.target,
                                new Date(form.deadline).getTime(),
                                form.image
            
                            ]
            }
                // address,
                // form.title,
                // form.description,
                // form.target.toString(),
                // // ethers.utils.parseUnits(form.target, 18),
                // new Date(form.deadline).getTime(),
                // form.image
            );
              
        //     const data=await createCampaign({
        //         //todo: understand what data will be using for and why have to const for await. SOLVED!!
        //         //in order created in web3 contract.
        //         args: [
        //             address,
        //             form.title,
        //             form.description,
        //             form.target,
        //             new Date(form.deadline).getTime(),
        //             form.image

        //         ]
        // })
            console.log("success contract call!", data);
        }
        catch(error){
            console.log("contract call failure", error);
        }
        
    }

    const getCampaigns = async()=>{
        const campaigns=await contract.call('getCampaigns');
        // console.log(campaigns); 

        // take only required data
        const parsedCampaings = campaigns.map((campaign, i) => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amoutCollected: ethers.utils.formatEther(campaign.amoutCollected.toString()),
            image: campaign.image,
            pId: i
          }));
        // console.log(parsedCampaigns);
        return parsedCampaings;
    }

    const getUserCampaigns= async ()=>{
        const allCampaigns=await getCampaigns();

        const filterdCampaigns=allCampaigns.filter((campaign)=>
            campaign.owner===address
        );
        return filterdCampaigns

    }

    const donate = async(pId, amount)=>{
        const data=await contract.call('donateCampaign',[pId],{value:ethers.utils.parseEther(amount)});//fix

        return data;
    }

    const getDonations = async(pId)=>{
        // console.log(typeof pId);
        const donations=await contract.call('getDonators',[pId]);//fix
        const numberOfDonations=donations[0].length;
        // console.log(numberOfDonations);

        const parsedDonations=[];

        for(let i=0;i<numberOfDonations;i++)
        {
            parsedDonations.push({
                donator:donations[0][i],
                donation:ethers.utils.formatEther(donations[1][i].toString())
            })
        }
        return parsedDonations;
    }
    return (
        <StateContext.Provider
            value={{//value is everything that will be shared across all your components.
                address,//of smart wallet
                contract,
                connect,//will be required in navbar.jsx others also others in cc.jsx file
                createCampaign:publishCampaign,//cC function is used to refer pC.
                // renaming publishCampaign to createCampaign.
                //to get it in createcamp.jsx
                getCampaigns,
                getUserCampaigns,
                donate,
                getDonations

            }}
            >
                {children}
        </StateContext.Provider>
    )
}

export const useStateContext=()=>useContext(StateContext);