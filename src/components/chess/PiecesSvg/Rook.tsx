import { TeamType } from "@/domain/chess/types";

interface Props {
  team: TeamType;
}

const Rook = ({ team }: Props) => {
  const fill = team === TeamType.OUR ? "#ffffff" : "#000000";

  return (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill={fill}>
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path fill={fill} d="M406 484.7H106v-60h300v60zm-56.67-330.83h-50.05V91.3h-82.39v62.57h-54.22V91.3h-54.23v113.67h295.12V91.3h-54.23v62.57zm23.35 67.23H139.32v187.6h233.36V221.1z"></path>
      </g>
    </svg>
  );
};

export default Rook;