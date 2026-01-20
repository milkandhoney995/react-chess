'use client';

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import classes from "./PromotionModal.module.scss";
import { PieceSvgMap } from "../PiecesSvg";
import { PieceType, Position, TeamType } from "@/domain/chess/types";
import { PROMOTION_PIECES } from "@/domain/chess/constants";

interface Props {
  position: Position;
  team: TeamType;
  onPromote?: (position: Position, type: PieceType) => void;
}

const PromotionModal = ({ position, team, onPromote }: Props) => {
  const [mounted, setMounted] = useState(false);

  // SSR 対策
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className={classes.promotion__overlay}>
      <div className={classes.promotion__modal}>
        <p className={classes.promotion__title}>昇格する駒を選択</p>

        <div className={classes.promotion__pieces}>
          {PROMOTION_PIECES.map((type) => {
            const SvgPiece = PieceSvgMap[type];
            if (!SvgPiece) return null;

            return (
              <button
                key={type}
                className={classes.promotion__button}
                onClick={() => onPromote?.(position, type)}
              >
                <SvgPiece team={team} />
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PromotionModal;