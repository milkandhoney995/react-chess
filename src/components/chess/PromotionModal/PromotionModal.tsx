'use client';

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import classes from "./PromotionModal.module.scss";
import { Position, TeamType } from "@/domain/chess/types";
import { ChessAction } from "@/features/chess/actions";
import { PROMOTION_PIECES } from "@/domain/chess/constants";

interface Props {
  position: Position;
  team: TeamType;
  dispatch: React.Dispatch<ChessAction>;
}

const PromotionModal = ({ position, team, dispatch }: Props) => {
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
          {PROMOTION_PIECES.map(type => (
            <button
              key={type}
              className={classes.promotion__button}
              onClick={() =>
                dispatch({
                  type: "PROMOTE_PAWN",
                  payload: {
                    position,
                    pieceType: type,
                  },
                })
              }
            >
              <span
                className={[
                  classes.promotion__piece,
                  classes[`promotion__piece--${team === TeamType.OUR ? TeamType.OUR : TeamType.OPPONENT}`],
                  classes[`promotion__piece--${type}`],
                ].join(' ')}
              />
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PromotionModal;