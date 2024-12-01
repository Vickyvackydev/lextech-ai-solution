/* eslint-disable react/jsx-no-useless-fragment */
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { InputProps } from "@/types";

const Input: React.FC<InputProps> = ({
  name,
  type,
  placeholder,
  register,
  error,
}) => {
  const [show, setShow] = useState(false);

  return (
    <>
      {type === "password" ? (
        <div className='mb-3 relative'>
          <input
            autoComplete='off'
            className='border-gray-300 appearance-none  placeholder:text-sm rounded-lg bg-[#F8F8F8] w-full py-4 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline placeholder:text-gray-500 '
            {...register}
            name={name}
            placeholder={placeholder}
            type={show ? "text" : "password"}
          />
          {show ? (
            <FaEye
              className='absolute top-4 right-4 cursor-pointer text-[#C4C4C4] text-2xl'
              onClick={() => setShow(!show)}
            />
          ) : (
            <FaEyeSlash
              className='absolute top-4 right-4 cursor-pointer text-[#C4C4C4] text-2xl'
              onClick={() => setShow(!show)}
            />
          )}
          {error && (
            <span className='error text-[12px] text-red-500'>
              {error?.message}
            </span>
          )}
        </div>
      ) : (
        <div className='mb-3 relative'>
          <input
            autoComplete='off'
            className='border-gray-300 appearance-none  rounded-lg w-full py-4 bg-[#F8F8F8]  px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline placeholder:text-gray-500 placeholder:text-sm'
            {...register}
            name={name}
            placeholder={placeholder}
            type='text'
          />
          {error && (
            <span className='error text-[12px] text-red-500'>
              {error?.message}
            </span>
          )}
        </div>
      )}
    </>
  );
};

export default Input;
