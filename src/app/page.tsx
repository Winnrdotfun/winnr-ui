"use client";

import ContestCard from "@/src/components/Home/ContestCard";
import ChallengeCard from "@/src/components/Home/ChallengeCard";

const Home = () => {
  return (
    <div className="container">
      <div className="max-w-[620px] w-full mx-auto">
        <ContestCard />
        <ChallengeCard />
      </div>
    </div>
  );
};

export default Home;
