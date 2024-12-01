/* eslint-disable react/button-has-type */
import React from "react";

import { ButtonPropertyTypes } from "@/types";

function Button(props: ButtonPropertyTypes) {
  return (
    <div>
      {props.isLoading ? (
        <button
          className={`w-full px-2 items-center   rounded-sm py-2 mt-[2%] mb-2 inline-flex  justify-center   text-sm font-medium  transition appearance-none cursor-pointer select-none  focus:outline-none focus:ring-2 disabled:pointer-events-none disabled:opacity-75 ${props.bgColor}  ${props.hoverColor} ${props.textColor}  duration-300 text-xs ${props.className}`}
          disabled={props.isLoading}
          type='button'
        >
          <svg
            className='w-5 h-5 mr-3 -ml-1 text-black animate-spin'
            fill='none'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <circle
              className='opacity-25'
              cx={12}
              cy={12}
              r={10}
              stroke='#fff'
              strokeWidth={4}
            />
            <path
              className='opacity-75'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              fill='#fff'
            />
          </svg>

          <span className='ml-2 text-xs'>processing...</span>
        </button>
      ) : (
        <button
          className={`transition ease-in-out  duration-500 hover:-translate-y-1 hover:scale-105 py-4 px-3 flex justify-center items-center rounded-sm ${props.bgColor}  ${props.hoverColor} ${props.textColor} duration-300 text-xs ${props.className}`}
          onClick={props.onClick}
          type={props.type}
        >
          {props.icons && (
            <img
              alt={props.icons}
              className={`h-4  mr-4 ${props.iconClassName}`}
              src={props.icons}
            />
          )}
          {props.title}
        </button>
      )}
    </div>
  );
}

export default Button;
