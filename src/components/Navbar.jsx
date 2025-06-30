import React from 'react'

const Navbar = () => {
    return (
        <nav className='bg-slate-800 text-white flex'>
            <div className="mycontainer flex justify-between items-center px-4 py-5 h-14 max-w-4xl ">

                <div className="logo font-bold text-white text-2xl">
                    <span className='text-green-500'>&lt;</span>
                    Pass<span className='text-green-500'>OP/&gt;</span>
                </div>
                <button className='flex items-center gap-2 px-3 py-3 mx-5 rounded-md bg-gray-800 my-2 cursor-pointer hover:bg-gray-700'>
                    <img className='invert w-6' src="/icons/github.svg" alt="" />
                    <span>GitHub</span>
                </button>
                
            </div>
        </nav>
    )
}

export default Navbar
