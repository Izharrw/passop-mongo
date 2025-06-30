import React, { use } from 'react'
import { useRef, useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';


const Manager = () => {
    const ref = useRef();
    const passwordRef = useRef();
    const [form, setForm] = useState({ site: "", username: "", password: "" });
    const [passwordArray, setPasswordArray] = useState([])

    const getPassword = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json();
        console.log(passwords);
        setPasswordArray(passwords);
    }


    useEffect(() => {
        getPassword();
    }, []);

    const copyText = (text) => {
        toast('Copied to Clipboard!', {
            position: "top-right",
            autoClose: 3500,
            hideProgressBar: false,
            closeOnClick: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        navigator.clipboard.writeText(text)
    }

    const ShowPassword = () => {
        if (ref.current.src.includes("/icons/eye.png")) {
            ref.current.src = "/icons/eyecross.png";
            passwordRef.current.type = "password";
        }
        else {
            ref.current.src = "/icons/eye.png";
            passwordRef.current.type = "text";
        }
    }


    const checkFormSiteExists = async () => {
        // Basic URL validation using regex
        const urlPattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
        const url = form.site.startsWith('http') ? form.site : `https://${form.site}`;
        if (!urlPattern.test(url)) {
            toast.error('Please enter a valid website URL!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return false;
        }
        return true;

    }

    const savePassword = async() => {

        if (form.site === "" || form.username === "" || form.password === "") {
            toast.error('Please fill all fields!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
        else if (passwordArray.some(item => item.site === form.site && item.username === form.username && item.password === form.password)) {
            toast.error('This password already exists!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
        else {
            toast.success('Password saved successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            await fetch("http://localhost:3000/", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id: form.id})
            })
            setPasswordArray([...passwordArray, { ...form, id: uuidv4() }]);
            await fetch("http://localhost:3000/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...form, id: uuidv4() })
            })
            setForm({ site: "", username: "", password: "" });
        }

    }

    const deletePassword = async(id) => {
        let c = window.confirm("Are you sure you want to delete this password?")
        if (c) {
            setPasswordArray(passwordArray.filter((item) => item.id != id));
        }
        let res = await fetch("http://localhost:3000/", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id})
            })
    }
    const editPassword = (id) => {
        setForm({...passwordArray.filter(i => i.id === id)[0], id: id})
        setPasswordArray(passwordArray.filter((item) => item.id != id));
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }


    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                theme="dark"
            />
            <div className="absolute top-0 z-[-2] min-h-screen w-full bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
                <div className="text-white md:mycontainer p-4 px-3 py-15 flex flex-col justify-center items-center gap-3 max-w-full mx-auto">
                    <h1 className='text-4xl font-bold text-center'><span className='text-green-500'>&lt;</span>
                        Pass<span className='text-green-500'>OP/&gt;</span></h1>
                    <p className='text-lg text-emerald-500 text-center'>Your own Password Manager</p>
                    <div className="text-white flex flex-col p-4 gap-8 w-full md:w-1/2">
                        <input value={form.site} onChange={handleChange} placeholder='Enter the Complete URL' className='rounded-full border border-[#4f9f73] focus-within:border-[#4f9f73] p-4 py-1' type="text" name='site' />
                        <div className="flex w-full flex-col md:flex-row justify-between gap-8">
                            <input value={form.username} onChange={handleChange} placeholder='Enter Username' className='rounded-full border md:w-1/2 w-full border-[#4f9f73] focus-within:border-[#4f9f73] p-4 py-1' type="username" name='username' />

                            <div className="relative md:w-1/2 w-full">
                                <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='w-full rounded-full border border-[#4f9f73] focus-within:border-[#4f9f73] p-4 py-1' type="password" name='password' />
                                <span className='absolute right-[4px] top-[4px] cursor-pointer ' onClick={ShowPassword}>
                                    <img ref={ref} className='invert p-1' width={26} src="/icons/eyecross.png" alt="" />
                                </span>
                            </div>
                        </div>
                        <button
                            className='flex items-center justify-center gap-2 bg-[#4f9f73] hover:bg-[#3e7a5c] text-white rounded-full p-4 py-2 mx-auto font-bold w-fit border border-[#4f9f73]'
                            onClick={async () => {
                                const exists = await checkFormSiteExists();
                                if (exists) {
                                    savePassword();
                                }
                            }}
                        >
                            <lord-icon
                                src="https://cdn.lordicon.com/gzqofmcx.json"
                                trigger="hover"
                                colors="primary:#ffffff,">
                            </lord-icon>
                            Save Password
                        </button>
                    </div>


                    <h2 className='font-bold text-xl py-4'>Your Passwords</h2>
                    <div className="relative overflow-y-auto overflow-x-auto shadow-md sm:rounded-lg w-full md:w-1/2">
                        {passwordArray.length === 0 && <div>No Passwords to show</div>}
                        {passwordArray.length != 0 && <table className="w-full mb-3 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr className='items-center'>
                                    <th scope="col" className="px-6 py-3">
                                        Site
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Username
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Password
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='overflow-y-auto max-h-1'>
                                {passwordArray.map((item, index) => (
                                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="icons flex justify-between items-center gap-1 px-10 py-4 md:w-1/3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={() => { copyText(item.site) }}>
                                            <a href={item.site} target='_blank' className='hover:underline'>
                                                {item.site}
                                            </a>
                                            <div className="relative w-3 h-3 cursor-pointer group invert">

                                                <div className="absolute w-3 h-3 border-2 border-gray-800 rounded-sm top-1 left-1 transition-all duration-500 group-hover:-rotate-6 group-hover:scale-105 bg-black"></div>

                                                <div className="absolute w-3 h-3 border-2 border-gray-800 rounded-sm  transition-all duration-500 group-hover:rotate-6 group-hover:scale-105 z-20"></div>

                                            </div>
                                        </th>
                                        <th className="px-6 md:py-4">
                                            <div className='icons flex justify-between items-center gap-1' onClick={() => { copyText(item.username) }}>
                                                {item.username}
                                                <div className="relative w-3 h-3 cursor-pointer group invert">

                                                    <div className="absolute w-3 h-3 border-2 border-gray-800 rounded-sm top-1 left-1 transition-all duration-500 group-hover:-rotate-6 group-hover:scale-105 bg-black"></div>

                                                    <div className="absolute w-3 h-3 border-2 border-gray-800 rounded-sm  transition-all duration-500 group-hover:rotate-6 group-hover:scale-105 z-20"></div>

                                                </div>
                                            </div>
                                        </th>
                                        <td className="px-6 md:py-4">
                                            <div className='icons flex justify-between items-center gap-1' onClick={() => { copyText(item.password) }}>
                                                {item.password}
                                                <div className="relative w-3 h-3 cursor-pointer group invert">

                                                    <div className="absolute w-3 h-3 border-2 border-gray-800 rounded-sm top-1 left-1 transition-all duration-500 group-hover:-rotate-6 group-hover:scale-105 bg-black"></div>

                                                    <div className="absolute w-3 h-3 border-2 border-gray-800 rounded-sm  transition-all duration-500 group-hover:rotate-6 group-hover:scale-105 z-20"></div>

                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 md:py-4 invert flex">
                                            <span onClick={() => { editPassword(item.id) }} className='cursor-pointer mx-1'>
                                                <lord-icon src="https://cdn.lordicon.com/gwlusjdu.json"
                                                    trigger="hover"
                                                    style={{ "width": "20px", "height": "20px" }}></lord-icon>
                                            </span>
                                            <span onClick={() => { deletePassword(item.id) }} className='cursor-pointer mx-1'>
                                                <lord-icon src="https://cdn.lordicon.com/skkahier.json"
                                                    trigger="hover"
                                                    style={{ "width": "20px", "height": "20px" }}></lord-icon>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>}
                    </div>

                </div>
            </div>
        </>
    )
}

export default Manager
