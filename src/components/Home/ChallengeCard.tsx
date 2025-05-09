import Image from "next/image";
import challengeImg from "@/src/assets/images/challenge.png";

const ChallengeCard = () => {
  return (
    <div className="bg-gradient-to-t from-[#10171D] to-[#101E2A] mb-5 border border-white/5 rounded-3xl sm:rounded-2xl p-5 relative w-full">
      <div className="absolute top-2 right-0 sm:hidden">
        <Image src={challengeImg} alt="cup" width={260} height={196} />
      </div>

      <div className="max-w-[360px] w-full">
        <div className="body-xs text-white/60 mb-2">1 vs 1</div>
        <h3 className="heading-h2 text-neutral-50 mb-1">
          Challenge your friend
        </h3>
        <p className="heading-h6 text-neutral-500 mb-6">
          Choose token of your choice to challenge your friend with your
          prediction
        </p>
        <button className="bg-[#2E363C] transition-all duration-300 hover:bg-[#2E363C]/80 px-2.5 py-2 text-sm text-white font-bold rounded-lg">
          + Create contest
        </button>
      </div>
    </div>
  );
};

export default ChallengeCard;
