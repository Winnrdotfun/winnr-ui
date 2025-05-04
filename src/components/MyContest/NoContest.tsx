import Link from "next/link";
import Button from "../ui/Button/Button";
import { ReactComponent as ArrowRight } from "@/src/assets/icons/arrow-right.svg";

const NoContest = () => {
  return (
    <div className="bg-neutral-950 flex items-center justify-center flex-col mb-5 border border-white/5 rounded-3xl p-2 relative w-full min-h-[300px]">
      <div className="heading-h3 text-neutral-500 mb-2">No joined contest</div>
      <div className="body-sm text-neutral-500 mb-5">
        Join a contest to see your entries here
      </div>
      <Button size="sm" component={Link} href="/" iconRight={<ArrowRight />}>
        Join Contest
      </Button>
    </div>
  );
};

export default NoContest;
