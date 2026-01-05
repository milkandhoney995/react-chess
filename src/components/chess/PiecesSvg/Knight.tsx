import { TeamType } from "@/domain/chess/types";

interface Props {
  team: TeamType;
}

const Knight = ({ team }: Props) => {
  const fill = team === TeamType.OUR ? "#ffffff" : "#000000";

  return (
    <svg width='100%' height='100%' viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill={fill}>
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">id="defs4976" /&gt;
        <path fill={fill} d="M60.81 476.91h300v-60h-300v60zm233.79-347.3l13.94 7.39c31.88-43.62 61.34-31.85 61.34-31.85l-21.62 53 35.64 19 2.87 33 64.42 108.75-43.55 29.37s-26.82-36.39-39.65-43.66c-10.66-6-41.22-10.25-56.17-12l-67.54-76.91-12 10.56 37.15 42.31c-.13.18-.25.37-.38.57-35.78 58.17 23 105.69 68.49 131.78H84.14C93 85 294.6 129.61 294.6 129.61z"></path>
      </g>
    </svg>
  );
};

export default Knight;