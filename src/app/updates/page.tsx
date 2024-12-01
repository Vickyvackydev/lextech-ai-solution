"use client";
import { FAQs } from "@/constants";
import ButtonV2 from "@/shared/components/buttonV2";
import DashboardLayout from "@/shared/Layouts/DashboardLayout";
import {
  ICON_BOX,
  MINUS,
  PLUS,
  UPDATE_IMAGE,
} from "@/utils-func/image_exports";
import Image from "next/image";
import React, { useState } from "react";
import { Fade } from "react-awesome-reveal";

function Updates() {
  const [activeTab, setActiveTab] = useState("update");
  const [selectedFaq, setSelectedFaq] = useState(0);
  return (
    <DashboardLayout>
      <div className="p-10">
        <div className="flex flex-col gap-y-1 border-b pb-3">
          <span className="text-[40px] font-semibold text-black">
            Update and FAQ
          </span>
          <span className="text-[24px] font-normal text-[#6C7275]">
            Features, fixes & improvements.
          </span>
          <div className="flex items-center gap-x-1 mt-9 transition-all duration-300">
            <ButtonV2
              title="Updates"
              btnStyle={`w-[110px] h-[40px] ${
                activeTab === "update" && "bg-[#0084FF]"
              }  rounded-3xl`}
              textStyle={` ${
                activeTab === "update" ? "text-white" : "text-[#6C7275]"
              } `}
              handleClick={() => setActiveTab("update")}
            />
            <ButtonV2
              title="FAQ"
              btnStyle={`w-[110px] h-[40px] ${
                activeTab === "faq" && "bg-[#0084FF]"
              }  rounded-3xl`}
              textStyle={` ${
                activeTab === "faq" ? "text-white" : "text-[#6C7275]"
              } `}
              handleClick={() => setActiveTab("faq")}
            />
          </div>
        </div>
        {activeTab === "update" && (
          <div className="flex flex-col gap-y-8 w-full mt-9 h-[600px] max-h-[600px] overflow-y-scroll">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-y-3">
                <Image src={ICON_BOX} className="w-[60px] h-[60px]" alt="" />
                <span className="text-[#141718] font-semibold text-[18px]">
                  Improved Natural Language Processing (NLP) Algorithms
                </span>
                <span className="text-[#6C727580] font-semibold text-[16px]">
                  22 Feb, 2023
                </span>
              </div>
              <Image
                src={UPDATE_IMAGE}
                className="w-full h-[400.31px] rounded-2xl"
                alt=""
              />
            </div>
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-y-3">
                <Image src={ICON_BOX} className="w-[60px] h-[60px]" alt="" />
                <span className="text-[#141718] font-semibold text-[18px]">
                  Improved Natural Language Processing (NLP) Algorithms
                </span>
                <span className="text-[#6C727580] font-semibold text-[16px]">
                  22 Feb, 2023
                </span>
              </div>
              <Image
                src={UPDATE_IMAGE}
                className="w-full h-[400.31px] rounded-2xl"
                alt=""
              />
            </div>
          </div>
        )}
        {activeTab === "faq" && (
          <div className="flex flex-col gap-y-8 w-full mt-9 h-[600px] max-h-[600px] overflow-y-scroll">
            {FAQs.map((item) => (
              <div className="border-b pb-3 flex items-start gap-x-4 justify-start">
                {selectedFaq === item.id ? (
                  <Image
                    src={MINUS}
                    className="w-[21px] mt-2 cursor-pointer"
                    alt=""
                    onClick={() => setSelectedFaq(0)}
                  />
                ) : (
                  <Image
                    src={PLUS}
                    className="w-[21px] cursor-pointer"
                    alt=""
                    onClick={() => setSelectedFaq(item.id)}
                  />
                )}
                <div className="flex flex-col gap-y-2">
                  <span className="font-medium text-[16px]">
                    {item.question}
                  </span>
                  {selectedFaq === item.id && (
                    <Fade
                      direction="down"
                      duration={500}
                      className="text-[#939393] font-medium text-[16px]"
                    >
                      {item.answer}
                    </Fade>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Updates;
