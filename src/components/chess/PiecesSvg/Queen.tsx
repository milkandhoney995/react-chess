import { TeamType } from "@/domain/chess/types";

interface Props {
  team: TeamType;
  size?: number;
}

const Queen = ({ team }: Props) => {
  const fill = team === TeamType.OUR ? "#ffffff" : "#000000";

  return (
    <svg width='100%' height='100%' viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill={fill}>
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path fill={fill} d="M477.518 181.966a25 25 0 0 1-34.91 23l-62.29 150.26h-248.92l-62.24-150.19a25 25 0 1 1 9.73-7.29l87 71.2 20.92-126.4a25 25 0 1 1 14.7-1.85l54.31 117 54.42-117.3a25 25 0 1 1 14.58 2.08l20.93 126.42 87.26-71.3a25 25 0 1 1 44.51-15.63zm-71.66 241.25h-300v60h300v-60zm-27.75-52h-244.22v36h244.22v-36z"></path>
      </g>
    </svg>
  );
};

export default Queen;