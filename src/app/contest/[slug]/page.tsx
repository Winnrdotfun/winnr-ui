import { FC } from "react";
import BackButton from "@/src/components/common/BackButton";
import ContestCardDetails from "@/src/components/Home/ContestCardDetails";
import Faqs from "@/src/components/Home/Faqs";

const ContestDetail: FC = () => {
  return (
    <div className="container">
      <div className="max-w-[700px] w-full mx-auto">
        <BackButton href="/" />
        <div className="flex items-start gap-4 mt-3 sm:flex-col">
          <ContestCardDetails />
          <Faqs />
        </div>
      </div>
    </div>
  );
};

export default ContestDetail;
