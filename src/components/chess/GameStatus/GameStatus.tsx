'use client';

import styles from "./GameStatus.module.scss";
import { TeamType } from "@/domain/chess/types";

interface Props {
  winningTeam?: TeamType;
  isCheck: boolean;
}

const GameStatus: React.FC<Props> = ({ winningTeam, isCheck }) => {
  if (winningTeam) {
    return (
      <div className={styles.overlay}>
        {winningTeam === TeamType.OUR ? "You Win!" : "You Lose!"}
      </div>
    );
  }

  if (isCheck) {
    return <div className={styles.overlay}>Check!</div>;
  }

  return null;
};

export default GameStatus;