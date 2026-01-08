'use client';

import React from "react";
import { PieceType, TeamType } from "@/domain/chess/types";
import Pawn from "./Pawn";
import Rook from "./Rook";
import Knight from "./Knight";
import Bishop from "./Bishop";
import Queen from "./Queen";
import King from "./King";

type PieceSvgComponent = React.FC<{ team: TeamType }>;

/**
 * 駒の種類と対応するSVGコンポーネントのマッピング
 * @return 駒の種類ごとのSVGコンポーネントマップ
 */
export const PieceSvgMap: Record<PieceType, PieceSvgComponent> = {
  [PieceType.PAWN]: Pawn,
  [PieceType.ROOK]: Rook,
  [PieceType.KNIGHT]: Knight,
  [PieceType.BISHOP]: Bishop,
  [PieceType.QUEEN]: Queen,
  [PieceType.KING]: King,
};