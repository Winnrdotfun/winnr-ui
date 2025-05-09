import Accordion from "../ui/Accordion/Accordion";
import PriceDistribution from "@/src/assets/images/price-distribution.png";
import Image from "next/image";

const faqs = [
  {
    title: "How does it work?",
    content: (
      <ol className="list-decimal pl-4 body-sm text-white/60 flex flex-col gap-3">
        <li>Every player gets 100 Winnr Credits (simulated capital).</li>
        <li>Use credits to draft a portfolio of eligible tokens.</li>
        <li>Use credits to draft a portfolio of eligible tokens.</li>
        <li>ROI is tracked in real time based on live token prices.</li>
        <li>
          After the contest ends, players are ranked by ROI (total return across
          all picks).
        </li>
        <li>
          Top 50% win payouts based on their final ranking.Tiebreaker: If two
          users have the same ROI, the one who joined earlier ranks higher.
        </li>
      </ol>
    ),
  },
  {
    title: "Prize Distribution",
    content: (
      <>
        <ul className="list-disc pl-4 body-sm text-white/60 gap-0.5 flex flex-col mb-4">
          <li>
            Winners are ranked by ROI. The top 50% of players receive payouts
            from the prize pool. <br />
            <br />
            💡 Note: All prizes are paid in real USDC, instantly to your wallet
            after contest ends. <br />
            <br />
            In case of tied ROI, the user who joined earlier gets the higher
            rank.
          </li>
        </ul>

        {/* <ul className="list-disc pl-4 body-sm text-white/60 gap-0.5 flex flex-col mb-4">
          <li>Here is example, if contest is joined by 100 people:</li>
        </ul> */}
        {/* <Image src={PriceDistribution} alt="Prize" /> */}
      </>
    ),
  },
  // {
  //   title: "FAQs",
  //   content: (
  //     <ul className="list-disc pl-4 body-sm text-white/60 gap-0.5 flex flex-col">
  //       <li>Every player gets 100,000 Winnr Credits (simulated capital).</li>
  //       <li>Use credits to draft a portfolio of eligible tokens.</li>
  //       <li>When the contest starts, your picks are locked.</li>
  //       <li>ROI is tracked in real time based on live token prices.</li>
  //       <li>
  //         After the contest ends, players are ranked by ROI (total return across
  //         all picks).
  //       </li>
  //       <li>Top 50% win payouts based on their final ranking.</li>
  //       <li>
  //         📝 Tiebreaker: If two users have the same ROI, the one who joined
  //         earlier ranks higher.
  //       </li>
  //     </ul>
  //   ),
  // },
];
const Faqs = () => {
  return (
    <div className="w-full max-w-[321px] flex flex-col gap-4 sm:max-w-full">
      {faqs.map((faq) => (
        <Accordion.Root type="single" collapsible key={faq.title}>
          <Accordion.Item value={faq.title}>
            <Accordion.Trigger>
              <h3 className="heading-h5 text-white/60">{faq.title}</h3>
            </Accordion.Trigger>
            <Accordion.Content>{faq.content}</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      ))}
    </div>
  );
};

export default Faqs;
