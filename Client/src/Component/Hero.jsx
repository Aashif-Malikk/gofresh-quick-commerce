import { ArrowRight, ArrowRight3, Clock, FlashCircle, Ticket, Tree } from 'iconsax-react'
import React from 'react'

function Hero() {
    return (
        <div style={{ backgroundImage: 'url(./GoFresh_heroImage_chatgpt.png)', backgroundSize: '100% 100%' }} className='sm:h-110 h-43 w-full sm:w-full flex align-middle justify-between overflow-hidden rounded-2xl'>
            <div className="flex flex-col h-full justify-center ps-3 sm:ps-10">
                <h1 className='font-bold sm:text-5xl sm:mb-4 text-2xl'>Save More On <br /><span className='text-green-700'>EveryDay Essentials</span></h1>
                <p className='sm:mb-4 sm:text-lg text-sm mb-1'>Fresh product at lower price,<br />delivered in<span className='text-green-700'>15 minutes</span></p>
                <button className='cursor-pointer inline-flex sm:w-full sm:max-w-55 w-fit items-center justify-between sm:gap-3 gap-1 rounded-2xl bg-emerald-600 sm:px-4 sm:py-3 py-1 p-3 text-left text-sm font-medium text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 motion-safe:focus:ring-offset-2 sm:text-base'>
                    Shop Now
                    <ArrowRight color='white' variant='Linear' size={25} />
                </button>
            </div>
            <div className='sm:flex hidden flex-col h-full pt-10 pe-10'>
                <div className='border-2 border-slate-200 bg-white rounded-2xl flex flex-col p-4'>
                    <div style={{alignItems:'center'}} className='flex place-content-center gap-10 border-b-2 border-slate-300 pb-3'>
                        <h3 className='text-black'>Delivery in <br /><span className='font-bold text-lg'>15 mins</span></h3>
                        <FlashCircle color='gold' variant='Bold' size={40} />
                    </div>
                    <div className='pt-3 flex justify-evenly place-content-center gap-2'>
                        <div style={{alignItems:'center'}} className='flex flex-col'>
                            <Ticket className='' variant='Linear' size={25} color='green'/>
                            <p className='text-sm'>Best Price</p>
                        </div>
                        <div style={{alignItems:'center'}} className='flex flex-col'>
                            <Tree className='' variant='Linear' size={25} color='green'/>
                            <p className='text-sm'>Fresh Quality</p>
                        </div>
                        <div style={{alignItems:'center'}} className='flex flex-col'>
                            <Clock className='' variant='Linear' size={25} color='green'/>
                            <p className='text-sm'>On Time</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero
