"use client";
import ButtonV2 from "@/shared/components/buttonV2";
import DashboardLayout from "@/shared/Layouts/DashboardLayout";
import { PDF_ICON, RED_ARROW, SMALL_SEARCH } from "@/utils-func/image_exports";
import Image from "next/image";
import React from "react";

function Document() {
  return (
    <DashboardLayout>
      <div className="p-10">
        <div className="flex flex-col gap-y-1 border-b pb-3">
          <span className="text-[40px] font-semibold text-black">
            Legal Documents
          </span>
          <span className="text-[24px] font-normal text-[#6C7275]">
            List of legal proceedings{" "}
          </span>
        </div>
        <div className="flex items-center w-[360px] my-5 gap-x-2 p-3 border border-[#E8ECEF] rounded-3xl">
          <Image src={SMALL_SEARCH} className="w-[24px] h-[24px]" alt="" />
          <input
            type="text"
            placeholder="Search ..."
            className="text-[17px] placeholder:text-[17px] placeholder:text-[#8A8A8A] font-normal w-full bg-transparent outline-none"
          />
        </div>
        <div className="w-full grid grid-cols-3 gap-5">
          <div className="flex flex-col gap-y-5 w-full items-start border border-[#E8ECEF] rounded-lg p-3">
            <div className="flex items-start gap-x-3">
              <Image src={PDF_ICON} className="w-[40px] h-[40px]" alt="" />
              <span className="font-medium text-sm">
                ABUBAKAR TAFAWA BALEWA UNIVERSITY, BAUCHI ACT, 1988.html
              </span>
            </div>
            <ButtonV2
              title={"View Legal Document"}
              image={RED_ARROW}
              imageSize="w-[14px] h-[14px]"
              btnStyle={"flex items-center gap-x-2 flex-row-reverse"}
              textStyle={"text-[#D84C10] text-xs font-medium"}
              handleClick={function (
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>
              ): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
          <div className="flex flex-col gap-y-5 w-full items-start border border-[#E8ECEF] rounded-lg p-3">
            <div className="flex items-start gap-x-3">
              <Image src={PDF_ICON} className="w-[40px] h-[40px]" alt="" />
              <span className="font-medium text-sm">
                ABUBAKAR TAFAWA BALEWA UNIVERSITY, BAUCHI ACT, 1988.html
              </span>
            </div>
            <ButtonV2
              title={"View Legal Document"}
              image={RED_ARROW}
              imageSize="w-[14px] h-[14px]"
              btnStyle={"flex items-center gap-x-2 flex-row-reverse"}
              textStyle={"text-[#D84C10] text-xs font-medium"}
              handleClick={function (
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>
              ): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
          <div className="flex flex-col gap-y-5 w-full items-start border border-[#E8ECEF] rounded-lg p-3">
            <div className="flex items-start gap-x-3">
              <Image src={PDF_ICON} className="w-[40px] h-[40px]" alt="" />
              <span className="font-medium text-sm">
                ABUBAKAR TAFAWA BALEWA UNIVERSITY, BAUCHI ACT, 1988.html
              </span>
            </div>
            <ButtonV2
              title={"View Legal Document"}
              image={RED_ARROW}
              imageSize="w-[14px] h-[14px]"
              btnStyle={"flex items-center gap-x-2 flex-row-reverse"}
              textStyle={"text-[#D84C10] text-xs font-medium"}
              handleClick={function (
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>
              ): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
          <div className="flex flex-col gap-y-5 w-full items-start border border-[#E8ECEF] rounded-lg p-3">
            <div className="flex items-start gap-x-3">
              <Image src={PDF_ICON} className="w-[40px] h-[40px]" alt="" />
              <span className="font-medium text-sm">
                ABUBAKAR TAFAWA BALEWA UNIVERSITY, BAUCHI ACT, 1988.html
              </span>
            </div>
            <ButtonV2
              title={"View Legal Document"}
              image={RED_ARROW}
              imageSize="w-[14px] h-[14px]"
              btnStyle={"flex items-center gap-x-2 flex-row-reverse"}
              textStyle={"text-[#D84C10] text-xs font-medium"}
              handleClick={function (
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>
              ): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
          <div className="flex flex-col gap-y-5 w-full items-start border border-[#E8ECEF] rounded-lg p-3">
            <div className="flex items-start gap-x-3">
              <Image src={PDF_ICON} className="w-[40px] h-[40px]" alt="" />
              <span className="font-medium text-sm">
                ABUBAKAR TAFAWA BALEWA UNIVERSITY, BAUCHI ACT, 1988.html
              </span>
            </div>
            <ButtonV2
              title={"View Legal Document"}
              image={RED_ARROW}
              imageSize="w-[14px] h-[14px]"
              btnStyle={"flex items-center gap-x-2 flex-row-reverse"}
              textStyle={"text-[#D84C10] text-xs font-medium"}
              handleClick={function (
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>
              ): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
          <div className="flex flex-col gap-y-5 w-full items-start border border-[#E8ECEF] rounded-lg p-3">
            <div className="flex items-start gap-x-3">
              <Image src={PDF_ICON} className="w-[40px] h-[40px]" alt="" />
              <span className="font-medium text-sm">
                ABUBAKAR TAFAWA BALEWA UNIVERSITY, BAUCHI ACT, 1988.html
              </span>
            </div>
            <ButtonV2
              title={"View Legal Document"}
              image={RED_ARROW}
              imageSize="w-[14px] h-[14px]"
              btnStyle={"flex items-center gap-x-2 flex-row-reverse"}
              textStyle={"text-[#D84C10] text-xs font-medium"}
              handleClick={function (
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>
              ): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
          <div className="flex flex-col gap-y-5 w-full items-start border border-[#E8ECEF] rounded-lg p-3">
            <div className="flex items-start gap-x-3">
              <Image src={PDF_ICON} className="w-[40px] h-[40px]" alt="" />
              <span className="font-medium text-sm">
                ABUBAKAR TAFAWA BALEWA UNIVERSITY, BAUCHI ACT, 1988.html
              </span>
            </div>
            <ButtonV2
              title={"View Legal Document"}
              image={RED_ARROW}
              imageSize="w-[14px] h-[14px]"
              btnStyle={"flex items-center gap-x-2 flex-row-reverse"}
              textStyle={"text-[#D84C10] text-xs font-medium"}
              handleClick={function (
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>
              ): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
          <div className="flex flex-col gap-y-5 w-full items-start border border-[#E8ECEF] rounded-lg p-3">
            <div className="flex items-start gap-x-3">
              <Image src={PDF_ICON} className="w-[40px] h-[40px]" alt="" />
              <span className="font-medium text-sm">
                ABUBAKAR TAFAWA BALEWA UNIVERSITY, BAUCHI ACT, 1988.html
              </span>
            </div>
            <ButtonV2
              title={"View Legal Document"}
              image={RED_ARROW}
              imageSize="w-[14px] h-[14px]"
              btnStyle={"flex items-center gap-x-2 flex-row-reverse"}
              textStyle={"text-[#D84C10] text-xs font-medium"}
              handleClick={function (
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>
              ): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
          <div className="flex flex-col gap-y-5 w-full items-start border border-[#E8ECEF] rounded-lg p-3">
            <div className="flex items-start gap-x-3">
              <Image src={PDF_ICON} className="w-[40px] h-[40px]" alt="" />
              <span className="font-medium text-sm">
                ABUBAKAR TAFAWA BALEWA UNIVERSITY, BAUCHI ACT, 1988.html
              </span>
            </div>
            <ButtonV2
              title={"View Legal Document"}
              image={RED_ARROW}
              imageSize="w-[14px] h-[14px]"
              btnStyle={"flex items-center gap-x-2 flex-row-reverse"}
              textStyle={"text-[#D84C10] text-xs font-medium"}
              handleClick={function (
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>
              ): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
          <div className="flex flex-col gap-y-5 w-full items-start border border-[#E8ECEF] rounded-lg p-3">
            <div className="flex items-start gap-x-3">
              <Image src={PDF_ICON} className="w-[40px] h-[40px]" alt="" />
              <span className="font-medium text-sm">
                ABUBAKAR TAFAWA BALEWA UNIVERSITY, BAUCHI ACT, 1988.html
              </span>
            </div>
            <ButtonV2
              title={"View Legal Document"}
              image={RED_ARROW}
              imageSize="w-[14px] h-[14px]"
              btnStyle={"flex items-center gap-x-2 flex-row-reverse"}
              textStyle={"text-[#D84C10] text-xs font-medium"}
              handleClick={function (
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>
              ): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Document;
