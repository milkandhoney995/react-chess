import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';

/**
 * Pre-typed useDispatch hook
 * Use this instead of plain useDispatch for better TypeScript support
 * 
 * @example
 * const dispatch = useAppDispatch();
 * dispatch(movePiece({ pieceId: 'pawn-1', to: { x: 4, y: 4 } }));
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Pre-typed useSelector hook
 * Use this instead of plain useSelector for better TypeScript support
 * 
 * @example
 * const pieces = useAppSelector(state => state.chess.pieces);
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
