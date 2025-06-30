import React from 'react'

const Footer = () => {
    return (
        <footer className='bg-slate-800 flex w-full flex-col justify-center items-center text-sm gap-1 py-3 fixed bottom-0 h-15'>
            <div className="logo font-bold text-white text-2xl">
                <span className='text-green-500'>&lt;</span>
                Pass<span className='text-green-500'>OP/&gt;</span>
            </div>
            <div className='flex text-white justify-center items-center'>
                Created with <img className='mx-1 w-4' src="/icons/heart.png" alt="" /> by Izhar
            </div>
        </footer>
    )
}

export default Footer
