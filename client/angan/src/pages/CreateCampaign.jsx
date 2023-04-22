import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {ethers} from 'ethers';

import{createCampaign, money} from '../assets';
import { CustomButton,Loader } from '../components';
import {checkIfImage} from '../utils';
import {FormField} from '../components';

import { useStateContext } from '../context';



const CreateCampaign = () => {
  const navigate=useNavigate();
  const[isLoading, setIsLoading]=useState(false);
  const {createCampaign}=useStateContext();//to share data.
  //one context for application and using statecontextprovider sharing to entire application.
  const [form, setForm] = useState({
    name:'',
    title:'',
    description:'',
    target:'',
    deadline:'',
    image:''
  });
  const handleFormFieldChange=(fieldName,e)=>{
    setForm({...form,[fieldName]: e.target.value})
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();//stops reloading the page after submission.
    //util fun checks on image.
    checkIfImage(form.image, async (exists)=>{//async bc sc calls take time
      //does this image returns a callback does it exists.
      if(exists){
        setIsLoading(true)
        await createCampaign({...form, target:ethers.utils.parseUnits(form.target, 18)})//in form of 18th of eth. subunit of eth. change target.
        setIsLoading(false);
        navigate('/');
      }else{
        alert('Provide valid image URL')
        setForm({...form, image:''});
      }
    })
    
    //console.log(form);//we need to call a function.
  }

  return (
    <div className='bg-[#1c1c24] flex justify-center flex-col items-center rounded-[10px] sm:p-10 p-4'>
      {isLoading && <Loader/>}

      <div className='flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]'>
        <h1 className='font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white'
        >Start a Campaign</h1>
      </div>
      <form onSubmit={handleSubmit} className='w-full mt-[65px] flex flex-col gap-[30px]'>
      <div className='flex flex-wrap gap-[40px]'>
        <FormField
          labelText="Your Name *"
          placeholder="Gaurav Jha"
          inputType="text"
          value={form.name}
          handleChange={(e)=>{handleFormFieldChange
            ('name', e)}}
          
        />
        <FormField
          labelText="Campaign Title *"
          placeholder="create a title"
          inputType="text"
          value={form.title}
          handleChange={(e)=>{handleFormFieldChange
            ('title', e)}}

        />
      </div>
      <FormField
          labelText="Story *"
          placeholder="write your story"
          isTextArea
          value={form.description}
          handleChange={(e)=>{handleFormFieldChange
            ('description', e)}}

        />
      <div className='w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]'>
        <img src={money} alt="money" className='w-[40px] h-[40px] object-contain'/>
        <h4 className='font-epilogue font-bold text-[25px] text -white ml-[20px]'>
          You will get 100% of the raised amount
          </h4>
        
      </div>
      <div>
        <FormField
          labelText="GOAL *"
          placeholder="ETH 0.60"
          inputType="text"
          value={form.target}
          handleChange={(e)=>{handleFormFieldChange
            ('target', e)}}
          
        />
        <FormField
          labelText="END DATE *"
          placeholder="End Date"
          inputType="date"
          value={form.deadline}
          handleChange={(e)=>{handleFormFieldChange
            ('deadline', e)}}

        />
        </div>
        <FormField
          labelText="Place image URL for your campaign"
          placeholder="url"
          inputType="url"
          value={form.image}
          handleChange={(e)=>{handleFormFieldChange
          ('image', e)}}

        />
        <div className='flex justify-center items-center mt-[40px]'>
          <CustomButton
            btnType="submit"
            title="submit new Campaign"
            styles="bg-[#1dc071]"
          />
        <div>

        </div>
      </div>
      </form>
    </div>
  )
}

export default CreateCampaign
