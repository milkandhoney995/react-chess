import { TeamType } from "@/domain/chess/types";

interface Props {
  team: TeamType;
}

const Pawn = ({ team }: Props) => {
  const fill = team === TeamType.OUR ? "#ffffff" : "#000000";

  return (
    <svg width='100%' height='100%' viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill={fill}>
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path fill={fill} d="M312.07 194.46A56.07 56.07 0 1 1 256 138.39a56.07 56.07 0 0 1 56.07 56.07zM406 418.01H106v60h300v-60zM282.33 261.52a71.81 71.81 0 0 1-52.15.2c-.73 58.91-62.35 114.06-96.75 140.28H378.9c-34.09-26.33-95.44-81.78-96.57-140.48z"></path>
      </g>
    </svg>
  );
};

export default Pawn;